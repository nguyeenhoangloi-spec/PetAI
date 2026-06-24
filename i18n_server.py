import json
import os
import re
import html
from html.parser import HTMLParser
from breed_names import _COMMON_VI_NAMES

TRANSLATIONS_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "locales", "translations.json")

translations = {}
vi_to_key = {}

def load_translations():
    global translations, vi_to_key
    try:
        with open(TRANSLATIONS_PATH, "r", encoding="utf-8") as f:
            translations = json.load(f)
        
        # Build reverse mapping for Vietnamese messages to key
        if "vi" in translations:
            for key, val in translations["vi"].items():
                if isinstance(val, str):
                    vi_to_key[val.strip()] = key
    except Exception as e:
        print(f"[i18n Server] Error loading translations: {e}")

# Build lookup mapping: VI -> EN
_VI_TO_EN = {}
for en, vi in _COMMON_VI_NAMES.items():
    _VI_TO_EN[vi] = en
    if vi.lower().startswith("chó "):
        _VI_TO_EN[vi[4:].strip()] = en
    else:
        _VI_TO_EN[f"Chó {vi}"] = en

def translate_breed_vi_to_en(vi_name: str) -> str:
    if not vi_name:
        return "Not determined"
    vi_name = vi_name.strip()
    if vi_name.startswith("Nghi lai:"):
        inner = vi_name[9:].strip()
        parts = re.split(r'\s*[x×]\s*', inner)
        translated_parts = [translate_breed_vi_to_en(p) for p in parts]
        return "Crossbreed: " + " x ".join(translated_parts)
    
    # Direct lookup
    if vi_name in _VI_TO_EN:
        return _VI_TO_EN[vi_name]
        
    # Strip prefix
    clean_name = vi_name
    if clean_name.lower().startswith("chó "):
        clean_name = clean_name[4:].strip()
    if clean_name in _VI_TO_EN:
        return _VI_TO_EN[clean_name]
        
    # Case-insensitive fallback
    lower_vi = vi_name.lower()
    lower_clean = clean_name.lower()
    for k, v in _VI_TO_EN.items():
        lower_k = k.lower()
        if lower_k == lower_vi or lower_k == lower_clean or lower_k == f"chó {lower_clean}" or lower_k == f"chó {lower_vi}":
            return v
            
    return vi_name

def translate_warning_text(text: str) -> str:
    text_strip = text.strip()
    if not text_strip:
        return text
    if text_strip.startswith("Ứng viên thuần chủng/chiếm ưu thế:"):
        breed_vi = text_strip.replace("Ứng viên thuần chủng/chiếm ưu thế:", "").replace(".", "").strip()
        breed_en = translate_breed_vi_to_en(breed_vi)
        translated = f"Purebred/dominant candidate: {breed_en}."
    else:
        translated = text_strip
        translated = translated.replace("Độ tin cậy CHÓ từ YOLO chỉ", "YOLO dog confidence is only")
        translated = translated.replace("Kết quả giống dưới đây chỉ mang tính tham khảo.", "Breed results below are for reference only.")
        translated = translated.replace("AI giống đang nghiêng về chó", "AI is leaning towards dog")
        translated = translated.replace("nhưng chưa đủ ngưỡng xác nhận.", "but verification threshold is not met.")
        translated = translated.replace("Ảnh này chưa được nhận diện chắc chắn là CHÓ.", "This photo is not confidently identified as a DOG.")
    
    # Preserve surrounding spaces
    leading = text[:len(text) - len(text.lstrip())]
    trailing = text[len(text.rstrip()):]
    return f"{leading}{translated}{trailing}"

VOID_ELEMENTS = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}

class HTMLTranslator(HTMLParser):
    def __init__(self, lang, dynamic_translations=None):
        super().__init__(convert_charrefs=False)
        self.lang = lang
        self.dynamic_translations = dynamic_translations or {}
        self.result = []
        self.tag_stack = []

    def handle_decl(self, decl):
        self.result.append(f"<!{decl}>")
        
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        # Push to stack ONLY if NOT a void element
        if tag.lower() not in VOID_ELEMENTS:
            self.tag_stack.append([tag, attrs_dict, False])
        
        # Modify html tag lang attribute but KEEP i18n-loading class to prevent FOUT/FOUC on client
        if tag.lower() == "html":
            attrs_dict["lang"] = self.lang
        
        # Translate dynamic attributes
        if "data-i18n-placeholder" in attrs_dict:
            translated = self.get_translation(attrs_dict["data-i18n-placeholder"])
            if translated:
                attrs_dict["placeholder"] = translated
        if "data-i18n-title" in attrs_dict:
            translated = self.get_translation(attrs_dict["data-i18n-title"])
            if translated:
                attrs_dict["title"] = translated
        if "data-i18n-aria" in attrs_dict:
            translated = self.get_translation(attrs_dict["data-i18n-aria"])
            if translated:
                attrs_dict["aria-label"] = translated
                
        # Reconstruct start tag
        attrs_str = "".join(f' {k}="{html.escape(v)}"' if v is not None else f' {k}' for k, v in attrs_dict.items())
        self.result.append(f"<{tag}{attrs_str}>")
        
    def handle_endtag(self, tag):
        self.result.append(f"</{tag}>")
        if self.tag_stack and self.tag_stack[-1][0].lower() == tag.lower():
            self.tag_stack.pop()
            
    def handle_startendtag(self, tag, attrs):
        attrs_dict = dict(attrs)
        
        # Translate dynamic attributes
        if "data-i18n-placeholder" in attrs_dict:
            translated = self.get_translation(attrs_dict["data-i18n-placeholder"])
            if translated:
                attrs_dict["placeholder"] = translated
        if "data-i18n-title" in attrs_dict:
            translated = self.get_translation(attrs_dict["data-i18n-title"])
            if translated:
                attrs_dict["title"] = translated
        if "data-i18n-aria" in attrs_dict:
            translated = self.get_translation(attrs_dict["data-i18n-aria"])
            if translated:
                attrs_dict["aria-label"] = translated

        # Reconstruct startend tag
        attrs_str = "".join(f' {k}="{html.escape(v)}"' if v is not None else f' {k}' for k, v in attrs_dict.items())
        self.result.append(f"<{tag}{attrs_str}/>")

    def handle_data(self, data):
        if self.tag_stack:
            # If this tag or any of its ancestors has already been translated, ignore all subsequent data fragments inside it
            if any(entry[2] for entry in self.tag_stack):
                return
            
            parent_tag, parent_attrs = self.tag_stack[-1][0], self.tag_stack[-1][1]
            
            # Process style tags to remove i18n-loading hiding styles
            if parent_tag.lower() == "style":
                cleaned_style = data
                if "html.i18n-loading body" in cleaned_style or "html.i18n-loading" in cleaned_style:
                    # Remove rules targeting i18n-loading body visibility
                    cleaned_style = re.sub(
                        r'html\.i18n-loading\s+body\s*\{\s*visibility\s*:\s*[^;\}]+!important;\s*\}',
                        '/* i18n-loading rule removed by server */',
                        cleaned_style,
                        flags=re.IGNORECASE
                    )
                self.result.append(cleaned_style)
                return
                
            # Process script tags to prevent classList.add("i18n-loading")
            if parent_tag.lower() == "script":
                cleaned_script = data
                if "i18n-loading" in cleaned_script:
                    cleaned_script = cleaned_script.replace(
                        'document.documentElement.classList.add("i18n-loading");',
                        '/* classList.add("i18n-loading") removed by server */'
                    ).replace(
                        "document.documentElement.classList.add('i18n-loading');",
                        "/* classList.add('i18n-loading') removed by server */"
                    )
                self.result.append(cleaned_script)
                return
            
            # 1. Translate via data-i18n key
            if "data-i18n" in parent_attrs:
                translated = self.get_translation(parent_attrs["data-i18n"])
                if translated:
                    # Mark as translated to prevent duplicates due to HTMLParser split on entities
                    self.tag_stack[-1][2] = True
                    # check for data-code replacement
                    code = parent_attrs.get("data-code")
                    if code is not None:
                        translated = translated.replace("{{ code }}", code)
                    self.result.append(translated)
                    return
            
            # 2. Translate via data-i18n-html key
            elif "data-i18n-html" in parent_attrs:
                translated = self.get_translation(parent_attrs["data-i18n-html"])
                if translated:
                    # Mark as translated
                    self.tag_stack[-1][2] = True
                    self.result.append(translated)
                    return
            
            # 3. Translate via data-i18n-breed key/value
            elif "data-i18n-breed" in parent_attrs:
                # Mark as translated
                self.tag_stack[-1][2] = True
                vi_breed = parent_attrs.get("data-i18n-breed-vi") or parent_attrs.get("data-i18n-breed") or data
                en_breed = parent_attrs.get("data-i18n-breed-en")
                if self.lang == "en":
                    translated = en_breed or translate_breed_vi_to_en(vi_breed)
                else:
                    translated = vi_breed or "Chưa xác định"
                self.result.append(translated)
                return
            
            # 4. Warning notes auto translation
            is_warning = False
            if "warning-note" in parent_attrs.get("class", ""):
                is_warning = True
            elif parent_tag.lower() == "p" and len(self.tag_stack) >= 2:
                grandparent_tag = self.tag_stack[-2][0]
                grandparent_attrs = self.tag_stack[-2][1]
                if "bg-error-container" in grandparent_attrs.get("class", ""):
                    is_warning = True
            
            if is_warning and self.lang == "en":
                # Mark as translated to avoid repeating translation on entity split
                self.tag_stack[-1][2] = True
                self.result.append(translate_warning_text(data))
                return
                
            # 5. Toast messages or elements with data-i18n-auto auto translation
            is_auto = False
            if "data-i18n-auto" in parent_attrs:
                is_auto = True
            elif "toast__message" in parent_attrs.get("class", "") or "toast__title" in parent_attrs.get("class", ""):
                is_auto = True
                
            if is_auto and self.lang == "en":
                # Mark as translated
                self.tag_stack[-1][2] = True
                stripped = data.strip()
                translated = None
                if stripped in vi_to_key:
                    key = vi_to_key[stripped]
                    translated = self.get_translation(key)
                else:
                    translated = translate_dynamic_toast(stripped, self.lang)
                    if translated == stripped:
                        translated = None
                if translated:
                    # Preserve surrounding whitespace
                    leading = data[:len(data) - len(data.lstrip())]
                    trailing = data[len(data.rstrip()):]
                    self.result.append(f"{leading}{translated}{trailing}")
                    return
                    
        self.result.append(data)
        
    def handle_comment(self, data):
        self.result.append(f"<!--{data}-->")
        
    def handle_entityref(self, name):
        if self.tag_stack and any(entry[2] for entry in self.tag_stack):
            return
        self.result.append(f"&{name};")
        
    def handle_charref(self, name):
        if self.tag_stack and any(entry[2] for entry in self.tag_stack):
            return
        self.result.append(f"&#{name};")
        
    def get_translation(self, key):
        if key in self.dynamic_translations:
            return self.dynamic_translations[key]
        return translations.get(self.lang, {}).get(key)


def translate_dynamic_toast(text: str, lang: str) -> str:
    if lang != "en":
        return text
    
    # 1. Chào mừng trở lại, {fullname}!
    if text.startswith("Chào mừng trở lại, ") and text.endswith("!"):
        name = text[len("Chào mừng trở lại, "):-1]
        return f"Welcome back, {name}!"
        
    # 2. Xin chào, {fullname}!
    if text.startswith("Xin chào, ") and text.endswith("!"):
        name = text[len("Xin chào, "):-1]
        return f"Hello, {name}!"
        
    # 3. Đã xóa người dùng {username} thành công.
    if text.startswith("Đã xóa người dùng ") and text.endswith(" thành công."):
        username = text[len("Đã xóa người dùng "):-len(" thành công.")]
        return f"Successfully deleted user {username}."
        
    # 4. Xác thực thành công! Chúc mừng {fullname}, tài khoản của bạn đã được kích hoạt. Vui lòng đăng nhập.
    if text.startswith("Xác thực thành công! Chúc mừng ") and text.endswith(", tài khoản của bạn đã được kích hoạt. Vui lòng đăng nhập."):
        fullname = text[len("Xác thực thành công! Chúc mừng "):-len(", tài khoản của bạn đã được kích hoạt. Vui lòng đăng nhập.")]
        return f"Verification successful! Congratulations {fullname}, your account has been activated. Please log in."
        
    # 5. Đã xác nhận thanh toán cho đơn {order_id}.
    if text.startswith("Đã xác nhận thanh toán cho đơn ") and text.endswith("."):
        order_id = text[len("Đã xác nhận thanh toán cho đơn "):-1]
        return f"Payment confirmed for order {order_id}."
        
    # 5b. Đã từ chối thanh toán cho đơn {order_id}.
    if text.startswith("Đã từ chối thanh toán cho đơn ") and text.endswith("."):
        order_id = text[len("Đã từ chối thanh toán cho đơn "):-1]
        return f"Payment rejected for order {order_id}."
        
    # 5c. Thanh toán thành công cho đơn {order_id}.
    if text.startswith("Thanh toán thành công cho đơn ") and text.endswith("."):
        order_id = text[len("Thanh toán thành công cho đơn "):-1]
        return f"Payment successful for order {order_id}."
        
    # 6. Đã xóa lịch sử nhận diện. (Đã xóa {deleted_files} ảnh lưu trữ)
    match_history = re.match(r'Đã xóa lịch sử nhận diện\.\s*\(Đã xóa (\d+) ảnh lưu trữ\)', text)
    if match_history:
        count = match_history.group(1)
        return f"Cleared prediction history. (Deleted {count} archived images)"
        
    # 7. Đã cấp gói {plan} cho người dùng thành công.
    match_plan = re.match(r'Đã cấp gói (.*?) cho người dùng thành công\.', text)
    if match_plan:
        plan = match_plan.group(1)
        return f"Successfully assigned package {plan} to user."

    # 7b. Đã cấp gói {plan} cho user #{user_id}.
    match_plan_user = re.match(r'Đã cấp gói (.*?) cho user #(\d+)\.', text)
    if match_plan_user:
        return f"Successfully assigned package {match_plan_user.group(1)} to user #{match_plan_user.group(2)}."

    # 7c. Đã khóa tài khoản {username} thành công.
    if text.startswith("Đã khóa tài khoản ") and text.endswith(" thành công."):
        username = text[len("Đã khóa tài khoản "):-len(" thành công.")]
        return f"Successfully locked account {username}."

    # 7d. Đã mở khóa tài khoản {username} thành công.
    if text.startswith("Đã mở khóa tài khoản ") and text.endswith(" thành công."):
        username = text[len("Đã mở khóa tài khoản "):-len(" thành công.")]
        return f"Successfully unlocked account {username}."
        
    # 8. Đã cập nhật nội dung trang {page}.
    match_page = re.match(r'Đã cập nhật nội dung trang (.*?)\.', text)
    if match_page:
        page = match_page.group(1)
        return f"Updated content for page {page}."
        
    # 9. Gói {plan_label} vừa mua thành công.
    match_purchase = re.match(r'Gói (.*?) vừa mua thành công\.', text)
    if match_purchase:
        plan_label = match_purchase.group(1)
        return f"Package {plan_label} purchased successfully."
        
    # 10. Mã OTP không chính xác. Bạn còn {attempts} lần nhập. / lần thử.
    match_otp = re.match(r'Mã OTP không chính xác\.\s*Bạn còn (\d+) (lần nhập|lần thử)\.', text)
    if match_otp:
        attempts = match_otp.group(1)
        return f"Incorrect OTP. You have {attempts} attempts left."

    # Account deletion responses mappings
    if text == "Chưa đăng nhập.":
        return "Not logged in."
    if text == "Không tìm thấy tài khoản.":
        return "Account not found."
    if text == "Tài khoản đã trong trạng thái chờ xóa.":
        return "Account is already pending deletion."
    if text == "Tài khoản đã bị xóa.":
        return "Account has been deleted."
    if text == "Mã OTP không hợp lệ.":
        return "Invalid OTP."
    if text == "Tài khoản không ở trạng thái hợp lệ để xóa.":
        return "Account is not in a valid state to be deleted."
    if text == "Mã OTP đã hết hạn. Vui lòng yêu cầu lại.":
        return "OTP expired. Please request a new one."
    if text == "Bạn đã nhập sai quá nhiều lần. Vui lòng thử lại sau 10 phút.":
        return "You entered it incorrectly too many times. Please try again in 10 minutes."
    if text == "Mã OTP không hợp lệ hoặc đã hết hạn.":
        return "Invalid or expired OTP."
    if text == "Yêu cầu xóa tài khoản đã được ghi nhận.":
        return "Account deletion request has been recorded."
    if text == "Lỗi hệ thống. Vui lòng thử lại.":
        return "System error. Please try again."
    if text == "Mã OTP đã được gửi về email của bạn.":
        return "OTP code has been sent to your email."
    if text == "Mã OTP mới đã được gửi.":
        return "New OTP code has been sent."
    if text == "Mã OTP khôi phục đã được gửi về email của bạn.":
        return "Recovery OTP code has been sent to your email."
    if text == "Tài khoản của bạn đã được khôi phục thành công!":
        return "Your account has been successfully restored!"
        
    # 11. Lỗi: {error}
    if text.startswith("Lỗi: "):
        err_msg = text[len("Lỗi: "):]
        return f"Error: {err_msg}"
        
    # 12. Lỗi tải lên logo: {e}
    if text.startswith("Lỗi tải lên logo: "):
        err_msg = text[len("Lỗi tải lên logo: "):]
        return f"Error uploading logo: {err_msg}"
        
    # 13. Lỗi tải lên favicon: {e}
    if text.startswith("Lỗi tải lên favicon: "):
        err_msg = text[len("Lỗi tải lên favicon: "):]
        return f"Error uploading favicon: {err_msg}"
        
    return text


def translate_html(html_content: str, lang: str, dynamic_translations: dict = None) -> str:
    if lang not in {"en", "vi"}:
        return html_content
    try:
        parser = HTMLTranslator(lang, dynamic_translations)
        parser.feed(html_content)
        return "".join(parser.result)
    except Exception as e:
        print(f"[i18n Server] Error parsing HTML: {e}")
        return html_content

# Initialize translations
load_translations()

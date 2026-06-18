import re

def check_html_tags(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Strip Jinja2 control blocks to avoid confusion
    content = re.sub(r'\{%.*?%\}', '', content)
    content = re.sub(r'\{\{.*?\}\}', '', content)
    
    # Regex to find HTML tags (ignoring self-closing tags and comments)
    tag_regex = re.compile(r'<!--.*?-->|<(!DOCTYPE|html|head|body|meta|link|script|style|nav|div|a|img|span|noscript|main|aside|section|h1|h2|h3|h4|p|article|header|footer|ul|li|button|form|input|hr|table|tr|td|th|tbody|thead|select|option|label|noscript|textarea|canvas|i|b|strong|em|u|svg|path|g|br)(?:\s+[^>]*?)?(/?\s*)>', re.IGNORECASE | re.DOTALL)
    
    stack = []
    lines = content.split('\n')
    
    self_closing = {'meta', 'link', 'img', 'input', 'hr', 'br'}
    
    for line_num, line in enumerate(lines, 1):
        # find all tags in line
        for match in re.finditer(r'<(/?[a-zA-Z1-6]+)(?:\s+[^>]*?)?/?>', line):
            tag_name = match.group(1).lower()
            if tag_name.startswith('/'):
                # Closing tag
                tag_name = tag_name[1:]
                if tag_name in self_closing:
                    continue
                if not stack:
                    print(f"Unmatched closing tag </{tag_name}> at line {line_num}")
                else:
                    last_tag, last_line = stack.pop()
                    if last_tag != tag_name:
                        print(f"Mismatched tag: expected </{last_tag}> (opened at line {last_line}), got </{tag_name}> at line {line_num}")
                        stack.append((last_tag, last_line)) # put it back
            else:
                # Opening tag
                if tag_name in self_closing:
                    continue
                if line.strip().endswith('/>') or match.group(0).endswith('/>'):
                    continue
                stack.append((tag_name, line_num))
                
    print("\nRemaining open tags in stack:")
    for tag, line in stack:
        print(f"<{tag}> opened at line {line}")

if __name__ == '__main__':
    check_html_tags(r'd:\KhoaLuan - Copy (new) - Copy\templates\user_detail.html')

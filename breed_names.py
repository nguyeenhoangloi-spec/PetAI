import re
from typing import Dict


_PREFIX_RE = re.compile(r"^\d+-n\d{6}-", re.IGNORECASE)
_MULTI_SPACE_RE = re.compile(r"\s+")
_HYBRID_SPLIT_RE = re.compile(r"\s*[x×]\s*", re.IGNORECASE)
_ASCII_TEXT_RE = re.compile(r"^[A-Za-z0-9 &'().-]+$")

_LOWERCASE_WORDS = {
	"and",
	"of",
	"the",
	"a",
	"an",
	"in",
	"on",
	"for",
	"to",
	"de",
	"des",
	"du",
	"la",
	"le",
	"van",
	"von",
}

_MANUAL_CANONICAL: Dict[str, str] = {
	"fila braziliero": "Fila Brasileiro",
	"cane carso": "Cane Corso",
	"brabancon griffo": "Brabancon Griffon",
	"japanese spitzes": "Japanese Spitz",
	"lhasa": "Lhasa",
	"bac ha dog": "Bac Ha Dog",
	"hmong bobtail dog": "Hmong Bobtail Dog",
	"vietnamese native dog": "Vietnamese Native Dog",
}

_COMMON_VI_NAMES: Dict[str, str] = {
	"Unknown": "Không xác định",
	"Shiba Dog": "Shiba",
	"French Bulldog": "Bulldog Pháp",
	"Siberian Husky": "Husky Siberia",
	"Malamute": "Alaska Malamute",
	"Pomeranian": "Phốc sóc",
	"Pembroke": "Corgi Pembroke",
	"Cardigan": "Corgi Cardigan",
	"German Shepherd": "Béc-giê Đức",
	"Labrador Retriever": "Labrador",
	"Golden Retriever": "Golden",
	"Chihuahua": "Chihuahua",
	"Pug": "Pug",
	"Shih Tzu": "Shih Tzu",
	"Maltese Dog": "Maltese",
	"Pekinese": "Bắc Kinh",
	"Papillon": "Papillon",
	"Miniature Pinscher": "Phốc hươu",
	"Boston Bull": "Boston Terrier",
	"Boxer": "Boxer",
	"Bichon Frise": "Bichon Frise",
	"Chow": "Chow Chow",
	"Rottweiler": "Rottweiler",
	"Doberman": "Doberman",
	"Saint Bernard": "Saint Bernard",
	"Samoyed": "Samoyed",
	"Tibetan Mastiff": "Ngao Tây Tạng",
	"Great Dane": "Ngao Đức",
	"Great Pyrenees": "Great Pyrenees",
	"Bull Mastiff": "Bullmastiff",
	"Miniature Poodle": "Poodle Mini",
	"Toy Poodle": "Poodle Toy",
	"Standard Poodle": "Poodle Standard",
	"Miniature Schnauzer": "Schnauzer Mini",
	"Standard Schnauzer": "Schnauzer Standard",
	"Giant Schnauzer": "Schnauzer Giant",
	"West Highland White Terrier": "Westie",
	"American Staffordshire Terrier": "Amstaff",
	"Staffordshire Bullterrier": "Staffordshire Bull Terrier",
	"Scotch Terrier": "Scottie",
	"Yorkshire Terrier": "Yorkshire Terrier",
	"Basset": "Basset Hound",
	"Beagle": "Beagle",
	"Cocker Spaniel": "Cocker",
	"Blenheim Spaniel": "Cavalier King Charles (Blenheim)",
	"English Springer": "Springer Anh",
	"Welsh Springer Spaniel": "Springer xứ Wales",
	"Irish Setter": "Irish Setter",
	"English Setter": "Setter Anh",
	"Irish Terrier": "Irish Terrier",
	"Gordon Setter": "Gordon Setter",
	"German Short Haired Pointer": "Pointer Đức",
	"Chesapeake Bay Retriever": "Chesapeake Retriever",
	"Curly Coated Retriever": "Curly-coated Retriever",
	"Flat Coated Retriever": "Flat-coated Retriever",
	"Shetland Sheepdog": "Sheltie",
	"Border Collie": "Border Collie",
	"Old English Sheepdog": "Bobtail",
	"Malinois": "Béc-giê Bỉ Malinois",
	"Groenendael": "Béc-giê Bỉ Groenendael",
	"Cane Corso": "Cane Corso",
	"Fila Brasileiro": "Fila Brasileiro",
	"Chinese Crested Dog": "Chó mào Trung Quốc",
	"Chinese Rural Dog": "Chó cỏ Trung Quốc",
	"Mexican Hairless": "Mexican Hairless",
	"Vietnamese Native Dog": "Chó ta Việt Nam",
	"Bac Ha Dog": "Chó Bắc Hà",
	"Hmong Bobtail Dog": "Chó H'Mông cộc đuôi",
	"Teddy": "Teddy",
	"Black and Tan Coonhound": "Black and Tan Coonhound",
	"Bluetick": "Bluetick Coonhound",
	"Redbone": "Redbone Coonhound",
	"Walker Hound": "Treeing Walker Coonhound",
	"Airedale": "Airedale Terrier",
	"Border Terrier": "Border Terrier",
	"Norwich Terrier": "Norwich Terrier",
	"Norfolk Terrier": "Norfolk Terrier",
	"Lakeland Terrier": "Lakeland Terrier",
	"Bedlington Terrier": "Bedlington Terrier",
	"Sealyham Terrier": "Sealyham Terrier",
	"Silky Terrier": "Silky Terrier",
	"Toy Terrier": "Toy Terrier",
	"Kerry Blue Terrier": "Kerry Blue Terrier",
	"Wire Haired Fox Terrier": "Wire Fox Terrier",
	"Soft Coated Wheaten Terrier": "Wheaten Terrier",
	"Norwegian Elkhound": "Elkhound Na Uy",
	"Rhodesian Ridgeback": "Ridgeback Rhodesia",
	"Irish Wolfhound": "Irish Wolfhound",
	"Scottish Deerhound": "Deerhound Scotland",
	"Italian Greyhound": "Greyhound Ý",
	"Whippet": "Whippet",
	"Borzoi": "Borzoi",
	"Afghan Hound": "Afghan Hound",
	"Saluki": "Saluki",
	"Ibizan Hound": "Ibizan Hound",
	"Vizsla": "Vizsla",
	"Weimaraner": "Weimaraner",
	"Otterhound": "Otterhound",
	"Bloodhound": "Bloodhound",
	"English Foxhound": "Foxhound Anh",
	"Japanese Spaniel": "Chin Nhật",
	"Japanese Spitz": "Spitz Nhật",
	"Eskimo Dog": "Eskimo Mỹ",
	"Keeshond": "Keeshond",
	"Newfoundland": "Newfoundland",
	"Bernese Mountain Dog": "Bernese Mountain Dog",
	"Greater Swiss Mountain Dog": "Greater Swiss Mountain Dog",
	"Entlebucher": "Entlebucher",
	"Appenzeller": "Appenzeller",
	"Kuvasz": "Kuvasz",
	"Komondor": "Komondor",
	"Leonberg": "Leonberger",
	"Lhasa": "Lhasa",
	"Dandie Dinmont": "Dandie Dinmont Terrier",
	"Schipperke": "Schipperke",
	"Affenpinscher": "Affenpinscher",
	"Basenji": "Basenji",
	"Dhole": "Dhole",
	"Dingo": "Dingo",
	"African Hunting Dog": "Chó hoang châu Phi",
	"Briard": "Briard",
	"Collie": "Collie",
	"Australian Shepherd": "Shepherd Úc",
	"Australian Terrier": "Terrier Úc",
	"Bouvier des Flandres": "Bouvier des Flandres",
	"Brabancon Griffon": "Brussels Griffon",
	"Kelpie": "Kelpie",
	"Clumber": "Clumber Spaniel",
	"Irish Water Spaniel": "Irish Water Spaniel",
	"Brittany Spaniel": "Brittany Spaniel",
	"Sussex Spaniel": "Sussex Spaniel",
	"Tibetan Terrier": "Terrier Tây Tạng",
	"Cairn": "Cairn Terrier",
}


def _title_token(token: str, index: int) -> str:
	if not token:
		return token
	if token in {"ii", "iii", "iv", "vi"}:
		return token.upper()
	if index > 0 and token in _LOWERCASE_WORDS:
		return token
	if "'" in token:
		parts = [p.capitalize() for p in token.split("'")]
		return "'".join(parts)
	return token.capitalize()


def normalize_breed_label(raw_name: str) -> str:
	if raw_name is None:
		return "Unknown"

	label = str(raw_name).strip()
	if not label:
		return "Unknown"

	if label.lower() in {"unknown", "khong xac dinh", "không xác định"}:
		return "Unknown"

	label = _PREFIX_RE.sub("", label)
	label = label.replace("_", " ").replace("/", " ").replace("-", " ")
	label = _MULTI_SPACE_RE.sub(" ", label).strip().lower()
	if not label:
		return "Unknown"

	if label in _MANUAL_CANONICAL:
		return _MANUAL_CANONICAL[label]

	tokens = [tok for tok in label.split(" ") if tok]
	if not tokens:
		return "Unknown"

	return " ".join(_title_token(token, idx) for idx, token in enumerate(tokens))


def _clean_text(text: str) -> str:
	return _MULTI_SPACE_RE.sub(" ", str(text or "").strip())


def _needs_dog_prefix(label: str) -> bool:
	clean_label = _clean_text(label)
	if not clean_label:
		return False

	lower_label = clean_label.lower()
	if lower_label in {"không xác định", "khong xac dinh"}:
		return False
	if lower_label.startswith(("chó ", "nghi lai", "ngao ", "béc", "phốc ")):
		return False

	return bool(_ASCII_TEXT_RE.fullmatch(clean_label))


def to_common_vietnamese_breed_name(raw_name: str) -> str:
	if raw_name is None:
		return "Không xác định"

	raw_text = _clean_text(str(raw_name))
	if not raw_text:
		return "Không xác định"

	lower_text = raw_text.lower()
	if lower_text in {"unknown", "khong xac dinh", "không xác định"}:
		return "Không xác định"

	if lower_text.startswith("nghi lai"):
		body = raw_text.split(":", 1)[1] if ":" in raw_text else raw_text[8:]
		parts = [p.strip() for p in _HYBRID_SPLIT_RE.split(body) if p.strip()]
		if len(parts) >= 2:
			left = to_common_vietnamese_breed_name(parts[0])
			right = to_common_vietnamese_breed_name(parts[1])
			return f"Nghi lai: {left} x {right}"
		return raw_text

	if lower_text.startswith("chó "):
		return raw_text

	canonical = normalize_breed_label(raw_text)
	if canonical == "Unknown":
		return "Không xác định"

	if canonical in _COMMON_VI_NAMES:
		mapped_name = _clean_text(_COMMON_VI_NAMES[canonical])
		if _needs_dog_prefix(mapped_name):
			return f"Chó {mapped_name}"
		return mapped_name

	if canonical.endswith(" Dog"):
		short_name = canonical[: -len(" Dog")].strip()
		if short_name in _COMMON_VI_NAMES:
			return _clean_text(_COMMON_VI_NAMES[short_name])
		return f"Chó {short_name}"

	return f"Chó {canonical}"

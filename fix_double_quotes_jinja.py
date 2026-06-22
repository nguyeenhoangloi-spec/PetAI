import re

with open('d:/KhoaLuan - Copy (new) - Copy/templates/user-guide.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r"get_config\('site_email',\s*'support@pet\.ai'\)", 'get_config("site_email", "support@pet.ai")', content)
content = re.sub(r"get_config\('contact_phone',\s*'0916 416 409'\)", 'get_config("contact_phone", "0916 416 409")', content)
content = re.sub(r"get_config\('site_name',\s*'PetAI'\)", 'get_config("site_name", "PetAI")', content)

with open('d:/KhoaLuan - Copy (new) - Copy/templates/user-guide.html', 'w', encoding='utf-8') as f:
    f.write(content)

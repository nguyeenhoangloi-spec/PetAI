import re

for filename in ['support.html', 'user-guide.html']:
    filepath = f'd:/KhoaLuan - Copy (new) - Copy/templates/{filename}'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # We want to replace any literal string like: 
    # {{ get_config('site_email', 'support@pet.ai') }} 
    # that has been accidentally nested inside another get_config or string concatenation.
    
    # In support.html, we have:
    # ~ get_config('site_email', '{{ get_config('site_email', 'support@pet.ai') }}') ~
    content = content.replace(
        "~ get_config('site_email', '{{ get_config('site_email', 'support@pet.ai') }}') ~",
        "~ get_config('site_email', 'support@pet.ai') ~"
    )
    content = content.replace(
        "{{ get_config('site_email', '{{ get_config('site_email', 'support@pet.ai') }}') }}",
        "{{ get_config('site_email', 'support@pet.ai') }}"
    )
    content = content.replace(
        "{{ get_config('contact_phone', '{{ get_config('contact_phone', '0916 416 409') }}') }}",
        "{{ get_config('contact_phone', '0916 416 409') }}"
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Fixed {filename}')

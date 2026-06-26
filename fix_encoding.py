#!/usr/bin/env python3
"""Fix remaining mojibake by scanning for high-byte runs including adjacent ASCII"""
import sys, re
sys.stdout.reconfigure(encoding='utf-8')

def try_fix(s):
    try:
        result = s.encode('latin-1').decode('utf-8')
        if len(result) < len(s):
            return result
    except:
        pass
    return s

with open('templates/upgrade.html', 'r', encoding='utf-8') as f:
    text = f.read()

print(f'Input: {len(text)} chars')

# This time: find runs of chars where at least ONE is non-ASCII,
# bounded by clear ASCII boundaries (spaces, <, >, ", ', =)
# Pattern: sequence that contains non-ASCII chars possibly mixed with alpha chars

# Match sequences of word-chars (including high chars) that contain at least 1 non-ASCII
mixed_re = re.compile(r'[^\s<>="\'\n\r\t,;:!?/\\(){}\[\]&|^~`@#$%*+]{2,}')

def fix_match(m):
    s = m.group(0)
    # Only try to fix if it has non-ASCII
    if all(ord(c) < 128 for c in s):
        return s
    fixed = try_fix(s)
    return fixed

new_text = mixed_re.sub(fix_match, text)

# Count changes
changes = sum(1 for a, b in zip(text, new_text) if a != b)
print(f'Changed: {changes} chars')

with open('templates/upgrade.html', 'w', encoding='utf-8', newline='') as f:
    f.write(new_text)
print('Saved!')

# Spot check specific known-garbled strings
for bad in ['LÃ†\u00b0ợt', 'Ã„â€˜ời', 'KhÃƒ´ng', 'cÃƒ²n', 'thoải mÃƒ¡i']:
    cnt = new_text.count(bad)
    status = 'FIXED' if cnt == 0 else f'STILL BAD x{cnt}'
    print(f'  {repr(bad)}: {status}')
    
# Also check comparison table area
idx = new_text.find('compSubtitle')
if idx >= 0:
    print(f'\nSubtitle: {new_text[idx:idx+80]}')

print('\nDone!')

import re

def check_html_tags(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Strip HTML comments
    content = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL)
    
    # Strip Jinja2 control blocks {% ... %} and {{ ... }}
    content = re.sub(r'\{%.*?%\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\{\{.*?\}\}', '', content, flags=re.DOTALL)
    
    # Find all HTML tags including multi-line
    # We match < followed by optional / and letters, then anything up to the closing >
    tag_pattern = re.compile(r'<(/?[a-zA-Z1-6]+)(?:\s+[^>]*?)?/?>', re.DOTALL)
    
    self_closing = {'meta', 'link', 'img', 'input', 'hr', 'br', 'source', 'col'}
    
    stack = []
    
    # Let's count lines to map character positions to line numbers
    line_starts = [0]
    for m in re.finditer(r'\n', content):
        line_starts.append(m.end())
        
    def get_line_num(pos):
        # binary search or simple loop
        for i, start in enumerate(line_starts):
            if start > pos:
                return i
        return len(line_starts)

    for match in tag_pattern.finditer(content):
        tag_raw = match.group(0)
        tag_name = match.group(1).lower()
        pos = match.start()
        line_num = get_line_num(pos)
        
        # Check if it's self-closing by name or trailing slash
        if tag_name in self_closing or tag_raw.endswith('/>'):
            continue
            
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
                    print(f"Mismatched tag at line {line_num}: expected </{last_tag}> (opened at line {last_line}), got </{tag_name}>")
                    # Push expected back to try and recover
                    stack.append((last_tag, last_line))
        else:
            # Opening tag
            stack.append((tag_name, line_num))
            
    print("\nRemaining open tags in stack:")
    for tag, line in stack:
        print(f"<{tag}> opened at line {line}")

if __name__ == '__main__':
    check_html_tags(r'd:\KhoaLuan - Copy (new) - Copy\templates\user_detail.html')

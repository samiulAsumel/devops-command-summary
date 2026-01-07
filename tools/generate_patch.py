#!/usr/bin/env python3
import re
import sys


def generate_aggressive_patch(filename):
    """Generate patch with ALL command-like replacements (including risky ones)."""
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern: lines outside <pre><code>...</code></pre> and <script>...</script>
    # Split by major blocks
    parts = re.split(r'(<script>.*?</script>|<pre><code>.*?</code></pre>)', content, flags=re.DOTALL)
    
    patch_lines = []
    safe_count = 0
    risky_count = 0
    
    for i, part in enumerate(parts):
        # Skip script and pre blocks
        if '<script>' in part or '<pre><code>' in part:
            continue
        
        # Find <p> tags that contain commands
        matches = re.finditer(r'<p>([^<]+)</p>', part)
        for m in matches:
            inner = m.group(1).strip()
            # Check if it looks command-like
            if re.match(r'^(Position|Positions|r=read|#|/)', inner):
                wrapped = f'<pre><code>\n{inner}\n</code></pre>'
                old = m.group(0)
                is_safe = 'Position' in inner or 'r=read' in inner  # permission explanations
                
                patch_lines.append({
                    'old': old,
                    'new': wrapped,
                    'safe': is_safe,
                    'context': part[max(0, m.start()-50):m.end()+50]
                })
                
                if is_safe:
                    safe_count += 1
                else:
                    risky_count += 1
    
    print(f"PATCH PREVIEW: {safe_count} SAFE, {risky_count} RISKY\n")
    
    for idx, p in enumerate(patch_lines):
        status = "SAFE" if p['safe'] else "RISKY"
        print(f"\n[{status}] Change {idx+1}:")
        print(f"OLD: {p['old']}")
        print(f"NEW: {p['new']}")
        print(f"Context: ...{p['context']}...")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: generate_patch.py <file>')
        sys.exit(1)
    generate_aggressive_patch(sys.argv[1])

#!/usr/bin/env python3
"""
Compare command_summary.txt (base file) with HTML files to ensure all content is present
"""

import re
from pathlib import Path

base_file = r"d:\02. Personal\Command Summary\command_summary.txt"
html_files = [
    r"d:\02. Personal\Command Summary\system-admin.html",
    r"d:\02. Personal\Command Summary\devops-tools.html",
    r"d:\02. Personal\Command Summary\monitoring-security.html"
]

# Read base file
with open(base_file, 'r', encoding='utf-8') as f:
    base_content = f.read()

# Extract commands from base file (lines that start with actual commands)
base_commands = []
for line in base_content.split('\n'):
    # Match lines that are actual commands (start with word char, not headers or comments)
    if re.match(r'^[a-z/~.]', line.strip()) and '#' in line:
        # Extract the command part only
        cmd = line.split('#')[0].strip()
        if cmd and len(cmd) > 2:
            base_commands.append(cmd)

print(f"Base file (command_summary.txt):")
print(f"  Total lines: {len(base_content.split(chr(10)))}")
print(f"  Commands found: {len(base_commands)}")
print()

# Check each HTML file
for html_file in html_files:
    with open(html_file, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    # Extract commands from HTML (looking for <code> blocks)
    html_commands = []
    code_blocks = re.findall(r'<code[^>]*>(.*?)</code>', html_content, re.DOTALL)
    for block in code_blocks:
        for line in block.split('\n'):
            if re.match(r'^[a-z/~.]', line.strip()) and '#' in line:
                cmd = line.split('#')[0].strip()
                if cmd and len(cmd) > 2:
                    html_commands.append(cmd)
    
    # Compare
    filename = Path(html_file).name
    print(f"{filename}:")
    print(f"  Total lines: {len(html_content.split(chr(10)))}")
    print(f"  Commands found in code blocks: {len(html_commands)}")
    
    # Find commands in base but not in HTML
    missing = [c for c in base_commands if c not in html_commands]
    extra = [c for c in html_commands if c not in base_commands]
    
    if missing:
        print(f"  ⚠️  Missing commands ({len(missing)}): {missing[:5]}")
    if extra:
        print(f"  ✅ Extra/Similar commands ({len(extra)})")
    
    if not missing and not extra:
        print(f"  ✅ All commands match!")
    print()

print("=" * 60)
print("Summary:")
print(f"Base file: {len(base_commands)} commands")
print(f"HTML files should contain the same commands (may be reorganized)")

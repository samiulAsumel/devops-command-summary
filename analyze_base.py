#!/usr/bin/env python3
"""
Detailed comparison: base file vs HTML files
Extract commands and explanations from base file and verify they're in HTML
"""

import re
from pathlib import Path
from collections import defaultdict

base_file = r"d:\02. Personal\Command Summary\command_summary.txt"

# Read base file
with open(base_file, 'r', encoding='utf-8') as f:
    base_content = f.read()

# Parse base file to extract sections and commands
sections = defaultdict(list)
current_section = None
current_subsection = None

for line in base_content.split('\n'):
    line_stripped = line.strip()
    
    # Check for section headers (uppercase, single digit number)
    if re.match(r'^\d+\.\s+[A-Z]', line_stripped):
        current_section = line_stripped
        continue
    
    # Check for subsection headers (# followed by text)
    if line_stripped.startswith('# ') and not (re.match(r'[a-z/~.]', line_stripped[2:3])):
        current_subsection = line_stripped[2:]  # Remove '# '
        continue
    
    # Actual command lines (start with lowercase or path)
    if re.match(r'^[a-z/~.]', line_stripped) and current_section:
        sections[current_section].append({
            'subsection': current_subsection,
            'raw_line': line,
            'command': line_stripped
        })

print("=" * 80)
print("BASE FILE ANALYSIS: command_summary.txt")
print("=" * 80)
print(f"\nTotal sections found: {len(sections)}")
print(f"Total commands: {sum(len(cmds) for cmds in sections.values())}\n")

for section, commands in list(sections.items())[:3]:
    print(f"\n{section}")
    print(f"  Commands: {len(commands)}")
    for cmd in commands[:3]:
        print(f"    - {cmd['command'][:80]}")
    if len(commands) > 3:
        print(f"    ... and {len(commands) - 3} more")

print("\n" + "=" * 80)
print("Next: Check which commands are in HTML files...")
print("=" * 80)

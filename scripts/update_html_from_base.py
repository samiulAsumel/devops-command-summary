#!/usr/bin/env python3
import re
import os
from pathlib import Path

# Detect base file location
possible_base_paths = [
    "command_summary.txt",
    "../command_summary.txt", 
    "../../command_summary.txt",
    os.path.expanduser("~/command_summary.txt"),
    "/tmp/command_summary.txt"
]

base_path = None
for path in possible_base_paths:
    if os.path.exists(path):
        base_path = Path(path)
        break

if not base_path:
    print("Error: command_summary.txt not found in expected locations")
    exit(1)

# Detect HTML files in current directory and parent directories
html_files = {}
html_search_paths = ["", "../", "../../"]
for search_path in html_search_paths:
    if os.path.exists(os.path.join(search_path, "system-admin.html")):
        html_files[range(1,11)] = Path(os.path.join(search_path, "system-admin.html"))
    if os.path.exists(os.path.join(search_path, "devops-tools.html")):
        html_files[range(11,24)] = Path(os.path.join(search_path, "devops-tools.html"))
    if os.path.exists(os.path.join(search_path, "monitoring-security.html")):
        html_files[range(24,30)] = Path(os.path.join(search_path, "monitoring-security.html"))

if not html_files:
    print("Error: No HTML files found in expected locations")
    exit(1)

# Parse base file into sections keyed by section number
base_text = base_path.read_text(encoding='utf-8')
lines = base_text.splitlines()
sections = {}
current_sec = None
for line in lines:
    m = re.match(r'^(\d+)\.\s*(.+)', line)
    if m:
        current_sec = int(m.group(1))
        sections[current_sec] = []
        continue
    if current_sec is None:
        continue
    # command lines: start with letter, /, ., ~ or contain '#'
    if re.match(r'^\s*[a-z0-9~/\.-]', line, re.I):
        # keep full line
        sections[current_sec].append(line.rstrip())

# Helper to format a command line with comment aligned at column 65
def format_with_comment(line):
    if '#' in line:
        parts = line.split('#', 1)
        cmd = parts[0].rstrip()
        comment = '# ' + parts[1].strip()
    else:
        cmd = line.rstrip()
        comment = ''
    if not cmd:
        return line
    # target column index for '#'
    target_col = 65
    # current length of cmd
    cmd_len = len(cmd)
    if comment:
        spaces = target_col - cmd_len - 1
        if spaces < 1:
            spaces = 2
        return cmd + (' ' * spaces) + comment
    else:
        return cmd

# For each section, build combined code block
section_blocks = {}
for secnum, cmdlines in sections.items():
    if not cmdlines:
        continue
    formatted = [format_with_comment(l) for l in cmdlines]
    block = '<pre><code>\n' + '\n'.join(formatted) + '\n</code></pre>'
    section_blocks[secnum] = block

# Function to update an HTML file for a set of section numbers
for rng, html_path in html_files.items():
    html = html_path.read_text(encoding='utf-8')
    orig_html = html
    for secnum in rng:
        if secnum not in section_blocks:
            continue
        # find <h2 ...> that contains the section number like '1.' at start
        pattern = re.compile(r'(<h2[^>]*>\s*' + re.escape(str(secnum)) + r'\.[\s\S]*?</h2>)', re.I)
        m = pattern.search(html)
        if not m:
            # try to find h2 by ID mapping not available; skip
            continue
        start = m.end()
        # find next <h2[^>]*> after start
        m2 = re.search(r'<h2[^>]*>', html[start:], re.I)
        end = start + m2.start() if m2 else len(html)
        region = html[start:end]
        # within region, find first <pre><code> and last </code></pre>
        pre_start = re.search(r'<pre><code[^>]*>', region, re.I)
        pre_end = re.search(r'</code></pre>', region[::-1], re.I)  # reverse search hack
        if pre_start and pre_end:
            # compute real positions
            rs = start + pre_start.start()
            # find last occurrence of </code></pre>
            last_close = region.rfind('</code></pre>')
            re_pos_end = start + last_close + len('</code></pre>')
            # replace region[rs:re_pos_end] with section_blocks[secnum]
            html = html[:rs] + section_blocks[secnum] + html[re_pos_end:]
        else:
            # no pre/code in region, insert block after the h2
            html = html[:start] + '\n' + section_blocks[secnum] + html[start:]
    if html != orig_html:
        html_path.write_text(html, encoding='utf-8')
        print(f'Updated {html_path.name}')
    else:
        print(f'No changes for {html_path.name}')

print('\nDone.')

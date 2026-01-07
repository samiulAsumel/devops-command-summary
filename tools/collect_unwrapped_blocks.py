#!/usr/bin/env python3
import re
import sys


def is_command_like(s):
    s = s.strip()
    if not s:
        return False
    # starts with # (comment examples) or starts with / (path) or looks like a command
    if s.startswith('#') or s.startswith('/'):
        return True
    # command-like: token then space then option or comment
    if re.match(r'^[A-Za-z0-9\./_-]+(\s+[-]{1,2}[A-Za-z0-9-]|\s+#|\s+[A-Za-z0-9/._-]+).*', s):
        return True
    return False

def collect_blocks(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    in_pre = False
    in_script = False
    blocks = []
    cur_block = None

    for idx, line in enumerate(lines):
        if '<script' in line:
            in_script = True
        if '</script>' in line:
            in_script = False
        if '<pre><code>' in line:
            in_pre = True
        if '</code></pre>' in line:
            in_pre = False
            continue
        if in_pre or in_script:
            # close any open block
            if cur_block:
                cur_block['end'] = idx
                blocks.append(cur_block)
                cur_block = None
            continue

        if '<p>' in line and '</p>' in line:
            # extract inner text
            inner = re.sub(r'</?p[^>]*>', '', line).strip()
            if is_command_like(inner):
                if not cur_block:
                    cur_block = {'start': idx, 'lines': []}
                cur_block['lines'].append(line)
                cur_block['end'] = idx+1
                blocks.append(cur_block)
                cur_block = None
            continue

        if is_command_like(line):
            if not cur_block:
                cur_block = {'start': idx, 'lines': []}
            cur_block['lines'].append(line)
        else:
            if cur_block:
                cur_block['end'] = idx
                blocks.append(cur_block)
                cur_block = None

    if cur_block:
        cur_block['end'] = len(lines)
        blocks.append(cur_block)

    # merge adjacent small blocks
    merged = []
    for b in blocks:
        if not merged:
            merged.append(b)
            continue
        prev = merged[-1]
        if b['start'] <= prev['end'] + 1:
            prev['end'] = b['end']
            prev['lines'].extend(b['lines'])
        else:
            merged.append(b)

    for b in merged:
        print(f"BLOCK {b['start']+1}-{b['end']}: {len(b['lines'])} lines")
        for L in b['lines']:
            print(L.rstrip('\n'))
        print('---')

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: collect_unwrapped_blocks.py <file>')
        sys.exit(1)
    collect_blocks(sys.argv[1])

#!/usr/bin/env python3
import re
import sys


def find_unwrapped(filename):
    results = []
    in_pre = False
    with open(filename, 'r', encoding='utf-8') as f:
        for i, line in enumerate(f, start=1):
            if '<pre><code>' in line:
                in_pre = True
            if '</code></pre>' in line:
                in_pre = False
                continue
            if in_pre:
                continue

            s = line.rstrip('\n')
            # Detect lines that look like commands (common patterns):
            # 1) contain an inline comment starting with '#'
            # 2) start with a command-like token followed by an option (e.g. ls -l)
            if '#' in s:
                # Avoid matching HTML comments
                if not re.search(r'<!--', s):
                    results.append((i, s.strip()))
                    continue

            if re.match(r'^\s*[a-z0-9\./_-]+(\s+[-]{1,2}[A-Za-z0-9-]+).*', s):
                results.append((i, s.strip()))

    return results

def main():
    if len(sys.argv) < 2:
        print('Usage: find_unwrapped_commands.py <file.html>')
        return
    file = sys.argv[1]
    res = find_unwrapped(file)
    if not res:
        print('No unwrapped command-like lines found.')
        return
    print(f'Found {len(res)} potential unwrapped command lines in {file}:')
    for lineno, text in res:
        print(f'{lineno}: {text}')

if __name__ == '__main__':
    main()

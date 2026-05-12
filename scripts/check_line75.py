#!/usr/bin/env python3
with open('notion-kanban-sync.py', 'r') as f:
    lines = f.readlines()
    line75 = lines[74]  # 0-indexed
    print(f"Line 75 length: {len(line75)}")
    print(f"Line 75 repr: {repr(line75)}")
    print(f"Line 75 content: {line75}")

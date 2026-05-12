#!/usr/bin/env python3
with open('notion-kanban-sync.py', 'rb') as f:
    content = f.read()
    lines = content.split(b'\n')
    line75 = lines[74]  # 0-indexed
    print(f"Line 75 hex dump:")
    print(line75.hex())
    print(f"\nLine 75 as string:")
    print(line75.decode('utf-8'))

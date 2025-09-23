#!/usr/bin/env python3
"""
🔧 CSS Syntax Fix Tool - Naprawianie błędów składniowych w index.astro
Automatyczne wykrywanie i naprawianie niezamkniętych bloków CSS
"""

import re
import sys
from pathlib import Path

def fix_css_blocks(file_path):
    """Napraw niezamknięte bloki CSS w pliku"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Znajdź wszystkie @keyframes bez zamknięcia
    keyframes_pattern = r'(@keyframes\s+\w+\s*\{[^}]*)(//.*?<!--)'
    matches = list(re.finditer(keyframes_pattern, content, re.DOTALL))
    
    if matches:
        print(f"🔍 Znaleziono {len(matches)} niezamkniętych bloków @keyframes")
        
        # Napraw każdy blok od końca do początku (żeby indeksy się nie zmieniły)
        for match in reversed(matches):
            start_pos = match.start()
            end_pos = match.start(2)  # Pozycja przed komentarzem
            
            # Dodaj zamknięcie bloku
            fixed_block = match.group(1) + """
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    """
            
            content = content[:start_pos] + fixed_block + content[end_pos:]
            print(f"✅ Naprawiono blok na pozycji {start_pos}")
    
    # Znajdź inne potencjalne problemy CSS
    css_issues = []
    
    # Szukaj niezamkniętych nawiasów klamrowych w CSS
    lines = content.split('\n')
    in_style_block = False
    brace_count = 0
    
    for i, line in enumerate(lines):
        if '<style>' in line or '<style ' in line:
            in_style_block = True
            continue
        elif '</style>' in line:
            if brace_count != 0:
                css_issues.append(f"Linia {i+1}: Niezrównoważone nawiasy klamrowe przed </style>")
            in_style_block = False
            brace_count = 0
            continue
        
        if in_style_block:
            # Policz nawiasy (ignorując te w komentarzach i stringach)
            clean_line = re.sub(r'/\*.*?\*/', '', line)  # Usuń komentarze /* */
            clean_line = re.sub(r'//.*', '', clean_line)  # Usuń komentarze //
            
            brace_count += clean_line.count('{')
            brace_count -= clean_line.count('}')
    
    if css_issues:
        print("⚠️  Wykryte potencjalne problemy CSS:")
        for issue in css_issues:
            print(f"   {issue}")
    
    # Zapisz naprawiony plik
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    return len(matches) > 0 or len(css_issues) > 0

if __name__ == "__main__":
    file_path = Path("Q:/mybonzo/luc-de-zen-on/src/pages/index.astro")
    
    if not file_path.exists():
        print(f"❌ Plik nie istnieje: {file_path}")
        sys.exit(1)
    
    print("🔧 CSS Syntax Fix Tool - Naprawianie index.astro")
    print("=" * 50)
    
    fixed = fix_css_blocks(file_path)
    
    if fixed:
        print("✅ Naprawiono błędy CSS - spróbuj ponownie build")
    else:
        print("ℹ️  Nie wykryto problemów CSS do naprawy")
    
    print("=" * 50)
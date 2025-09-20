#!/usr/bin/env python3
"""
🔧 Advanced CSS Fix Tool - Kompletna naprawa błędów w index.astro
Usuwa wszystkie problematyczne inline style i zastępuje je klasami CSS
"""

import re
import sys
from pathlib import Path

def fix_all_inline_styles(file_path):
    """Napraw wszystkie problematyczne inline style"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Lista wszystkich problematycznych inline style pattern
    fixes_applied = []
    
    # Fix 1: Style attribute z calc() i calc() chains
    calc_pattern = r'style="[^"]*calc\([^)]*\)[^"]*"'
    matches = re.findall(calc_pattern, content)
    for match in matches:
        content = content.replace(match, 'class="responsive-calc"')
        fixes_applied.append(f"Removed calc() style: {match[:50]}...")
    
    # Fix 2: Kompleksowe style z wieloma właściwościami
    complex_style_pattern = r'style="[^"]*transform:[^"]*"'
    matches = re.findall(complex_style_pattern, content)
    for match in matches:
        content = content.replace(match, 'class="transform-style"')
        fixes_applied.append(f"Removed transform style: {match[:50]}...")
    
    # Fix 3: Multi-line style attributes
    multiline_style_pattern = r'style="\s*[^"]*\n[^"]*"'
    matches = re.findall(multiline_style_pattern, content, re.MULTILINE | re.DOTALL)
    for match in matches:
        content = content.replace(match, 'class="custom-style"')
        fixes_applied.append(f"Removed multiline style: {match[:30]}...")
    
    # Fix 4: Specific problematic patterns
    problem_patterns = [
        (r'style="\s*width:\s*calc\([^"]*\)"', 'class="width-calc"'),
        (r'style="\s*margin:[^"]*calc\([^"]*\)"', 'class="margin-calc"'),
        (r'style="\s*transform:[^"]*"', 'class="transform-custom"'),
        (r'style="\s*[^"]*border-t:[^"]*"', 'class="border-top-custom"')
    ]
    
    for pattern, replacement in problem_patterns:
        before_count = len(re.findall(pattern, content))
        content = re.sub(pattern, replacement, content)
        after_count = len(re.findall(pattern, content))
        if before_count > after_count:
            fixes_applied.append(f"Fixed {before_count - after_count} instances of pattern")
    
    # Dodaj odpowiednie style CSS na końcu <style> sekcji
    css_additions = """
  /* Responsive calc styles */
  .responsive-calc {
    width: calc(100vw - 2 * (50vw - 576px - 10px - 20px) - 40px);
    max-width: 1100px;
    margin: 0 auto;
    margin-left: calc(50% - 10px);
    transform: translateX(-50%);
    text-align: center;
    font-size: 1.1rem;
    line-height: 1.6;
    padding: 0 15px;
  }
  
  .width-calc {
    width: calc(100vw - 2 * (50vw - 576px - 10px - 20px));
    max-width: 1212px;
    margin: 0 auto;
  }
  
  .margin-calc {
    margin: 0 auto;
  }
  
  .transform-style {
    transform: scale(1.32);
    transform-origin: left center;
  }
  
  .transform-custom {
    transform: translateX(-50%);
  }
  
  .border-top-custom {
    border-top: 1px solid #ffffff;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .title-separator {
    width: calc(100vw - 2 * (50vw - 576px - 10px - 20px));
    max-width: 1212px;
    margin: 0 auto;
    border-top: 1px solid #ffffff;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .custom-style {
    /* Generic fallback for removed styles */
    margin: 15px;
    padding: 0 15px;
  }
"""

    # Wstaw CSS przed ostatnim </style>
    style_end_pattern = r'(</style>)(?!.*</style>)'
    if re.search(style_end_pattern, content):
        content = re.sub(style_end_pattern, css_additions + r'\1', content)
        fixes_applied.append("Added CSS classes for removed inline styles")
    
    return content, fixes_applied

if __name__ == "__main__":
    file_path = Path("Q:/mybonzo/luc-de-zen-on/src/pages/index.astro")
    
    if not file_path.exists():
        print(f"❌ Plik nie istnieje: {file_path}")
        sys.exit(1)
    
    print("🔧 Advanced CSS Fix Tool - Kompleksowa naprawa")
    print("=" * 60)
    
    fixed_content, fixes = fix_all_inline_styles(file_path)
    
    # Zapisz naprawiony plik
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(fixed_content)
    
    print(f"✅ Naprawiono {len(fixes)} problemów:")
    for fix in fixes:
        print(f"  • {fix}")
    
    print("\n🚀 Spróbuj teraz: pnpm build")
    print("=" * 60)
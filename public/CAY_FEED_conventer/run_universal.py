#!/usr/bin/env python3
"""
CAY_XLM_FEED_Converter - Universal Launcher
Działa na Windows, Mac, Linux
"""

import os
import sys
import subprocess
import time
import webbrowser
from pathlib import Path

PORT1 = 4656
PORT2 = 4657

def print_header():
    print("\n" + "="*50)
    print("  CAY_XLM_FEED_Converter - Startup")
    print("="*50 + "\n")

def check_python():
    print("✅ Python znaleziony:", sys.version.split()[0])

def get_app_url():
    script_dir = Path(__file__).parent.absolute()
    return f"file:///{script_dir}/index.html"

def start_servers():
    print("🚀 Uruchamianie serwerów...\n")

    script_dir = Path(__file__).parent
    os.chdir(script_dir)

    try:
        # Serwer 1
        print(f"   Startowanie serwera 1 (port {PORT1})...")
        p1 = subprocess.Popen(
            [sys.executable, "-m", "http.server", str(PORT1), "--bind", "127.0.0.1"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )

        time.sleep(1)

        # Serwer 2
        print(f"   Startowanie serwera 2 (port {PORT2})...")
        p2 = subprocess.Popen(
            [sys.executable, "-m", "http.server", str(PORT2), "--bind", "127.0.0.1"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )

        time.sleep(1)

        return p1, p2
    except Exception as e:
        print(f"❌ Błąd uruchamiania serwerów: {e}")
        sys.exit(1)

def open_browser(url):
    print("📖 Otwieranie aplikacji w przeglądarce...\n")
    try:
        webbrowser.open(url)
    except:
        print(f"⚠️  Nie udało się otworzyć przeglądarki automatycznie.")
        print(f"Otwórz ręcznie: {url}")

def main():
    print_header()
    check_python()
    print()

    app_url = get_app_url()
    print("📋 Będą uruchomione:")
    print(f"   • Serwer 1: http://localhost:{PORT1}")
    print(f"   • Serwer 2: http://localhost:{PORT2}")
    print(f"   • Aplikacja: {app_url}")
    print()

    p1, p2 = start_servers()

    open_browser(app_url)

    print("✅ Aplikacja uruchomiona!\n")
    print("📡 Adresy dostępu:")
    print(f"   • Localhost {PORT1}: http://localhost:{PORT1}")
    print(f"   • Localhost {PORT2}: http://localhost:{PORT2}")
    print(f"   • Plik lokalny: {app_url}")
    print()
    print("💡 Porady:")
    print("   • Serwery działają w tle")
    print("   • Aby zatrzymać: Ctrl+C")
    print("   • Aplikacja będzie działać w przeglądarce")
    print("   • Możesz pobierać pliki z URL przez proxy")
    print()

    try:
        print("Naciśnij Ctrl+C aby zatrzymać...")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\nZatrzymywanie serwerów...")
        p1.terminate()
        p2.terminate()
        print("✅ Serwery zatrzymane.")
        sys.exit(0)

if __name__ == "__main__":
    main()

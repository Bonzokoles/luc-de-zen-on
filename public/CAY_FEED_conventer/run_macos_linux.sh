#!/bin/bash

# ====================================
# CAY_XLM_FEED_Converter - Launcher
# ====================================

PORT1=4656
PORT2=4657
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BROWSER_URL="file://$SCRIPT_DIR/index.html"

echo ""
echo "========================================"
echo "  CAY_XLM_FEED_Converter - Startup"
echo "========================================"
echo ""

# Sprawdź Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 nie znaleziony!"
    echo "Zainstaluj: brew install python3 (Mac) lub apt-get install python3 (Linux)"
    exit 1
fi

echo "✅ Python3 znaleziony"
echo ""
echo "📋 Będą uruchomione:"
echo "   • Serwer 1: http://localhost:$PORT1"
echo "   • Serwer 2: http://localhost:$PORT2"
echo "   • Aplikacja: $BROWSER_URL"
echo ""

# Uruchom serwery
echo "🚀 Uruchamianie serwerów..."
cd "$SCRIPT_DIR"

python3 -m http.server $PORT1 --bind 127.0.0.1 > /dev/null 2>&1 &
SERVER_PID1=$!

sleep 1

python3 -m http.server $PORT2 --bind 127.0.0.1 > /dev/null 2>&1 &
SERVER_PID2=$!

sleep 1

# Otwórz aplikację
echo "📖 Otwieranie aplikacji w przeglądarce..."

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "$BROWSER_URL"
else
    # Linux
    if command -v xdg-open &> /dev/null; then
        xdg-open "$BROWSER_URL"
    elif command -v gnome-open &> /dev/null; then
        gnome-open "$BROWSER_URL"
    else
        echo "Otwórz ręcznie: $BROWSER_URL"
    fi
fi

echo ""
echo "✅ Aplikacja uruchomiona!"
echo ""
echo "📡 Adresy dostępu:"
echo "   • Localhost 4656: http://localhost:$PORT1"
echo "   • Localhost 4657: http://localhost:$PORT2"
echo "   • Plik lokalny: $BROWSER_URL"
echo ""
echo "💡 Porady:"
echo "   • Aby zatrzymać: Ctrl+C"
echo "   • Aplikacja będzie działać w przeglądarce"
echo "   • Możesz pobierać pliki z URL przez proxy"
echo ""
echo "Serwery działają w tle (PID: $SERVER_PID1, $SERVER_PID2)"
echo "Naciśnij Ctrl+C aby zatrzymać serwery"
echo ""

# Czekaj na przerwanie
trap "kill $SERVER_PID1 $SERVER_PID2 2>/dev/null; echo 'Serwery zatrzymane.'; exit 0" INT TERM

wait

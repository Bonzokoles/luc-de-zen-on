#!/bin/bash
# MyBonzo Development Helper Scripts

# Kolory dla lepszej czytelności
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funkcja do wyświetlania kolorowych komunikatów
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Funkcja sprawdzająca status repozytorium
check_repo_status() {
    print_status "Sprawdzanie statusu repozytorium..."
    
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "Masz niezcommitowane zmiany!"
        git status --short
        return 1
    else
        print_success "Repozytorium jest czyste"
        return 0
    fi
}

# Funkcja tworząca nowy feature branch
create_feature_branch() {
    if [ -z "$1" ]; then
        print_error "Użycie: create_feature_branch <nazwa-funkcjonalności>"
        return 1
    fi
    
    local branch_name="feature/$1"
    
    print_status "Tworzenie nowego branch: $branch_name"
    
    # Sprawdź czy jesteś na main
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "main" ]; then
        print_warning "Nie jesteś na branch main. Przełączam..."
        git checkout main
    fi
    
    # Aktualizuj main
    print_status "Aktualizowanie main branch..."
    git pull origin main
    
    # Utwórz nowy branch
    git checkout -b "$branch_name"
    
    print_success "Branch $branch_name utworzony pomyślnie!"
    print_status "Możesz teraz rozpocząć pracę nad funkcjonalnością."
}

# Funkcja do szybkiego commitowania
quick_commit() {
    if [ -z "$1" ]; then
        print_error "Użycie: quick_commit <wiadomość_commit>"
        return 1
    fi
    
    print_status "Dodawanie zmian..."
    git add .
    
    print_status "Commitowanie..."
    git commit -m "$1"
    
    print_success "Zmiany zostały zacommitowane!"
}

# Funkcja do testowania lokalnego
test_local() {
    print_status "Uruchamianie testów lokalnych..."
    
    # Build test
    print_status "Testowanie build..."
    if npm run build; then
        print_success "Build zakończony pomyślnie!"
    else
        print_error "Build failed!"
        return 1
    fi
    
    # Preview test
    print_status "Uruchamianie preview..."
    print_warning "Sprawdź aplikację w przeglądarce: http://localhost:4321"
    npm run preview
}

# Funkcja do przygotowania merge
prepare_merge() {
    local current_branch=$(git branch --show-current)
    
    if [ "$current_branch" = "main" ]; then
        print_error "Nie możesz mergować main do siebie!"
        return 1
    fi
    
    print_status "Przygotowywanie do merge branch: $current_branch"
    
    # Sprawdź status
    if ! check_repo_status; then
        print_error "Zacommituj lub stash swoje zmiany przed merge!"
        return 1
    fi
    
    # Aktualizuj main
    print_status "Aktualizowanie main..."
    git checkout main
    git pull origin main
    
    # Wróć na feature branch i rebase
    git checkout "$current_branch"
    print_status "Wykonywanie rebase..."
    
    if git rebase main; then
        print_success "Rebase zakończony pomyślnie!"
        print_status "Możesz teraz push'ować i tworzyć PR"
        print_warning "Komenda: git push origin $current_branch"
    else
        print_error "Konflikt podczas rebase! Rozwiąż konflikty i kontynuuj."
        print_warning "Po rozwiązaniu: git rebase --continue"
    fi
}

# Funkcja rollback
emergency_rollback() {
    print_warning "🚨 AWARYJNY ROLLBACK 🚨"
    print_warning "Ta operacja cofnie ostatni commit z main branch!"
    
    read -p "Czy jesteś pewien? (yes/no): " confirm
    
    if [ "$confirm" = "yes" ]; then
        print_status "Wykonywanie rollback..."
        git checkout main
        git reset --hard HEAD~1
        
        print_warning "Push'owanie rollback..."
        git push --force-with-lease origin main
        
        print_success "Rollback wykonany! Sprawdź Cloudflare deployment."
    else
        print_status "Rollback anulowany."
    fi
}

# Funkcja help
show_help() {
    echo -e "${BLUE}MyBonzo Development Helper${NC}"
    echo ""
    echo "Dostępne komendy:"
    echo "  check_status           - Sprawdź status repozytorium"
    echo "  new_feature <nazwa>    - Utwórz nowy feature branch"
    echo "  commit <wiadomość>     - Szybki commit"
    echo "  test                   - Testuj lokalnie"
    echo "  prepare_merge          - Przygotuj do merge"
    echo "  rollback              - Awaryjny rollback"
    echo "  help                  - Pokaż tę pomoc"
    echo ""
    echo "Przykłady:"
    echo "  ./dev-helper.sh new_feature polaczek-docs"
    echo "  ./dev-helper.sh commit \"feat: dodanie nowej funkcjonalności\""
    echo "  ./dev-helper.sh test"
}

# Obsługa argumentów
case "$1" in
    "check_status")
        check_repo_status
        ;;
    "new_feature")
        create_feature_branch "$2"
        ;;
    "commit")
        quick_commit "$2"
        ;;
    "test")
        test_local
        ;;
    "prepare_merge")
        prepare_merge
        ;;
    "rollback")
        emergency_rollback
        ;;
    "help"|"")
        show_help
        ;;
    *)
        print_error "Nieznana komenda: $1"
        show_help
        exit 1
        ;;
esac
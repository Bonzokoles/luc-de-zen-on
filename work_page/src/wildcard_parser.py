"""
Wildcard Parser - system do parsowania i używania wildcards z Billions-of-Wildcards
"""
import yaml
import random
import re
from pathlib import Path
from typing import Dict, List, Any


class WildcardParser:
    def __init__(self, wildcards_dir: str):
        """
        Inicjalizuje parser wildcards
        
        Args:
            wildcards_dir: Ścieżka do folderu z plikami .yaml
        """
        self.wildcards_dir = Path(wildcards_dir)
        self.wildcards_data = {}
        self.load_wildcards()
    
    def load_wildcards(self):
        """Ładuje wszystkie pliki YAML z wildcards"""
        if not self.wildcards_dir.exists():
            print(f"Folder wildcards nie istnieje: {self.wildcards_dir}")
            return
        
        yaml_files = list(self.wildcards_dir.glob("*.yaml"))
        print(f"Znaleziono {len(yaml_files)} plików YAML")
        
        for yaml_file in yaml_files:
            try:
                with open(yaml_file, 'r', encoding='utf-8') as f:
                    data = yaml.safe_load(f)
                    filename = yaml_file.stem
                    self.wildcards_data[filename] = data
                    print(f"Załadowano: {filename}")
            except Exception as e:
                print(f"Błąd ładowania {yaml_file}: {e}")
    
    def get_random_from_category(self, category_path: str) -> str:
        """
        Zwraca losowy element z kategorii
        
        Args:
            category_path: Ścieżka do kategorii np. "artists.prehistoric_art"
        
        Returns:
            Losowy element lub pusty string jeśli nie znaleziono
        """
        parts = category_path.split('.')
        
        if len(parts) < 2:
            return ""
        
        file_name = parts[0]
        path = parts[1:]
        
        if file_name not in self.wildcards_data:
            return ""
        
        current = self.wildcards_data[file_name]
        
        # Nawiguj przez ścieżkę
        for part in path:
            if isinstance(current, dict) and part in current:
                current = current[part]
            else:
                return ""
        
        # Jeśli to lista, zwróć losowy element
        if isinstance(current, list):
            return random.choice(current)
        
        return ""
    
    def process_prompt_wildcards(self, prompt: str) -> str:
        """
        Przetwarza prompt zamieniając wildcards na losowe wartości
        
        Args:
            prompt: Prompt z wildcards w formacie __category.subcategory__
        
        Returns:
            Przetworzony prompt z zamienionymi wildcards
        """
        # Pattern dla wildcards: __category.subcategory__
        pattern = r'__([^_]+\.[^_]+)__'
        
        def replace_wildcard(match):
            wildcard_path = match.group(1)
            replacement = self.get_random_from_category(wildcard_path)
            return replacement if replacement else match.group(0)
        
        # Zamień wszystkie wildcards
        processed_prompt = re.sub(pattern, replace_wildcard, prompt)
        
        # Przetwórz {option1|option2|option3} wildcards
        choice_pattern = r'\{([^}]+)\}'
        
        def replace_choice(match):
            choices = match.group(1).split('|')
            return random.choice(choices).strip()
        
        processed_prompt = re.sub(choice_pattern, replace_choice, processed_prompt)
        
        return processed_prompt
    
    def get_available_categories(self) -> Dict[str, List[str]]:
        """Zwraca dostępne kategorie wildcards"""
        categories = {}
        
        for file_name, data in self.wildcards_data.items():
            categories[file_name] = []
            
            def extract_keys(obj, prefix=""):
                if isinstance(obj, dict):
                    for key, value in obj.items():
                        full_key = f"{prefix}.{key}" if prefix else key
                        if isinstance(value, list):
                            categories[file_name].append(full_key)
                        elif isinstance(value, dict):
                            extract_keys(value, full_key)
            
            extract_keys(data)
        
        return categories
    
    def generate_random_prompt(self, base_template: str = None) -> str:
        """
        Generuje całkowicie losowy prompt używając dostępnych wildcards
        
        Args:
            base_template: Bazowy template promptu
            
        Returns:
            Losowy prompt
        """
        if not base_template:
            # Domyślne template z różnymi kategoriami
            templates = [
                "a beautiful __artists.prehistoric_art__ style painting of __creatures.characters.magical-beings.airavata.name__",
                "__creatures.characters.magical-beings.abaddon.name__ in __artists.prehistoric_art__ art style",
                "fantasy creature with __artists.prehistoric_art__ influences",
                "digital art inspired by __artists.prehistoric_art__"
            ]
            base_template = random.choice(templates)
        
        return self.process_prompt_wildcards(base_template)


# Funkcje pomocnicze dla interfejsu
def get_wildcard_suggestions(parser: WildcardParser, category: str = None) -> List[str]:
    """Zwraca sugestie wildcards dla danej kategorii"""
    categories = parser.get_available_categories()
    
    if category and category in categories:
        return [f"__{category}.{cat}__" for cat in categories[category][:10]]
    
    # Zwróć próbkę ze wszystkich kategorii
    suggestions = []
    for file_name, cats in categories.items():
        suggestions.extend([f"__{file_name}.{cat}__" for cat in cats[:3]])
    
    return suggestions[:20]


def enhance_prompt_with_wildcards(prompt: str, parser: WildcardParser, 
                                enhancement_level: str = "medium") -> str:
    """
    Ulepsza prompt dodając wildcards
    
    Args:
        prompt: Oryginalny prompt
        parser: Parser wildcards
        enhancement_level: "light", "medium", "heavy"
        
    Returns:
        Ulepszony prompt
    """
    enhancements = {
        "light": [
            ", {beautiful|stunning|amazing|gorgeous}",
            ", {high quality|masterpiece|professional}"
        ],
        "medium": [
            ", in the style of __artists.prehistoric_art__",
            ", {beautiful|stunning|amazing|gorgeous}",
            ", {high quality|masterpiece|professional|detailed}"
        ],
        "heavy": [
            ", in the style of __artists.prehistoric_art__",
            ", {beautiful|stunning|amazing|gorgeous|breathtaking}",
            ", {high quality|masterpiece|professional|detailed|intricate}"
        ]
    }
    
    level_enhancements = enhancements.get(enhancement_level, enhancements["medium"])
    
    # Dodaj losowe ulepszenia
    num_enhancements = random.randint(1, len(level_enhancements))
    selected_enhancements = random.sample(level_enhancements, num_enhancements)
    
    enhanced_prompt = prompt + "".join(selected_enhancements)
    
    return parser.process_prompt_wildcards(enhanced_prompt)


if __name__ == "__main__":
    # Test parsera
    parser = WildcardParser("wildcards")
    
    # Test podstawowy
    test_prompt = "a beautiful painting in style of __artists.prehistoric_art__"
    processed = parser.process_prompt_wildcards(test_prompt)
    print(f"Original: {test_prompt}")
    print(f"Processed: {processed}")
    
    # Test losowego promptu
    random_prompt = parser.generate_random_prompt()
    print(f"Random: {random_prompt}")
    
    # Test kategorii
    categories = parser.get_available_categories()
    for file_name, cats in categories.items():
        print(f"{file_name}: {len(cats)} kategorii")
        if cats:
            print(f"  Przykłady: {cats[:3]}")
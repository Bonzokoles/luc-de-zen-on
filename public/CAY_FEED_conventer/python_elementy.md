Oto zmodyfikowana wersja funkcji dzielenia pliku XML z automatycznym wykrywaniem i obsługą namespace bez potrzeby ręcznego podawania URI w tagu. Funkcja znajdzie właściwy element do podziału, ignorując prefixy namespace w porównaniu tagów:

python
import xml.etree.ElementTree as ET

def split_xml_file_auto_namespace(input_path, output_prefix, split_tag_localname, chunk_size=1000):
    """
    Dzieli plik XML na fragmenty na podstawie lokalnej nazwy tagu, 
    automatycznie obsługując namespace bez manualnego podawania URI.

    Args:
        input_path (str): Ścieżka do pliku XML.
        output_prefix (str): Prefiks dla nazw plików wynikowych.
        split_tag_localname (str): Lokalna nazwa elementu do dzielenia (np. 'product').
        chunk_size (int): Liczba elementów na plik.
    """
    tree = ET.parse(input_path)
    root = tree.getroot()

    # Znajdź elementy z lokalną nazwą split_tag_localname
    elements = [elem for elem in root.iter() if elem.tag.split('}')[-1] == split_tag_localname]
    total = len(elements)
    print(f"Znaleziono {total} elementów <{split_tag_localname}> do podziału.")

    # Funkcja budująca nowy root z namespace z oryginału
    def build_new_root():
        new_root = ET.Element(root.tag, root.attrib)
        # Skopiuj namespace z oryginalnego root
        for k, v in root.attrib.items():
            if k.startswith("xmlns"):
                new_root.set(k, v)
        return new_root

    # Podziel elementy na fragmenty z zachowaniem root i ns
    for i in range(0, total, chunk_size):
        new_root = build_new_root()
        for elem in elements[i:i+chunk_size]:
            new_root.append(elem)

        new_tree = ET.ElementTree(new_root)
        output_file = f"{output_prefix}_part_{i//chunk_size + 1}.xml"
        new_tree.write(output_file, encoding='utf-8', xml_declaration=True)
        print(f"Zapisano {output_file}")

# Przykład wywołania:
# split_xml_file_auto_namespace('plik.xml', 'output', 'product', 500)
Jak to działa:
Funkcja znajduje elementy na podstawie samej lokalnej nazwy tagu (bez namespace).

Namespace i atrybuty są kopiowane z oryginalnego korzenia do nowego.

Pliki wynikowe mają poprawną strukturę XML z deklaracją i namespace.

Nie musisz podawać adresu URI namespace.
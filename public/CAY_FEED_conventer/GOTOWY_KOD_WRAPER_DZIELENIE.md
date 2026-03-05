Oto kompletny plik Python zawierający funkcję dzielenia dużego pliku XML z obsługą streamingu i prosty wrapper do wywołania funkcji z linii poleceń:

python
import xml.etree.ElementTree as ET

def split_xml_file_streaming(input_path, output_prefix, split_tag_localname, chunk_size=1000):
    """
    Dzieli bardzo duży plik XML na części poprzez streaming, 
    bez potrzeby wczytywania całego pliku do pamięci.

    Args:
        input_path (str): Ścieżka do pliku XML.
        output_prefix (str): Prefiks nazw plików wynikowych.
        split_tag_localname (str): Lokalna nazwa elementu do dzielenia (np. 'product').
        chunk_size (int): Liczba elementów w każdej części.
    """
    context = ET.iterparse(input_path, events=("start", "end"))
    _, root = next(context)  # uzyskaj root

    nsmap = {k: v for k, v in root.attrib.items() if k.startswith('xmlns')}
    file_index = 1
    chunk_elements = []

    def write_chunk(elements, index):
        # Buduj nowy root z tymi samymi atrybutami i namespace
        new_root = ET.Element(root.tag, root.attrib)
        for k, v in nsmap.items():
            new_root.set(k, v)
        for el in elements:
            new_root.append(el)
        tree = ET.ElementTree(new_root)
        filename = f"{output_prefix}_part_{index}.xml"
        tree.write(filename, encoding='utf-8', xml_declaration=True)
        print(f"Zapisano {filename}")

    for event, elem in context:
        if event == "end" and elem.tag.split('}')[-1] == split_tag_localname:
            chunk_elements.append(elem)
            # Usuń przetworzony element z drzewa, aby zwolnić pamięć
            root.clear()
            if len(chunk_elements) >= chunk_size:
                write_chunk(chunk_elements, file_index)
                file_index += 1
                chunk_elements = []

    # Zapisz pozostałe elementy
    if chunk_elements:
        write_chunk(chunk_elements, file_index)


def split_large_xml():
    input_file = input("Podaj ścieżkę do pliku XML do podziału: ").strip()
    output_prefix = input("Podaj prefiks dla plików wynikowych: ").strip()
    split_tag = input("Podaj nazwę tagu elementu, po którym dzielić (np. 'product'): ").strip()
    chunk_size_str = input("Podaj liczbę elementów na plik (np. 1000): ").strip()

    try:
        chunk_size = int(chunk_size_str)
    except ValueError:
        print("Niepoprawna liczba elementów, ustawiam domyślnie na 1000.")
        chunk_size = 1000

    split_xml_file_streaming(input_file, output_prefix, split_tag, chunk_size)


if __name__ == "__main__":
    split_large_xml()
Instrukcje:
Zapisz ten kod do pliku split_xml.py.

Uruchom w terminalu: python split_xml.py

Podaj ścieżkę pliku XML, prefiks nazw, nazwę tagu do podziału i liczbę elementów na część.

Pliki wynikowe zostaną zapisane z numeracją i zachowają poprawną strukturę XML z namespace.
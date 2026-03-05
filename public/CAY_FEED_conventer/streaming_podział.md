Aby dodać obsługę streamingu i pozwolić na dzielenie bardzo dużych plików XML bez konieczności wczytywania całego pliku do pamięci, można użyć parsera iteracyjnego iterparse z xml.etree.ElementTree. Poniższy kod implementuje takie podejście, dzieląc plik na mniejsze części na podstawie lokalnej nazwy elementu i zapisując fragmenty na bieżąco:

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

# Przykładowe użycie:
# split_xml_file_streaming('bigfile.xml', 'output', 'product', 1000)
Cechy rozwiązania:
Przetwarza plik liniowo, oszczędzając pamięć (dobrze działa na bardzo dużych plikach).

Automatycznie rozpoznaje elementy do podziału według ich lokalnej nazwy.

Po osiągnięciu rozmiaru chunku zapisuje fragment do pliku i czyści pamięć.

Zachowuje strukturę XML i atrybuty root z namespace.

Po zakończeniu zapisuje pozostałe elementy, jeśli są.

Oto prosty wrapper w Pythonie, który możesz wkleić do swojego projektu, aby wygodnie wywołać funkcję dzielenia dużego pliku XML z obsługą streamingu:

python
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
    # Zaimportuj lub umieść tu definicję split_xml_file_streaming
    split_large_xml()
Jak to działa:
Pyta użytkownika o parametry pliku, prefiks, tag i wielkość fragmentu.

Wywołuje funkcję split_xml_file_streaming (którą definiujesz w tym samym module lub importujesz).

Umożliwia szybkie uruchomienie z linii komend lub integrację z GUI.

Wystarczy dodać ten wrapper do kodu, aby móc łatwo korzystać z dzielenia plików XML
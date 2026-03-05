import xml.etree.ElementTree as ET

def split_xml_file(input_path, output_prefix, split_tag='product', chunk_size=1000):
    """
    Dzieli plik XML na części po określonej liczbie elementów o danym tagu.

    Args:
        input_path (str): Ścieżka do oryginalnego pliku XML.
        output_prefix (str): Prefiks nazwy plików wyjściowych.
        split_tag (str): Tag elementu, według którego dzielimy (np. 'product').
        chunk_size (int): Liczba elementów w pojedynczym fragmencie.
    """
    tree = ET.parse(input_path)
    root = tree.getroot()

    elements = root.findall('.//' + split_tag)
    total = len(elements)
    print(f"Found {total} <{split_tag}> elements to split.")

    for i in range(0, total, chunk_size):
        # Tworzenie nowego korzenia z tym samym tagiem co oryginał
        new_root = ET.Element(root.tag)
        
        # Kopiowanie atrybutów z oryginalnego korzenia (jeśli istnieją)
        new_root.attrib = root.attrib.copy()

        # Dopisywanie fragmentu elementów
        for elem in elements[i:i+chunk_size]:
            new_root.append(elem)

        new_tree = ET.ElementTree(new_root)
        output_file = f"{output_prefix}_part_{i//chunk_size + 1}.xml"
        new_tree.write(output_file, encoding='utf-8', xml_declaration=True)
        print(f"Wrote {output_file}")

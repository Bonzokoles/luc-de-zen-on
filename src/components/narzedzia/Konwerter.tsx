import { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { parseString, Builder } from 'xml2js';

// Extend jsPDF type
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// ========== INTERFACES ==========

type ConversionMode = 'excel-pdf' | 'excel-xml' | 'xml-json' | 'md-pdf' | 'json-excel' | 'xml-excel';

interface ConversionResult {
  success: boolean;
  message: string;
  data?: any;
  filename?: string;
}

// ========== COMPONENT ==========

export default function Konwerter() {
  const [activeMode, setActiveMode] = useState<ConversionMode>('excel-pdf');
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // ========== EXCEL TO PDF ==========
  const convertExcelToPDF = async (file: File): Promise<ConversionResult> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text('Konwersja Excel → PDF', 14, 15);
      doc.setFontSize(10);
      doc.text(`Arkusz: ${workbook.SheetNames[0]}`, 14, 22);

      if (jsonData.length > 0) {
        doc.autoTable({
          startY: 30,
          head: [jsonData[0] as any[]],
          body: jsonData.slice(1) as any[][],
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: [59, 130, 246] }
        });
      }

      const filename = `${file.name.replace(/\.[^/.]+$/, '')}_converted.pdf`;
      doc.save(filename);

      return {
        success: true,
        message: `✓ Pomyślnie skonwertowano ${jsonData.length} wierszy do PDF`,
        filename
      };
    } catch (error) {
      return {
        success: false,
        message: `✗ Błąd konwersji: ${error instanceof Error ? error.message : 'Nieznany błąd'}`
      };
    }
  };

  // ========== EXCEL TO XML ==========
  const convertExcelToXML = async (file: File): Promise<ConversionResult> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      const builder = new Builder({
        rootName: 'data',
        xmldec: { version: '1.0', encoding: 'UTF-8' }
      });

      const xml = builder.buildObject({ row: jsonData });

      // Download XML
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filename = `${file.name.replace(/\.[^/.]+$/, '')}_converted.xml`;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      return {
        success: true,
        message: `✓ Pomyślnie skonwertowano ${jsonData.length} rekordów do XML`,
        data: xml,
        filename
      };
    } catch (error) {
      return {
        success: false,
        message: `✗ Błąd konwersji: ${error instanceof Error ? error.message : 'Nieznany błąd'}`
      };
    }
  };

  // ========== XML TO JSON ==========
  const convertXMLToJSON = async (text: string): Promise<ConversionResult> => {
    return new Promise((resolve) => {
      parseString(text, (err, result) => {
        if (err) {
          resolve({
            success: false,
            message: `✗ Błąd parsowania XML: ${err.message}`
          });
        } else {
          const json = JSON.stringify(result, null, 2);

          // Download JSON
          const blob = new Blob([json], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const filename = 'converted.json';
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);

          resolve({
            success: true,
            message: '✓ Pomyślnie skonwertowano XML do JSON',
            data: json,
            filename
          });
        }
      });
    });
  };

  // ========== MARKDOWN TO PDF ==========
  const convertMarkdownToPDF = (text: string): ConversionResult => {
    try {
      const doc = new jsPDF();

      // Parse simple markdown
      const lines = text.split('\n');
      let y = 20;

      doc.setFontSize(16);
      doc.text('Dokument Markdown', 14, y);
      y += 10;

      lines.forEach((line, idx) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }

        // Headers
        if (line.startsWith('# ')) {
          doc.setFontSize(16);
          doc.setFont('helvetica', 'bold');
          doc.text(line.substring(2), 14, y);
          y += 10;
        } else if (line.startsWith('## ')) {
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text(line.substring(3), 14, y);
          y += 8;
        } else if (line.startsWith('### ')) {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.text(line.substring(4), 14, y);
          y += 7;
        }
        // Bullet points
        else if (line.startsWith('- ') || line.startsWith('* ')) {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.text(`• ${line.substring(2)}`, 18, y);
          y += 6;
        }
        // Normal text
        else if (line.trim()) {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          const splitText = doc.splitTextToSize(line, 180);
          doc.text(splitText, 14, y);
          y += 6 * splitText.length;
        } else {
          y += 4;
        }
      });

      const filename = 'markdown_converted.pdf';
      doc.save(filename);

      return {
        success: true,
        message: '✓ Pomyślnie skonwertowano Markdown do PDF',
        filename
      };
    } catch (error) {
      return {
        success: false,
        message: `✗ Błąd konwersji: ${error instanceof Error ? error.message : 'Nieznany błąd'}`
      };
    }
  };

  // ========== JSON TO EXCEL ==========
  const convertJSONToExcel = (text: string): ConversionResult => {
    try {
      const data = JSON.parse(text);
      let arrayData: any[] = [];

      // Handle different JSON structures
      if (Array.isArray(data)) {
        arrayData = data;
      } else if (typeof data === 'object') {
        // Convert object to array of key-value pairs
        arrayData = Object.entries(data).map(([key, value]) => ({
          Key: key,
          Value: typeof value === 'object' ? JSON.stringify(value) : value
        }));
      }

      const worksheet = XLSX.utils.json_to_sheet(arrayData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

      const filename = 'converted.xlsx';
      XLSX.writeFile(workbook, filename);

      return {
        success: true,
        message: `✓ Pomyślnie skonwertowano JSON do Excel (${arrayData.length} rekordów)`,
        filename
      };
    } catch (error) {
      return {
        success: false,
        message: `✗ Błąd konwersji: ${error instanceof Error ? error.message : 'Nieznany błąd'}`
      };
    }
  };

  // ========== XML TO EXCEL ==========
  const convertXMLToExcel = async (text: string): Promise<ConversionResult> => {
    return new Promise((resolve) => {
      parseString(text, (err, result) => {
        if (err) {
          resolve({
            success: false,
            message: `✗ Błąd parsowania XML: ${err.message}`
          });
        } else {
          try {
            // Try to flatten XML to array
            let arrayData: any[] = [];

            // Handle common XML structures
            if (result.data && result.data.row) {
              arrayData = result.data.row;
            } else {
              // Convert to key-value format
              arrayData = Object.entries(result).map(([key, value]) => ({
                Key: key,
                Value: typeof value === 'object' ? JSON.stringify(value) : value
              }));
            }

            const worksheet = XLSX.utils.json_to_sheet(arrayData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

            const filename = 'converted.xlsx';
            XLSX.writeFile(workbook, filename);

            resolve({
              success: true,
              message: `✓ Pomyślnie skonwertowano XML do Excel (${arrayData.length} rekordów)`,
              filename
            });
          } catch (error) {
            resolve({
              success: false,
              message: `✗ Błąd konwersji: ${error instanceof Error ? error.message : 'Nieznany błąd'}`
            });
          }
        }
      });
    });
  };

  // ========== HANDLE CONVERSION ==========
  const handleConvert = async () => {
    setIsProcessing(true);
    setResult(null);

    let conversionResult: ConversionResult;

    try {
      switch (activeMode) {
        case 'excel-pdf':
          if (!inputFile) {
            conversionResult = { success: false, message: 'Wybierz plik Excel' };
          } else {
            conversionResult = await convertExcelToPDF(inputFile);
          }
          break;

        case 'excel-xml':
          if (!inputFile) {
            conversionResult = { success: false, message: 'Wybierz plik Excel' };
          } else {
            conversionResult = await convertExcelToXML(inputFile);
          }
          break;

        case 'xml-json':
          if (!inputText.trim()) {
            conversionResult = { success: false, message: 'Wklej kod XML' };
          } else {
            conversionResult = await convertXMLToJSON(inputText);
          }
          break;

        case 'md-pdf':
          if (!inputText.trim()) {
            conversionResult = { success: false, message: 'Wklej kod Markdown' };
          } else {
            conversionResult = convertMarkdownToPDF(inputText);
          }
          break;

        case 'json-excel':
          if (!inputText.trim()) {
            conversionResult = { success: false, message: 'Wklej kod JSON' };
          } else {
            conversionResult = convertJSONToExcel(inputText);
          }
          break;

        case 'xml-excel':
          if (!inputText.trim()) {
            conversionResult = { success: false, message: 'Wklej kod XML' };
          } else {
            conversionResult = await convertXMLToExcel(inputText);
          }
          break;

        default:
          conversionResult = { success: false, message: 'Nieznany tryb konwersji' };
      }

      setResult(conversionResult);
    } catch (error) {
      setResult({
        success: false,
        message: `✗ Błąd: ${error instanceof Error ? error.message : 'Nieznany błąd'}`
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const modes = [
    { id: 'excel-pdf', label: 'Excel → PDF', icon: '📊→📄', requiresFile: true },
    { id: 'excel-xml', label: 'Excel → XML', icon: '📊→📋', requiresFile: true },
    { id: 'xml-json', label: 'XML → JSON', icon: '📋→📦', requiresFile: false },
    { id: 'md-pdf', label: 'Markdown → PDF', icon: '📝→📄', requiresFile: false },
    { id: 'json-excel', label: 'JSON → Excel', icon: '📦→📊', requiresFile: false },
    { id: 'xml-excel', label: 'XML → Excel', icon: '📋→📊', requiresFile: false }
  ];

  const currentMode = modes.find(m => m.id === activeMode);

  // ========== RENDER ==========

  return (
    <div className="text-white">
      <div className="max-w-5xl mx-auto">

        {/* Mode Selector */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {modes.map(mode => (
            <button
              key={mode.id}
              onClick={() => {
                setActiveMode(mode.id as ConversionMode);
                setResult(null);
                setInputFile(null);
                setInputText('');
              }}
              className={`p-6 rounded-xl font-medium transition-all text-left ${
                activeMode === mode.id
                  ? 'bg-purple-600 border-2 border-purple-400 shadow-lg shadow-purple-500/30'
                  : 'bg-slate-800/50 border-2 border-slate-700 hover:border-purple-500/50'
              }`}
            >
              <div className="text-3xl mb-2">{mode.icon}</div>
              <div className="font-bold">{mode.label}</div>
            </button>
          ))}
        </div>

        {/* Conversion Panel */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6">{currentMode?.label}</h2>

          {/* File Input */}
          {currentMode?.requiresFile ? (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Wybierz plik do konwersji</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept={activeMode === 'excel-pdf' || activeMode === 'excel-xml' ? '.xlsx,.xls' : '*'}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setInputFile(e.target.files[0]);
                      setResult(null);
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                />
              </div>
              {inputFile && (
                <div className="mt-3 text-sm text-slate-400">
                  ✓ Wybrany plik: <span className="font-mono text-purple-400">{inputFile.name}</span> ({(inputFile.size / 1024).toFixed(2)} KB)
                </div>
              )}
            </div>
          ) : (
            // Text Input
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">
                Wklej {activeMode === 'xml-json' || activeMode === 'xml-excel' ? 'XML' : activeMode === 'json-excel' ? 'JSON' : 'Markdown'}
              </label>
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setResult(null);
                }}
                placeholder={
                  activeMode === 'xml-json' || activeMode === 'xml-excel'
                    ? '<?xml version="1.0"?>\n<data>\n  <row>\n    <name>Jan</name>\n    <age>30</age>\n  </row>\n</data>'
                    : activeMode === 'json-excel'
                    ? '[\n  { "name": "Jan", "age": 30 },\n  { "name": "Anna", "age": 25 }\n]'
                    : '# Nagłówek\n\nTo jest tekst w Markdown.\n\n## Podtytuł\n\n- Punkt 1\n- Punkt 2'
                }
                rows={12}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          {/* Convert Button */}
          <button
            onClick={handleConvert}
            disabled={isProcessing || (!inputFile && !inputText.trim())}
            className={`w-full px-8 py-4 rounded-lg font-bold text-lg transition-all ${
              isProcessing || (!inputFile && !inputText.trim())
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isProcessing ? '⏳ Konwertowanie...' : `🔄 Konwertuj ${currentMode?.label}`}
          </button>

          {/* Result */}
          {result && (
            <div className={`mt-6 p-6 rounded-lg border-2 ${
              result.success
                ? 'bg-emerald-900/20 border-emerald-500'
                : 'bg-red-900/20 border-red-500'
            }`}>
              <div className="flex items-start gap-3">
                <div className="text-2xl">{result.success ? '✓' : '✗'}</div>
                <div className="flex-1">
                  <div className={`font-bold mb-2 ${result.success ? 'text-emerald-400' : 'text-red-400'}`}>
                    {result.success ? 'Sukces!' : 'Błąd'}
                  </div>
                  <div className="text-sm">{result.message}</div>
                  {result.filename && (
                    <div className="text-xs text-slate-400 mt-2">
                      Plik: <span className="font-mono">{result.filename}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <h3 className="text-sm font-bold mb-2 text-purple-400">ℹ️ Informacje</h3>
            <ul className="text-xs text-slate-400 space-y-1">
              {activeMode === 'excel-pdf' && (
                <>
                  <li>• Konwertuje pierwszą zakładkę pliku Excel do formatu PDF</li>
                  <li>• Zachowuje strukturę tabelaryczną</li>
                  <li>• Obsługuje pliki .xlsx i .xls</li>
                </>
              )}
              {activeMode === 'excel-xml' && (
                <>
                  <li>• Konwertuje dane z Excel do struktury XML</li>
                  <li>• Każdy wiersz staje się elementem &lt;row&gt;</li>
                  <li>• Plik XML jest gotowy do dalszej obróbki</li>
                </>
              )}
              {activeMode === 'xml-json' && (
                <>
                  <li>• Parsuje XML i konwertuje do formatu JSON</li>
                  <li>• Zachowuje strukturę hierarchiczną</li>
                  <li>• Wynik jest czytelny i łatwy do użycia w JavaScript</li>
                </>
              )}
              {activeMode === 'md-pdf' && (
                <>
                  <li>• Konwertuje Markdown do PDF z formatowaniem</li>
                  <li>• Obsługuje nagłówki (#, ##, ###), listy i tekst</li>
                  <li>• Idealny do dokumentacji i raportów</li>
                </>
              )}
              {activeMode === 'json-excel' && (
                <>
                  <li>• Konwertuje dane JSON do arkusza Excel</li>
                  <li>• Obsługuje tablice i obiekty</li>
                  <li>• Format .xlsx gotowy do edycji</li>
                </>
              )}
              {activeMode === 'xml-excel' && (
                <>
                  <li>• Konwertuje strukturę XML do arkusza Excel</li>
                  <li>• Automatycznie wykrywa strukturę danych</li>
                  <li>• Format .xlsx gotowy do analizy</li>
                </>
              )}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}

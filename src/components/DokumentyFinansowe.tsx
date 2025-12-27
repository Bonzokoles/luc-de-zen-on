import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Dokumenty Finansowe - Upload i AI Ocena Ryzyka
 * 
 * AI Model: Gemini 2.5 Flash via /api/analyze-risk
 * Token Limit: 8000
 * 
 * Funkcje:
 * - Upload dokumentów (PDF, Excel, faktury)
 * - Parsowanie liczb z dokumentów
 * - AI ocena ryzyka finansowego
 * - Historia dokumentów w localStorage
 */

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  extractedNumbers: {
    kwota?: number;
    vat?: number;
    netto?: number;
    brutto?: number;
  };
  riskAssessment?: {
    score: number; // 0-100
    level: 'low' | 'medium' | 'high';
    analysis: string;
    recommendations: string[];
  };
}

export default function DokumentyFinansowe() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [manualData, setManualData] = useState({
    kwota: '',
    vat: '',
    opis: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('erp-dokumenty');
    if (saved) {
      setDocuments(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('erp-dokumenty', JSON.stringify(documents));
  }, [documents]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setLoading(true);

    try {
      // Read file content
      const text = await readFileContent(file);
      
      // Extract numbers from text
      const extractedNumbers = extractNumbers(text);

      const newDoc: Document = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type || 'unknown',
        size: file.size,
        uploadDate: new Date().toISOString(),
        extractedNumbers
      };

      // AI Risk Assessment
      const risk = await analyzeRisk(extractedNumbers, text);
      newDoc.riskAssessment = risk;

      setDocuments(prev => [newDoc, ...prev]);
      setSelectedDoc(newDoc);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Błąd podczas przetwarzania pliku');
    } finally {
      setLoading(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const extractNumbers = (text: string) => {
    const numbers: { kwota?: number; vat?: number; netto?: number; brutto?: number } = {};
    
    // Extract VAT (23%, 8%, etc.)
    const vatMatch = text.match(/(?:VAT|vat)\s*:?\s*(\d+)%?/i);
    if (vatMatch) numbers.vat = parseFloat(vatMatch[1]);

    // Extract amounts (PLN, zł)
    const amountMatches = text.matchAll(/(\d+[\s,]?\d*\.?\d*)\s*(?:PLN|zł|zl)/gi);
    const amounts = Array.from(amountMatches).map(m => parseFloat(m[1].replace(/[\s,]/g, '')));
    
    if (amounts.length > 0) {
      numbers.kwota = amounts[0];
      numbers.brutto = Math.max(...amounts);
      numbers.netto = Math.min(...amounts);
    }

    // Extract numbers after keywords
    const nettoMatch = text.match(/(?:netto|net)\s*:?\s*(\d+[\s,]?\d*\.?\d*)/i);
    if (nettoMatch) numbers.netto = parseFloat(nettoMatch[1].replace(/[\s,]/g, ''));

    const bruttoMatch = text.match(/(?:brutto|gross)\s*:?\s*(\d+[\s,]?\d*\.?\d*)/i);
    if (bruttoMatch) numbers.brutto = parseFloat(bruttoMatch[1].replace(/[\s,]/g, ''));

    return numbers;
  };

  const analyzeRisk = async (numbers: any, text: string) => {
    try {
      const response = await fetch('/api/analyze-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numbers, text })
      });

      if (!response.ok) throw new Error('API error');
      
      const data = await response.json();
      return data.risk;
    } catch (error) {
      console.error('Risk analysis error:', error);
      // Fallback basic risk assessment
      const kwota = numbers.kwota || numbers.brutto || 0;
      return {
        score: kwota > 10000 ? 65 : kwota > 5000 ? 45 : 25,
        level: kwota > 10000 ? 'high' : kwota > 5000 ? 'medium' : 'low',
        analysis: 'Analiza podstawowa: kwota ' + kwota + ' PLN',
        recommendations: ['Sprawdź warunki płatności', 'Zweryfikuj kontrahenta']
      };
    }
  };

  const handleManualEntry = async () => {
    if (!manualData.kwota || !manualData.opis) {
      alert('Wypełnij kwotę i opis');
      return;
    }

    setLoading(true);
    const kwota = parseFloat(manualData.kwota);
    const vat = manualData.vat ? parseFloat(manualData.vat) : 23;
    const netto = kwota / (1 + vat / 100);

    const extractedNumbers = {
      kwota,
      vat,
      netto,
      brutto: kwota
    };

    const risk = await analyzeRisk(extractedNumbers, manualData.opis);

    const newDoc: Document = {
      id: Date.now().toString(),
      name: 'Wpis ręczny: ' + manualData.opis.substring(0, 30),
      type: 'manual',
      size: 0,
      uploadDate: new Date().toISOString(),
      extractedNumbers,
      riskAssessment: risk
    };

    setDocuments(prev => [newDoc, ...prev]);
    setSelectedDoc(newDoc);
    setManualData({ kwota: '', vat: '', opis: '' });
    setLoading(false);
  };

  const getRiskColor = (level?: string) => {
    switch (level) {
      case 'low': return 'text-green-400 border-green-500';
      case 'medium': return 'text-yellow-400 border-yellow-500';
      case 'high': return 'text-red-400 border-red-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    if (selectedDoc?.id === id) setSelectedDoc(null);
  };

  return (
    <div className="space-y-6">
      <div className="card bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-500/50">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <span>📄</span> Dokumenty Finansowe & Ocena Ryzyka
        </h2>

        {/* Manual Entry */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-indigo-300">Ręczny wpis liczb</h3>
            <input
              type="number"
              placeholder="Kwota brutto (PLN)"
              value={manualData.kwota}
              onChange={(e) => setManualData({ ...manualData, kwota: e.target.value })}
              className="input w-full bg-gray-800/50 border-indigo-500/50"
            />
            <input
              type="number"
              placeholder="VAT % (opcjonalnie, domyślnie 23%)"
              value={manualData.vat}
              onChange={(e) => setManualData({ ...manualData, vat: e.target.value })}
              className="input w-full bg-gray-800/50 border-indigo-500/50"
            />
            <textarea
              placeholder="Opis transakcji lub dokumentu..."
              value={manualData.opis}
              onChange={(e) => setManualData({ ...manualData, opis: e.target.value })}
              rows={3}
              className="input w-full bg-gray-800/50 border-indigo-500/50"
            />
            <button
              onClick={handleManualEntry}
              disabled={loading}
              className="btn btn-primary w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
            >
              {loading ? '⏳ Analizuję...' : '✅ Dodaj i oceń ryzyko'}
            </button>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-purple-300">Upload dokumentu</h3>
            <label className="block">
              <div className="border-2 border-dashed border-purple-500/50 rounded-lg p-8 text-center hover:border-purple-400 cursor-pointer transition-all">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".txt,.csv,.json,.pdf,.xlsx,.xls"
                  className="hidden"
                  disabled={loading}
                />
                <div className="text-4xl mb-2">📤</div>
                <p className="text-lg font-semibold">Kliknij aby wgrać plik</p>
                <p className="text-sm text-gray-400 mt-2">
                  TXT, CSV, JSON, PDF, Excel
                </p>
              </div>
            </label>
            <div className="text-xs text-gray-400 space-y-1">
              <p>✓ Automatyczne wykrywanie kwot</p>
              <p>✓ Parsowanie VAT i kwot netto/brutto</p>
              <p>✓ AI ocena ryzyka finansowego</p>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            📋 Historia dokumentów ({documents.length})
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              <AnimatePresence>
                {documents.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-4 bg-gray-800/50 border rounded-lg cursor-pointer transition-all ${
                      selectedDoc?.id === doc.id
                        ? 'border-indigo-400 bg-indigo-900/30'
                        : 'border-gray-600/50 hover:border-gray-500'
                    }`}
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm truncate flex-1">
                        {doc.name}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteDocument(doc.id);
                        }}
                        className="text-red-400 hover:text-red-300 ml-2"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 space-y-1">
                      <p>{new Date(doc.uploadDate).toLocaleString('pl-PL')}</p>
                      {doc.extractedNumbers.kwota && (
                        <p className="text-green-400 font-semibold">
                          💰 {doc.extractedNumbers.kwota.toFixed(2)} PLN
                        </p>
                      )}
                      {doc.riskAssessment && (
                        <div className={`inline-block px-2 py-1 border rounded ${getRiskColor(doc.riskAssessment.level)}`}>
                          Ryzyko: {doc.riskAssessment.level.toUpperCase()} ({doc.riskAssessment.score})
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {documents.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Brak dokumentów. Dodaj pierwszy!
                </div>
              )}
            </div>

            {/* Document Details */}
            <div>
              {selectedDoc ? (
                <div className="p-6 bg-gray-800/50 border border-indigo-500/50 rounded-lg space-y-4">
                  <h4 className="text-xl font-bold text-indigo-300">{selectedDoc.name}</h4>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">
                      📅 {new Date(selectedDoc.uploadDate).toLocaleString('pl-PL')}
                    </p>
                    {selectedDoc.type !== 'manual' && (
                      <p className="text-sm text-gray-400">
                        📦 {(selectedDoc.size / 1024).toFixed(2)} KB
                      </p>
                    )}
                  </div>

                  {/* Extracted Numbers */}
                  <div className="space-y-2">
                    <h5 className="font-semibold text-green-300">💵 Wykryte liczby:</h5>
                    {selectedDoc.extractedNumbers.netto && (
                      <p>Netto: <span className="font-bold">{selectedDoc.extractedNumbers.netto.toFixed(2)} PLN</span></p>
                    )}
                    {selectedDoc.extractedNumbers.vat && (
                      <p>VAT: <span className="font-bold">{selectedDoc.extractedNumbers.vat}%</span></p>
                    )}
                    {selectedDoc.extractedNumbers.brutto && (
                      <p>Brutto: <span className="font-bold text-green-400">{selectedDoc.extractedNumbers.brutto.toFixed(2)} PLN</span></p>
                    )}
                    {selectedDoc.extractedNumbers.kwota && !selectedDoc.extractedNumbers.brutto && (
                      <p>Kwota: <span className="font-bold text-green-400">{selectedDoc.extractedNumbers.kwota.toFixed(2)} PLN</span></p>
                    )}
                  </div>

                  {/* Risk Assessment */}
                  {selectedDoc.riskAssessment && (
                    <div className="space-y-3 border-t border-gray-600 pt-4">
                      <h5 className="font-semibold text-yellow-300">⚠️ Ocena ryzyka AI:</h5>
                      
                      <div className={`p-3 border-2 rounded ${getRiskColor(selectedDoc.riskAssessment.level)}`}>
                        <p className="font-bold text-lg">
                          Poziom: {selectedDoc.riskAssessment.level.toUpperCase()}
                        </p>
                        <p className="text-sm">Wynik: {selectedDoc.riskAssessment.score}/100</p>
                      </div>

                      <div className="bg-gray-900/50 p-3 rounded">
                        <p className="text-sm leading-relaxed">{selectedDoc.riskAssessment.analysis}</p>
                      </div>

                      {selectedDoc.riskAssessment.recommendations.length > 0 && (
                        <div>
                          <p className="font-semibold mb-2 text-blue-300">📌 Rekomendacje:</p>
                          <ul className="space-y-1 text-sm">
                            {selectedDoc.riskAssessment.recommendations.map((rec, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-blue-400">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 bg-gray-800/50 border border-gray-600/50 rounded-lg text-center text-gray-500">
                  Wybierz dokument z listy aby zobaczyć szczegóły
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

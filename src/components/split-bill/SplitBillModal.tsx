import React, { useState, useRef, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { X, Upload, Loader2, Plus, Trash2, Users, Download } from 'lucide-react';
import { cn } from '../../lib/utils';
import { formatRupiah } from '../../utils/currencyUtils';
import { useCashflowStore } from '../../store/useCashflowStore';
import { translations } from '../../utils/translations';

interface SplitBillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ParsedItem {
  id: string;
  name: string;
  price: number;
  assignedTo: string[]; // array of person names
}

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const SplitBillModal: React.FC<SplitBillModalProps> = ({ isOpen, onClose }) => {
  const addTransaction = useCashflowStore((state) => state.addTransaction);
  const { lang, theme } = useCashflowStore();
  const t = translations[lang];
  
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [items, setItems] = useState<ParsedItem[]>([]);
  
  const defaultMe = lang === 'id' ? 'Saya' : 'Me';
  const defaultFriend = lang === 'id' ? 'Teman A' : 'Friend A';
  const [people, setPeople] = useState<string[]>([defaultMe, defaultFriend]);
  const [newPerson, setNewPerson] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Sync people when language changes if they are still defaults
  useEffect(() => {
    if (isOpen) {
      const prevMe = lang === 'id' ? 'Me' : 'Saya';
      const prevFriend = lang === 'id' ? 'Friend A' : 'Teman A';
      
      setPeople(prev => prev.map(p => {
        if (p === prevMe) return defaultMe;
        if (p === prevFriend) return defaultFriend;
        return p;
      }));
    }
  }, [lang, isOpen, defaultMe, defaultFriend]);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      processOCR(url);
    }
  };

  const processOCR = async (imageUrl: string) => {
    setIsProcessing(true);
    setItems([]);
    try {
      const result = await Tesseract.recognize(imageUrl, 'eng', {
        logger: (m) => console.log(m)
      });
      
      const text = result.data.text;
      const lines = text.split('\n');
      const newItems: ParsedItem[] = [];
      
      // Naive parsing: Look for lines that end with numbers
      lines.forEach((line) => {
        const textStr = line.trim();
        // Regex to find trailing numbers like 15000, 15.000, 15,000
        const match = textStr.match(/(.+?)\s+((?:^\d{1,3}[.,])*\d{3,}|\d+)$/);
        
        if (match) {
          const name = match[1].trim();
          // Clean up the number string to get raw integer
          const priceStr = match[2].replace(/[.,]/g, '');
          const price = parseInt(priceStr, 10);
          
          if (!isNaN(price) && price > 0 && name.length > 2) {
            newItems.push({
              id: generateUUID(),
              name,
              price,
              assignedTo: []
            });
          }
        }
      });
      
      if (newItems.length > 0) {
        setItems(newItems);
      } else {
        // Fallback if regex didn't catch anything, just to show UI
        setItems([{
          id: generateUUID(),
          name: lang === 'id' ? 'Barang Manual 1' : 'Manual Item 1',
          price: 15000,
          assignedTo: []
        }]);
      }
    } catch (error) {
      console.error('OCR Error:', error);
      // Fallback
      setItems([{
        id: generateUUID(),
        name: lang === 'id' ? 'Barang Manual 1' : 'Manual Item 1',
        price: 15000,
        assignedTo: []
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddPerson = () => {
    if (newPerson.trim() && !people.includes(newPerson.trim())) {
      setPeople([...people, newPerson.trim()]);
      setNewPerson('');
    }
  };

  const handleRemovePerson = (personToRemove: string) => {
    setPeople(people.filter(p => p !== personToRemove));
    // Remove person from all item assignments
    setItems(items.map(item => ({
      ...item,
      assignedTo: item.assignedTo.filter(p => p !== personToRemove)
    })));
  };

  const toggleAssignment = (itemId: string, person: string) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const isAssigned = item.assignedTo.includes(person);
        return {
          ...item,
          assignedTo: isAssigned 
            ? item.assignedTo.filter(p => p !== person)
            : [...item.assignedTo, person]
        };
      }
      return item;
    }));
  };

  const handleManualAddItem = () => {
    setItems([
      ...items,
      {
        id: generateUUID(),
        name: lang === 'id' ? `Barang Kustom ${items.length + 1}` : `Custom Item ${items.length + 1}`,
        price: 15000,
        assignedTo: [defaultMe]
      }
    ]);
  };

  // Calculate totals per person
  const totalsByPerson = people.reduce((acc, person) => {
    acc[person] = 0;
    return acc;
  }, {} as Record<string, number>);

  items.forEach(item => {
    if (item.assignedTo.length > 0) {
      const splitAmount = item.price / item.assignedTo.length;
      item.assignedTo.forEach(person => {
        if (totalsByPerson[person] !== undefined) {
          totalsByPerson[person] += splitAmount;
        }
      });
    }
  });

  const handleDownloadPDF = async () => {
    if (!summaryRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(summaryRef.current, {
        scale: 2,
        backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('split-bill-summary.pdf');
    } catch (error) {
      console.error('PDF Export Error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDone = () => {
    const myTotal = totalsByPerson[defaultMe] || 0;
    if (myTotal > 0) {
      addTransaction({
        title: lang === 'id' ? 'Patungan Tagihan' : 'Split Bill Share',
        amount: myTotal,
        date: new Date().toISOString(),
        category: 'Food & Dining',
        type: 'expense'
      });
    }
    
    // Reset state for next open
    setImage(null);
    setItems([]);
    setPeople([defaultMe, defaultFriend]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className={`rounded-3xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border duration-300 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{lang === 'id' ? 'Bagi Tagihan (OCR)' : 'Split Bill (OCR)'}</h2>
          </div>
          <button onClick={onClose} className={`p-2 rounded-full transition-colors cursor-pointer ${
            theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid md:grid-cols-2 gap-8">
          
          {/* Left Column: Upload & OCR */}
          <div className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group ${
                theme === 'dark' 
                  ? 'border-slate-800 hover:border-blue-500 hover:bg-slate-800/40' 
                  : 'border-slate-200 hover:border-blue-500 hover:bg-blue-50/50'
              }`}
            >
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              {image ? (
                <div className={`relative w-full aspect-[3/4] rounded-lg overflow-hidden border ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                  <img src={image} alt="Receipt" className="object-cover w-full h-full" />
                  {isProcessing && (
                    <div className={`absolute inset-0 flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-slate-900/90' : 'bg-white/80'}`}>
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                        {lang === 'id' ? 'Memindai Struk...' : 'Scanning Receipt...'}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors ${
                    theme === 'dark' ? 'bg-slate-800 text-slate-400 group-hover:text-blue-400' : 'bg-slate-100 text-slate-400 group-hover:text-blue-600'
                  }`}>
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{lang === 'id' ? 'Unggah Struk' : 'Upload Receipt'}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {lang === 'id' ? 'Ambil foto struk belanja untuk mengekstrak barang otomatis' : 'Take a photo of your receipt to auto-extract items'}
                  </p>
                </>
              )}
            </div>

            {/* People Management */}
            <div className={`p-4 rounded-2xl border space-y-4 ${
              theme === 'dark' ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-100'
            }`}>
              <h4 className={`font-semibold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{lang === 'id' ? 'Siapa saja yang bayar?' : "Who's paying?"}</h4>
              <div className="flex flex-wrap gap-2">
                {people.map(person => (
                  <span key={person} className={`inline-flex items-center border rounded-full px-3 py-1 text-sm font-medium shadow-sm ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    {person}
                    <button onClick={() => handleRemovePerson(person)} className="ml-2 text-slate-400 hover:text-rose-500 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={newPerson}
                  onChange={(e) => setNewPerson(e.target.value)}
                  placeholder={lang === 'id' ? 'Tambah teman...' : 'Add person...'}
                  className={`flex-1 px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddPerson()}
                />
                <button onClick={handleAddPerson} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Items & Assignment */}
          <div className="space-y-6 flex flex-col">
            <div className={`flex items-center justify-between border-b pb-2 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'}`}>
              <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{lang === 'id' ? 'Daftar Barang' : 'Extracted Items'}</h3>
              <button 
                onClick={handleManualAddItem}
                className="flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-950/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm border border-blue-100 dark:border-blue-900/50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'id' ? 'Tambah Barang' : 'Add Item'}</span>
              </button>
            </div>
            
            {items.length === 0 && !isProcessing && (
              <div className={`text-center p-8 rounded-2xl border border-dashed ${theme === 'dark' ? 'border-slate-800 bg-slate-800/10' : 'border-slate-100 bg-slate-50'}`}>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">{lang === 'id' ? 'Belum ada daftar barang.' : 'No items here yet.'}</p>
                <button
                  onClick={handleManualAddItem}
                  className={`inline-flex items-center space-x-1.5 text-xs font-bold border px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm ${
                    theme === 'dark' 
                      ? 'text-blue-400 bg-slate-800 border-blue-900/50 hover:bg-slate-700' 
                      : 'text-blue-600 bg-white border-blue-100 hover:bg-blue-50'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'id' ? 'Tambah Barang Manual' : 'Add Item Manually'}</span>
                </button>
              </div>
            )}

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 flex-1">
              {items.map((item, index) => (
                <div key={item.id} className={`p-4 rounded-2xl shadow-sm space-y-3 border ${
                  theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <input 
                      type="text" 
                      value={item.name}
                      onChange={(e) => {
                        const newItems = [...items];
                        newItems[index].name = e.target.value;
                        setItems(newItems);
                      }}
                      className={`font-semibold bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-[60%] truncate focus:border-b focus:border-blue-200 ${
                        theme === 'dark' ? 'text-white' : 'text-slate-800'
                      }`}
                      placeholder={lang === 'id' ? 'Nama barang' : 'Item name'}
                    />
                    <div className="flex items-center space-x-2">
                      <div className={`flex items-center px-2 py-1 rounded-xl border focus-within:bg-white transition-colors ${
                        theme === 'dark' ? 'bg-slate-800 border-slate-750 focus-within:bg-slate-800 focus-within:border-blue-500' : 'bg-slate-50 border-slate-100 focus-within:border-blue-300'
                      }`}>
                        <span className="text-xs font-bold text-blue-400 mr-1">Rp</span>
                        <input 
                          type="number"
                          value={item.price || ''}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            const newItems = [...items];
                            newItems[index].price = isNaN(val) ? 0 : val;
                            setItems(newItems);
                          }}
                          className={`w-20 font-bold bg-transparent border-none focus:outline-none focus:ring-0 text-right p-0 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                          }`}
                          placeholder={lang === 'id' ? 'Harga' : 'Price'}
                        />
                      </div>
                      <button 
                        onClick={() => setItems(items.filter(i => i.id !== item.id))}
                        className={`cursor-pointer p-1 rounded-lg transition-colors ${
                          theme === 'dark' ? 'text-slate-400 hover:text-rose-400 hover:bg-slate-800' : 'text-slate-400 hover:text-rose-500 hover:bg-slate-50'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Assignment Bubbles */}
                  <div className={`flex flex-wrap gap-1.5 pt-2 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-50'}`}>
                    {people.map(person => {
                      const isAssigned = item.assignedTo.includes(person);
                      return (
                        <button
                          key={person}
                          onClick={() => toggleAssignment(item.id, person)}
                          className={cn(
                            "px-2.5 py-1 text-xs font-medium rounded-full transition-all border cursor-pointer",
                            isAssigned 
                              ? "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300" 
                              : theme === 'dark'
                                ? "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:bg-slate-750"
                                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                          )}
                        >
                          {person}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary - Capturable by html2canvas */}
            {items.length > 0 && (
              <div 
                ref={summaryRef} 
                className={`rounded-2xl p-5 border mt-auto transition-colors ${
                  theme === 'dark' ? 'bg-blue-950/10 border-blue-900/40' : 'bg-blue-50 border-blue-100'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className={`font-bold text-sm uppercase tracking-wider ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>{lang === 'id' ? 'Ringkasan Patungan' : 'Split Summary'}</h4>
                  <button 
                    onClick={handleDownloadPDF}
                    disabled={isExporting}
                    className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-100 hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900 px-2.5 py-1.5 rounded-md transition-colors cursor-pointer"
                  >
                    {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                    <span>{isExporting ? (lang === 'id' ? 'Mengekspor...' : 'Exporting...') : 'PDF'}</span>
                  </button>
                </div>
               
                <div className="space-y-3">
                  {(Object.entries(totalsByPerson) as Array<[string, number]>).map(([person, total]) => (
                    <div key={person} className={`flex items-center justify-between border-b last:border-0 pb-2 last:pb-0 ${
                      theme === 'dark' ? 'border-blue-900/30' : 'border-blue-100/50'
                    }`}>
                      <span className={`font-medium ${theme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>{person}</span>
                      <span className={`font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>{formatRupiah(total)}</span>
                    </div>
                  ))}
                </div>
                <div className={`mt-4 pt-3 border-t flex justify-between items-center ${theme === 'dark' ? 'border-blue-900/60' : 'border-blue-200'}`}>
                  <span className={`font-bold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>{lang === 'id' ? 'Total Tagihan' : 'Total Bill'}</span>
                  <span className={`font-bold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-900'}`}>
                    {formatRupiah((Object.values(totalsByPerson) as number[]).reduce((a, b) => a + b, 0))}
                  </span>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex flex-col sm:flex-row justify-between items-center gap-3 ${
          theme === 'dark' ? 'border-slate-800 bg-slate-850' : 'border-slate-100 bg-slate-50'
        }`}>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-2 text-center sm:text-left">
            {lang === 'id' 
              ? `Mengeklik "${t.doneAndSave || 'Selesai & Simpan'}" akan otomatis menambahkan bagian "${defaultMe}" ke pengeluaran Anda.`
              : `Clicking "${t.doneAndSave || 'Done & Save'}" will automatically add "${defaultMe}"'s share to your expenses.`}
          </p>
          <button 
            onClick={handleDone}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            {lang === 'id' ? 'Selesai & Simpan' : 'Done & Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

import { useRef } from 'react';
import { Download, Upload, FileText, RotateCcw, Store } from 'lucide-react';
import { useShopData } from './hooks/useShopData';
import { StaffManagement } from './components/StaffManagement';
import { ScratchCardTracker } from './components/ScratchCardTracker';
import { TemperatureLog } from './components/TemperatureLog';
import { DashboardSummary } from './components/DashboardSummary';
import { NotesSection } from './components/NotesSection';
import { generatePDF } from './utils/pdfGenerator';

function App() {
  const {
    data,
    updateStaff,
    addStaff,
    removeStaff,
    updateScratchCardBatch,
    addScratchCardBatch,
    removeScratchCardBatch,
    updateTemperature,
    updateNotes,
    resetData,
    setData
  } = useShopData();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shop_data_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setData(json);
        alert('Data imported successfully!');
      } catch (error) {
        alert('Failed to import data. Invalid JSON file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Store className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">Shop Manager Pro</h1>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportJSON}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg tooltip"
              title="Import JSON"
            >
              <Upload className="w-5 h-5" />
            </button>

            <button
              onClick={handleExportJSON}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              title="Export JSON"
            >
              <Download className="w-5 h-5" />
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            <button
              onClick={resetData}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              title="Reset All Data"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => generatePDF(data)}
              className="ml-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Generate Report</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        <DashboardSummary data={data} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <StaffManagement
            shifts={data.staffShifts}
            onUpdate={updateStaff}
            onAdd={addStaff}
            onRemove={removeStaff}
          />
          <TemperatureLog temperatures={data.temperatures} onUpdate={updateTemperature} />
        </div>

        <ScratchCardTracker
          cards={data.scratchCards}
          onUpdate={updateScratchCardBatch}
          onAddBatch={addScratchCardBatch}
          onRemoveBatch={removeScratchCardBatch}
        />

        <NotesSection notes={data.notes} onUpdate={updateNotes} />

      </main>
    </div>
  );
}

export default App;

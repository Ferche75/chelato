import { useState } from 'react';
import { MapPin, ChevronRight, X } from 'lucide-react';
import { useBranch } from '../context/BranchContext';

const MOCK_BRANCHES = [
  { id: 1, name: "Chelato Miami Beach", address: "123 Ocean Drive, Miami Beach, FL 33139" },
  { id: 2, name: "Chelato Wynwood", address: "456 NW 27th St, Miami, FL 33127" },
  { id: 3, name: "Chelato Brickell", address: "789 Brickell Ave, Miami, FL 33131" },
];

export default function BranchSelector() {
  const { selectedBranch, setSelectedBranch, showSelector, setShowSelector } = useBranch();
  const [selectedId, setSelectedId] = useState<number | null>(selectedBranch?.id || null);
  const branches = MOCK_BRANCHES;
  const isLoading = false;

  const handleSelect = (branch: typeof MOCK_BRANCHES[0]) => {
    setSelectedId(branch.id);
  };

  const handleConfirm = () => {
    if (selectedId) {
      const branch = branches.find(b => b.id === selectedId);
      if (branch) {
        setSelectedBranch(branch as any);
        setShowSelector(false);
      }
    }
  };

  if (!showSelector) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[rgba(44,24,16,0.6)] backdrop-blur-sm" onClick={() => {
        if (selectedBranch) setShowSelector(false);
      }} />
      <div className="relative w-full max-w-lg rounded-2xl shadow-2xl animate-scale-in overflow-hidden"
        style={{ background: '#f5f0e8' }}>
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-[#663a7c] font-display">Elegi tu Sucursal</h2>
            {selectedBranch && (
              <button onClick={() => setShowSelector(false)} className="p-1 text-[#2c1810]/40 hover:text-[#2c1810]">
                <X size={20} />
              </button>
            )}
          </div>
          <p className="text-sm text-[#2c1810]/60">
            Selecciona la Chelato mas cercana para ver los sabores disponibles.
          </p>
        </div>

        <div className="px-4 pb-4 max-h-[360px] overflow-y-auto">
          {isLoading ? (
            <div className="py-8 text-center text-[#2c1810]/40">Cargando sucursales...</div>
          ) : (
            <div className="space-y-2">
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => handleSelect(branch)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all ${
                    selectedId === branch.id
                      ? 'border-2 border-[#663a7c] bg-[rgba(102,58,124,0.05)]'
                      : 'border-2 border-transparent hover:bg-[rgba(212,167,167,0.15)]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    selectedId === branch.id ? 'bg-[#663a7c] text-white' : 'bg-[rgba(212,167,167,0.2)] text-[#663a7c]'
                  }`}>
                    <MapPin size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#2c1810] text-sm">{branch.name}</p>
                    <p className="text-xs text-[#2c1810]/50 truncate">{branch.address}</p>
                  </div>
                  <ChevronRight size={16} className={`flex-shrink-0 ${selectedId === branch.id ? 'text-[#663a7c]' : 'text-[#2c1810]/30'}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 pt-2 border-t border-[rgba(212,167,167,0.2)]">
          <button
            onClick={handleConfirm}
            disabled={!selectedId}
            className={`w-full py-3 rounded-full font-semibold text-sm transition-all ${
              selectedId
                ? 'bg-[#663a7c] text-white hover:bg-[#c67d6f]'
                : 'bg-[rgba(212,167,167,0.3)] text-[#2c1810]/30 cursor-not-allowed'
            }`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
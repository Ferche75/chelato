import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string | null;
  openingHours: Record<string, string>;
}

interface BranchContextType {
  selectedBranch: Branch | null;
  setSelectedBranch: (branch: Branch) => void;
  showSelector: boolean;
  setShowSelector: (show: boolean) => void;
}

const BranchContext = createContext<BranchContextType>({
  selectedBranch: null,
  setSelectedBranch: () => {},
  showSelector: false,
  setShowSelector: () => {},
});

export function BranchProvider({ children }: { children: ReactNode }) {
  const [selectedBranch, setSelectedBranchState] = useState<Branch | null>(() => {
    const stored = localStorage.getItem("chelato_branch");
    return stored ? JSON.parse(stored) : null;
  });
  const [showSelector, setShowSelector] = useState(false);

  const setSelectedBranch = (branch: Branch) => {
    setSelectedBranchState(branch);
    localStorage.setItem("chelato_branch", JSON.stringify(branch));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!selectedBranch) {
        setShowSelector(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [selectedBranch]);

  return (
    <BranchContext.Provider value={{ selectedBranch, setSelectedBranch, showSelector, setShowSelector }}>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  return useContext(BranchContext);
}

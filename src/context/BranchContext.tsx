import { createContext, useContext, useState, type ReactNode } from "react";

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

const DEFAULT_BRANCH: Branch = {
  id: 1,
  name: "Chelato Principal",
  address: "Miami, FL",
  phone: null,
  openingHours: {},
};

const BranchContext = createContext<BranchContextType>({
  selectedBranch: DEFAULT_BRANCH,
  setSelectedBranch: () => {},
  showSelector: false,
  setShowSelector: () => {},
});

export function BranchProvider({ children }: { children: ReactNode }) {
  const [selectedBranch, setSelectedBranchState] = useState<Branch | null>(DEFAULT_BRANCH);
  const [showSelector, setShowSelector] = useState(false);

  const setSelectedBranch = (branch: Branch) => {
    setSelectedBranchState(branch);
    localStorage.setItem("chelato_branch", JSON.stringify(branch));
  };

  return (
    <BranchContext.Provider value={{ selectedBranch, setSelectedBranch, showSelector, setShowSelector }}>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  return useContext(BranchContext);
}
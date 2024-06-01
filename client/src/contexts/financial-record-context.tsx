import { Children, createContext, useContext, useState } from 'react';

interface FinancialRecord {
  id?: string;
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}
interface FinancialRecordsContextType {
  records: FinancialRecord[];
  addRecord: (record: FinancialRecord) => void;
  // updateRecord: (id: string, newRecord: Partial<FinancialRecord>) => void;
  // deleteRecord: (id: string) => void;
}

// create your context
export const FinancialRecordsContext = createContext<FinancialRecordsContextType | undefined>(
  undefined,
);

// Create a provider component
export const FinancialRecordProvider = ({ children }: { children: React.ReactNode }) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const addRecord = async (record: FinancialRecord) => {
    const response = await fetch('http://localhost:3001/financial-records', {
      method: 'POST',
      body: JSON.stringify(record),
    });
    try {
      if (response.ok) {
        const newRecord = await response.json();
        setRecords(prev => [...prev, newRecord]);
      }
    } catch (err) {}
  };

  return (
    <FinancialRecordsContext.Provider value={{ records, addRecord }}>
      {children}
    </FinancialRecordsContext.Provider>
  );
};
export const useFinancialRecords = () => {
  const context = useContext<FinancialRecordsContextType | undefined>(FinancialRecordsContext);

  if (!context) {
    throw new Error('useFinancialRecords must be used within a FinancialRecordProvider');
  }

  return context;
};

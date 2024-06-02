import { useUser } from '@clerk/clerk-react';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface FinancialRecord {
  _id?: string;
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
  updateRecord: (id: string, newRecord: FinancialRecord) => void;
  deleteRecord: (id: string) => void;
}

// Create your context
export const FinancialRecordsContext = createContext<FinancialRecordsContextType | undefined>(
  undefined,
);

// Create a provider component
export const FinancialRecordProvider = ({ children }: { children: React.ReactNode }) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const { user } = useUser();

  const fetchRecord = async () => {
    if (!user) return;
    const response = await fetch(
      `http://localhost:8001/financial-records/getAllByUserID/${user.id}`,
    );
    if (response.ok) {
      const records = await response.json();
      console.log(records);
      setRecords(records);
    }
  };

  useEffect(() => {
    fetchRecord();
  }, [user]);

  const addRecord = async (record: FinancialRecord) => {
    try {
      const response = await fetch('http://localhost:8001/financial-records', {
        method: 'POST',
        body: JSON.stringify(record),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const newRecord = await response.json();
        setRecords(prev => [...prev, newRecord]);
      } else {
        console.error('Failed to add record', await response.text());
      }
    } catch (err) {
      console.error('Error adding record:', err);
    }
  };
  const updateRecord = async (id: string, newReocrd: FinancialRecord) => {
    try {
      if (!user) return;
      const response = await fetch(`http://localhost:8001/financial-records/${id}`, {
        method: 'PUT',
        body: JSON.stringify(newReocrd),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const newRecord = await response.json();
        setRecords(prev =>
          prev.map(record => {
            if (record._id === id) {
              return newRecord;
            } else {
              return record;
            }
          }),
        );
      } else {
        console.error('Failed to add record', await response.text());
      }
    } catch (err) {
      console.error('Error adding record:', err);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8001/financial-records/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const deletedRecord = await response.json();
        setRecords(prev => prev.filter(record => record._id !== deletedRecord._id));
      } else {
        console.error('Failed to add record', await response.text());
      }
    } catch (err) {
      console.error('Error adding record:', err);
    }
  };

  return (
    <FinancialRecordsContext.Provider value={{ records, addRecord, updateRecord, deleteRecord }}>
      {children}
    </FinancialRecordsContext.Provider>
  );
};

export const useFinancialRecords = () => {
  const context = useContext(FinancialRecordsContext);

  if (!context) {
    throw new Error('useFinancialRecords must be used within a FinancialRecordProvider');
  }

  return context;
};
// 1:29

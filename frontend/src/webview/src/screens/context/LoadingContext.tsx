import React, { createContext, useContext, useState } from 'react';

interface LoadingContextType {
  loading: boolean;
  message: string;
  showLoading: (msg: string) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: React.ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const showLoading = (msg: string) => {
    setMessage(msg);
    setLoading(true);
  };
  const hideLoading = () => {
    setLoading(false);
    setMessage('');
  };

  return (
    <LoadingContext.Provider value={{ loading, message, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export function useLoading(): LoadingContextType {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading は LoadingProvider の内側で使ってください");
  return ctx;
}
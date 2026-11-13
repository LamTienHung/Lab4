import { createContext, useContext } from 'react';

export const FormContext = createContext(null);

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error('useFormContext phải được dùng bên trong <FormContext.Provider>');
  return ctx;
}
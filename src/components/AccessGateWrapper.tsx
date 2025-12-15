import { useState, type ReactNode } from 'react';
import { AccessGate, STORAGE_KEY } from '../pages/AccessGate';

interface AccessGateWrapperProps {
  children: ReactNode;
}

export function AccessGateWrapper({ children }: AccessGateWrapperProps) {
  const [isAccessGranted, setIsAccessGranted] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });

  const handleAccessGranted = () => {
    setIsAccessGranted(true);
  };

  if (!isAccessGranted) {
    return <AccessGate onAccessGranted={handleAccessGranted} />;
  }

  return <>{children}</>;
}

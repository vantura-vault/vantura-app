import { useState, type FormEvent } from 'react';
import vanturaLogo from '../assets/vantura-logo.svg';
import loginBg from '../assets/dashboard-bg.png';
import styles from './AccessGate.module.css';

const ACCESS_PASSWORD = 'vantura100M';
const STORAGE_KEY = 'vantura_access_granted';

interface AccessGateProps {
  onAccessGranted: () => void;
}

export function AccessGate({ onAccessGranted }: AccessGateProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Small delay for UX
    setTimeout(() => {
      if (password === ACCESS_PASSWORD) {
        localStorage.setItem(STORAGE_KEY, 'true');
        onAccessGranted();
      } else {
        setError('Invalid access code. Please try again.');
        setIsLoading(false);
      }
    }, 300);
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.backgroundImage}
        style={{ backgroundImage: `url(${loginBg})` }}
      />
      <div className={styles.gateBox}>
        <img src={vanturaLogo} alt="Vantura" className={styles.logo} />

        <p className={styles.subtitle}>Enter access code to continue</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="accessCode" className={styles.label}>
              Access Code
            </label>
            <input
              id="accessCode"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Enter access code"
              required
              autoComplete="off"
              data-form-type="other"
              autoFocus
            />
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}

export { STORAGE_KEY };

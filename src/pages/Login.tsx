import { useState, useCallback, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { login as apiLogin } from '../api/endpoints';
import { prefetchAllData } from '../utils/prefetch';
import { LoadingSplash } from '../components/LoadingSplash';
import vanturaLogo from '../assets/vantura-logo.svg';
import loginBg from '../assets/dashboard-bg.png';
import styles from './Login.module.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSplashComplete = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handlePrefetch = useCallback(async () => {
    if (companyId) {
      await prefetchAllData({ companyId });
    }
  }, [companyId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await apiLogin(email, password);

      // Store auth data
      setAuth(response.user, response.token);

      // Show splash screen and start prefetching
      if (response.user.companyId) {
        setCompanyId(response.user.companyId);
        setShowSplash(true);
      } else {
        // No company - go straight to dashboard
        navigate('/');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid email or password. Please try again.');
      setIsLoading(false);
    }
  };

  // Show splash screen while prefetching data
  if (showSplash) {
    return (
      <LoadingSplash
        onComplete={handleSplashComplete}
        prefetchFn={handlePrefetch}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.backgroundImage}
        style={{ backgroundImage: `url(${loginBg})` }}
      />
      <div className={styles.loginBox}>
        <img src={vanturaLogo} alt="Vantura" className={styles.logo} />

        <p className={styles.subtitle}>Sign in to your Vantura account</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="you@example.com"
              required
              autoComplete="off"
              data-form-type="other"
              autoFocus
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              required
              autoComplete="off"
              data-form-type="other"
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
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className={styles.signupLink}>
          Don't have an account?{' '}
          <Link to="/signup" className={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

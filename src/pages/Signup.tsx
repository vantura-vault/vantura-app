import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { register, checkLinkedIn } from '../api/endpoints';
import vanturaLogo from '../assets/vantura-logo.svg';
import styles from './Login.module.css';

export function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    companyIndustry: '',
    linkedInUrl: '',
    linkedInType: 'company' as 'company' | 'profile',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [linkedInStatus, setLinkedInStatus] = useState<{
    checking: boolean;
    exists: boolean | null;
    companyName?: string;
    message?: string;
  }>({ checking: false, exists: null });

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  // Debounce LinkedIn URL check
  useEffect(() => {
    const checkUrl = async () => {
      if (!formData.linkedInUrl || formData.linkedInUrl.length < 20) {
        setLinkedInStatus({ checking: false, exists: null });
        return;
      }

      // Basic validation before API call
      if (!formData.linkedInUrl.includes('linkedin.com/')) {
        setLinkedInStatus({ checking: false, exists: null });
        return;
      }

      setLinkedInStatus({ checking: true, exists: null });

      try {
        const result = await checkLinkedIn(formData.linkedInUrl);
        setLinkedInStatus({
          checking: false,
          exists: result.exists,
          companyName: result.companyName,
          message: result.message,
        });
      } catch {
        setLinkedInStatus({ checking: false, exists: null });
      }
    };

    const debounceTimer = setTimeout(checkUrl, 500);
    return () => clearTimeout(debounceTimer);
  }, [formData.linkedInUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.name || !formData.password || !formData.companyName || !formData.linkedInUrl) {
      setError('All required fields must be filled');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Validate LinkedIn URL format
    const linkedInPattern = /linkedin\.com\/(company|in)\/[\w-]+/i;
    if (!linkedInPattern.test(formData.linkedInUrl)) {
      setError('Please enter a valid LinkedIn URL (e.g., linkedin.com/company/your-company or linkedin.com/in/your-profile)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await register({
        email: formData.email,
        name: formData.name,
        password: formData.password,
        companyName: formData.companyName,
        companyIndustry: formData.companyIndustry || undefined,
        linkedInUrl: formData.linkedInUrl,
        linkedInType: formData.linkedInType,
      });

      // Store auth data
      setAuth(response.user, response.token);

      // Redirect to dashboard
      navigate('/');
    } catch (err: unknown) {
      console.error('Signup failed:', err);
      // Handle ApiError object from client (has message property)
      const errorMessage =
        (err as { message?: string })?.message ||
        'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <img src={vanturaLogo} alt="Vantura" className={styles.logo} />

        <h1 className={styles.title}>Get Started</h1>
        <p className={styles.subtitle}>Create your Vantura account</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              placeholder="John Doe"
              disabled={isLoading}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="you@company.com"
              disabled={isLoading}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="companyName" className={styles.label}>
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={styles.input}
              placeholder="Acme Inc."
              disabled={isLoading}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="linkedInUrl" className={styles.label}>
              LinkedIn URL <span style={{ color: 'var(--color-accent-primary)' }}>*</span>
            </label>
            <input
              type="url"
              id="linkedInUrl"
              name="linkedInUrl"
              value={formData.linkedInUrl}
              onChange={handleChange}
              className={styles.input}
              placeholder="linkedin.com/company/your-company"
              disabled={isLoading}
              required
            />
            {linkedInStatus.checking && (
              <p className={styles.helperText} style={{ color: 'var(--color-text-secondary)' }}>
                Checking LinkedIn URL...
              </p>
            )}
            {linkedInStatus.exists === true && (
              <p className={styles.helperText} style={{ color: '#f59e0b' }}>
                This LinkedIn is registered to "{linkedInStatus.companyName}". You'll join as a team member.
              </p>
            )}
            {linkedInStatus.exists === false && (
              <p className={styles.helperText} style={{ color: 'var(--color-success)' }}>
                New company - you'll be the account owner.
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="linkedInType" className={styles.label}>
              LinkedIn Type
            </label>
            <select
              id="linkedInType"
              name="linkedInType"
              value={formData.linkedInType}
              onChange={handleChange}
              className={styles.input}
              disabled={isLoading}
              required
            >
              <option value="company">Company Page</option>
              <option value="profile">Personal Profile</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="companyIndustry" className={styles.label}>
              Industry (Optional)
            </label>
            <select
              id="companyIndustry"
              name="companyIndustry"
              value={formData.companyIndustry}
              onChange={handleChange}
              className={styles.input}
              disabled={isLoading}
            >
              <option value="">Select an industry</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Retail">Retail</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Education">Education</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Transportation">Transportation</option>
              <option value="Energy">Energy</option>
              <option value="Consulting">Consulting</option>
              <option value="Marketing & Advertising">Marketing & Advertising</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="Min. 8 characters"
              disabled={isLoading}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={styles.input}
              placeholder="Re-enter password"
              disabled={isLoading}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className={styles.signupLink}>
          Already have an account?{' '}
          <Link to="/login" className={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

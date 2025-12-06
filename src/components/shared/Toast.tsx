import { useToastStore, type Toast as ToastType } from '../../store/toastStore';
import { X, CheckCircle, AlertCircle, Info, Loader } from 'lucide-react';
import styles from './Toast.module.css';

function ToastItem({ toast }: { toast: ToastType }) {
  const { removeToast } = useToastStore();

  const icons = {
    info: <Info size={18} />,
    success: <CheckCircle size={18} />,
    error: <AlertCircle size={18} />,
    progress: <Loader size={18} className={styles.spinner} />,
  };

  return (
    <div className={`${styles.toast} ${styles[toast.type]}`}>
      <div className={styles.icon}>{icons[toast.type]}</div>
      <div className={styles.content}>
        <div className={styles.title}>{toast.title}</div>
        {toast.message && <div className={styles.message}>{toast.message}</div>}
        {toast.type === 'progress' && toast.progress !== undefined && (
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${toast.progress}%` }}
            />
          </div>
        )}
      </div>
      <button
        className={styles.closeButton}
        onClick={() => removeToast(toast.id)}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

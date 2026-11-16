import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const ACCESS_KEY = 'nmx-portfolio-unlocked';

export default function PasswordGate() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLab = location.pathname === '/ai-lab' || location.pathname.startsWith('/ai-lab/');
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(ACCESS_KEY) === 'yes');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (unlocked) return;
    inputRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') navigate('/');
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [navigate, unlocked]);

  if (unlocked) return <Outlet />;

  return createPortal(
    <div className="fixed inset-0 z-50 flex overflow-y-auto bg-[#18281c]/45 p-5">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="gate-title"
        aria-describedby="gate-description"
        className="relative m-auto w-full max-w-[440px] rounded-2xl bg-[#fffbf6] px-6 pb-7 pt-8 text-left shadow-[0_16px_56px_rgba(20,38,25,0.18)] sm:px-10 sm:pb-9 sm:pt-10"
      >
        <Link
          to="/"
          aria-label="Close password prompt"
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-2xl text-[#52685a] transition-colors hover:bg-[#edeae5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#184027]"
        >
          ×
        </Link>
        <div
          aria-hidden="true"
          className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-[#eeeaf9] text-[#615d99]"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="10" width="14" height="11" rx="3" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
          </svg>
        </div>
        <h1
          id="gate-title"
          className="pr-10 font-pfMarlet text-[34px] leading-tight text-[#184027] sm:text-[38px]"
        >
          Come on in
        </h1>
        <p id="gate-description" className="mt-3 max-w-[340px] text-sm leading-6 text-[#4c6254]">
          {isLab
            ? 'The AI Lab is password protected. Enter the password to see what’s inside.'
            : 'This case study is password protected. Enter the password to see what’s inside.'}
        </p>
        <form
          className="mt-7 text-left"
          onSubmit={(event) => {
            event.preventDefault();
            if (password === 'nmxdesignunlock') {
              sessionStorage.setItem(ACCESS_KEY, 'yes');
              setUnlocked(true);
            } else setError(true);
          }}
        >
          <label
            htmlFor="portfolio-password"
            className="mb-2 block text-sm font-medium text-[#184027]"
          >
            Password
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              id="portfolio-password"
              type={visible ? 'text' : 'password'}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError(false);
              }}
              placeholder="Enter password"
              autoComplete="current-password"
              aria-invalid={error}
              aria-describedby={error ? 'password-error' : undefined}
              className="h-[52px] w-full rounded-lg border border-[#cfcfc5] bg-white px-4 pr-16 text-base text-[#184027] placeholder:text-[#68786d] focus:border-[#7772aa] focus:outline-none focus:ring-2 focus:ring-[#aaaadd]/30"
            />
            <button
              type="button"
              onClick={() => setVisible(!visible)}
              className="absolute right-2 top-0 h-full min-w-[48px] px-2 text-xs font-medium text-[#435a4b]"
            >
              {visible ? 'Hide' : 'Show'}
            </button>
          </div>
          {error && (
            <p id="password-error" role="alert" className="mt-2 text-xs text-[#a43d35]">
              That password doesn’t look quite right. Please try again.
            </p>
          )}
          <button
            type="submit"
            className="mt-4 h-[52px] w-full rounded-lg bg-[#184027] text-sm font-medium text-white transition-colors hover:bg-[#285b39] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#184027]"
          >
            {isLab ? 'Explore the AI Lab' : 'View case study'}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-[#52685a]">
          Need access?{' '}
          <a
            className="text-[#68659e] underline underline-offset-4"
            href="mailto:nmxdesignau@gmail.com"
          >
            Get in touch
          </a>
        </p>
      </section>
    </div>,
    document.body,
  );
}

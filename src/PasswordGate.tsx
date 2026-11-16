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
        className="relative m-auto w-full max-w-[480px] rounded-3xl border border-white bg-[#fffbf6] px-6 pb-9 pt-11 text-center shadow-[0_24px_90px_rgba(20,38,25,0.22)] sm:px-12"
      >
        <Link
          to="/"
          aria-label="Close password prompt"
          className="absolute right-6 top-4 text-3xl text-[#647466]"
        >
          ×
        </Link>
        <div
          aria-hidden="true"
          className="mx-auto mb-5 flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#eeeaf9] text-[#716da6]"
        >
          <svg
            width="27"
            height="27"
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
        <h1 id="gate-title" className="font-pfMarlet text-[38px] leading-tight text-[#184027]">
          Come on in
        </h1>
        <p
          id="gate-description"
          className="mx-auto mt-3 max-w-xs text-[13px] leading-6 text-[#607064]"
        >
          {isLab
            ? 'The AI Lab is password protected. Enter the password to see what’s inside.'
            : 'This case study is password protected. Enter the password to see what’s inside.'}
        </p>
        <form
          className="mt-6 text-left"
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
            className="mb-2 block text-xs font-semibold text-[#184027]"
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
              className="h-[52px] w-full rounded-lg border border-[#cfcfc5] bg-white px-4 pr-16 text-sm text-[#184027] focus:border-[#8b88c6] focus:outline-none focus:ring-2 focus:ring-[#aaaadd]/30"
            />
            <button
              type="button"
              onClick={() => setVisible(!visible)}
              className="absolute right-3 top-0 h-full px-2 text-xs text-[#607064]"
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
            className="mt-4 h-[51px] w-full rounded-lg bg-[#aaaadd] text-sm font-semibold text-white hover:bg-[#9393ce]"
          >
            {isLab ? 'Explore the AI Lab' : 'View case study'} &nbsp; ↗
          </button>
        </form>
        <p className="mt-5 text-xs text-[#738076]">
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

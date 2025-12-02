import { useState } from 'react';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const Register = ({ onSwitchToLogin }: RegisterFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Register:', { name, email, password, confirmPassword, terms });
  };

  const passwordsMatch = password === confirmPassword;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 mb-2">
        <h2 className="text-2xl font-bold text-primary-color">Create Account</h2>
        <p className="text-sm text-secondary-color">Sign up to get started with HandySloth</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-primary-color">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full rounded-lg border border-border-color bg-secondary-bg px-4 py-3 text-sm text-primary-color placeholder:text-secondary-color focus:border-transparent focus:outline-none focus:ring focus:ring-main-color"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="register-email" className="text-sm font-medium text-primary-color">
            Email
          </label>
          <input
            id="register-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-lg border border-border-color bg-secondary-bg px-4 py-3 text-sm text-primary-color placeholder:text-secondary-color focus:border-transparent focus:outline-none focus:ring focus:ring-main-color"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="register-password" className="text-sm font-medium text-primary-color">
            Password
          </label>
          <input
            id="register-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="w-full rounded-lg border border-border-color bg-secondary-bg px-4 py-3 text-sm text-primary-color placeholder:text-secondary-color focus:border-transparent focus:outline-none focus:ring focus:ring-main-color"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="confirm-password" className="text-sm font-medium text-primary-color">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className={`w-full rounded-lg border px-4 py-3 text-sm text-primary-color placeholder:text-secondary-color focus:outline-none focus:ring ${
              confirmPassword && !passwordsMatch
                ? 'border-red-500 focus:ring-red-500'
                : 'border-border-color bg-secondary-bg focus:border-transparent focus:ring-main-color'
            }`}
          />
          {confirmPassword && !passwordsMatch && (
            <p className="text-xs text-red-500">Passwords do not match</p>
          )}
        </div>

        <div className="flex items-start gap-3 pt-2">
          <input
            id="terms"
            type="checkbox"
            required
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="w-4 h-4 mt-1 rounded border-border-color text-main-color focus:ring-main-color"
          />
          <label htmlFor="terms" className="text-sm text-secondary-color cursor-pointer">
            I agree to the{' '}
            <a href="#" className="text-main-color hover:underline font-semibold">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-main-color hover:underline font-semibold">
              Privacy Policy
            </a>
          </label>
        </div>

        <button
          type="submit"
          disabled={!passwordsMatch || !terms}
          className="w-full rounded-lg bg-main-color px-4 py-3 text-sm font-semibold text-black-color hover:bg-main-color/90 transition-colors focus:outline-none focus:ring focus:ring-main-color disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Account
        </button>
      </form>

      <div className="flex items-center justify-center gap-1 pt-2">
        <span className="text-sm text-secondary-color">Already have an account?</span>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-sm font-semibold text-main-color hover:underline focus:outline-none"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Register;
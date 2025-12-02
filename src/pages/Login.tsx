import { useState } from 'react';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const Login = ({ onSwitchToRegister }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login:', { email, password });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 mb-2">
        <h2 className="text-2xl font-bold text-primary-color">Welcome Back</h2>
        <p className="text-sm text-secondary-color">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-primary-color">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-lg border border-border-color bg-secondary-bg px-4 py-3 text-sm text-primary-color placeholder:text-secondary-color focus:border-transparent focus:outline-none focus:ring focus:ring-main-color"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-medium text-primary-color">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full rounded-lg border border-border-color bg-secondary-bg px-4 py-3 text-sm text-primary-color placeholder:text-secondary-color focus:border-transparent focus:outline-none focus:ring focus:ring-main-color"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-border-color text-main-color focus:ring-main-color"
            />
            <span className="text-sm text-secondary-color">Remember me</span>
          </label>
          <button
            type="button"
            className="text-sm text-main-color hover:underline focus:outline-none"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-main-color px-4 py-3 text-sm font-semibold text-black-color hover:bg-main-color/90 transition-colors focus:outline-none focus:ring focus:ring-main-color"
        >
          Sign In
        </button>
      </form>

      <div className="flex items-center justify-center gap-1 pt-2">
        <span className="text-sm text-secondary-color">Don't have an account?</span>
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-sm font-semibold text-main-color hover:underline focus:outline-none"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
import { useMachine } from '@xstate/react';
import { useEffect } from 'react';
import loginMachine from '../machines/LoginMachine';
import { useAuth } from '../context/AuthProvider';

interface LoginProps {
  onSwitchToRegister?: () => void;
}

const Login = ({ onSwitchToRegister }: LoginProps) => {
  const [state, send] = useMachine(loginMachine);
  const { send: sendAuth } = useAuth();
  const { email, password, error } = state.context;

  // Notify AuthMachine when login succeeds
  useEffect(() => {
    if (state.matches('success') && state.context.authResponse) {
      const { accessToken, refreshToken, user } = state.context.authResponse;
      sendAuth({
        type: 'SET_AUTHENTICATED',
        user,
        accessToken,
        refreshToken,
      });
    }
  }, [state, sendAuth]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    send({ type: 'SUBMIT' });
  };

  const handleSwitchToRegister = () => {
    if (onSwitchToRegister) {
      onSwitchToRegister();
    }
  };

  const isLoading = state.matches('submitting');
  const isSuccess = state.matches('success');

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-1 mb-5">
        <h2 className="text-2xl font-bold text-primary-color">Welcome Back</h2>
        <p className="text-sm text-secondary-color">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-primary-color">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => send({ type: 'CHANGE_FIELD', field: 'email', value: e.target.value })}
            placeholder="Enter your email"
            className="w-full rounded-lg border border-border-color bg-secondary-bg px-3 py-2 text-sm text-primary-color placeholder:text-secondary-color focus:border-transparent focus:outline-none focus:ring focus:ring-main-color"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium text-primary-color">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => send({ type: 'CHANGE_FIELD', field: 'password', value: e.target.value })}
            placeholder="Enter your password"
            className="w-full rounded-lg border border-border-color bg-secondary-bg px-3 py-2 text-sm text-primary-color placeholder:text-secondary-color focus:border-transparent focus:outline-none focus:ring focus:ring-main-color"
          />
        </div>

        <button
          type="button"
          className="w-max mx-auto text-sm text-main-color hover:underline focus:outline-none"
        >
          Forgot password?
        </button>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-main-color! px-4 py-3! text-sm font-semibold text-black-color hover:bg-main-color/90 transition-colors focus:outline-none focus:ring focus:ring-main-color disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing In...' : isSuccess ? 'Success!' : 'Sign In'}
        </button>
      </form>

      <div className="flex items-center justify-center gap-0 pt-4">
        <span className="text-sm text-secondary-color">Don't have an account?</span>
        <button
          type="button"
          onClick={handleSwitchToRegister}
          className="text-sm font-semibold text-main-color! hover:underline focus:outline-none"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
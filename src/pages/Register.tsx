import { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { useAppDispatch } from '../store/hooks';
import registerMachine from '../machines/RegisterMachine';
import { setAuthenticated } from '../store/features/AuthReducer';

interface RegisterProps {
  onSwitchToLogin?: () => void;
}

const Register = ({ onSwitchToLogin }: RegisterProps) => {
  const dispatch = useAppDispatch();
  const [state, send] = useMachine(registerMachine);
  const { username, email, password, confirmPassword, error } = state.context;

  useEffect(() => {
    if (state.matches('success') && state.context.authResponse) {
      const { accessToken, refreshToken, user } = state.context.authResponse;
      // Update Redux auth state - include refreshToken in user object
      dispatch(setAuthenticated({
        user: refreshToken ? { ...user, refreshToken } : user,
        accessToken,
        refreshToken,
      }));
    }
  }, [state, dispatch]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    send({ type: 'SUBMIT' });
  };

  const handleSwitchToLogin = () => {
    if (onSwitchToLogin) {
      onSwitchToLogin();
    }
  };

  const isLoading = state.matches('submitting');
  const isSuccess = state.matches('success');

  const passwordsMatch = password === confirmPassword;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-1 mb-5">
        <h2 className="text-2xl font-bold text-primary-color">Create Account</h2>
        <p className="text-sm text-secondary-color">Sign up to get started with HandySloth</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-primary-color">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={username}
            onChange={(e) => send({ type: 'CHANGE_FIELD', field: 'username', value: e.target.value })}
            placeholder="Enter your full name"
            className="w-full rounded-lg border border-border-color bg-secondary-bg px-3 py-2 text-sm text-primary-color placeholder:text-secondary-color focus:border-transparent focus:outline-none focus:ring focus:ring-main-color"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="register-email" className="text-sm font-medium text-primary-color">
            Email
          </label>
          <input
            id="register-email"
            type="email"
            required
            value={email}
            onChange={(e) => send({ type: 'CHANGE_FIELD', field: 'email', value: e.target.value })}
            placeholder="Enter your email"
            className="w-full rounded-lg border border-border-color bg-secondary-bg px-3 py-2 text-sm text-primary-color placeholder:text-secondary-color focus:border-transparent focus:outline-none focus:ring focus:ring-main-color"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="register-password" className="text-sm font-medium text-primary-color">
            Password
          </label>
          <input
            id="register-password"
            type="password"
            required
            value={password}
            onChange={(e) => send({ type: 'CHANGE_FIELD', field: 'password', value: e.target.value })}
            placeholder="Create a password"
            className="w-full rounded-lg border border-border-color bg-secondary-bg px-3 py-2 text-sm text-primary-color placeholder:text-secondary-color focus:border-transparent focus:outline-none focus:ring focus:ring-main-color"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="confirm-password" className="text-sm font-medium text-primary-color">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => send({ type: 'CHANGE_FIELD', field: 'confirmPassword', value: e.target.value })}
            placeholder="Confirm your password"
            className={`w-full rounded-lg border px-3 py-2 text-sm text-primary-color placeholder:text-secondary-color focus:outline-none focus:ring ${
              confirmPassword && !passwordsMatch
                ? 'border-red-500 focus:ring-red-500'
                : 'border-border-color bg-secondary-bg focus:border-transparent focus:ring-main-color'
            }`}
          />
          {confirmPassword && !passwordsMatch && (
            <p className="text-xs text-red-500">Passwords do not match</p>
          )}
        </div>

        {/* <div className="flex items-start gap-3 pt-2">
          <input
            id="terms"
            type="checkbox"
            required
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
        </div> */}

        {error && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!passwordsMatch || isLoading}
          className="w-full rounded-lg bg-main-color! px-4 py-3! mt-5 text-sm font-semibold text-black-color hover:bg-main-color/90 transition-colors focus:outline-none focus:ring focus:ring-main-color disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating Account...' : isSuccess ? 'Success!' : 'Create Account'}
        </button>
      </form>

      <div className="flex items-center justify-center gap-0 pt-4">
        <span className="text-sm text-secondary-color">Already have an account?</span>
        <button
          type="button"
          onClick={handleSwitchToLogin}
          className="text-sm font-semibold text-main-color! hover:underline focus:outline-none"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Register;
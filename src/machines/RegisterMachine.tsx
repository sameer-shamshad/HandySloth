import type { User } from "../types";
import { assign, fromPromise, setup } from "xstate";
import { register as registerApi } from "../services/authService";

const registerMachine = setup({
    types: {
        context: {} as {
            username: string;
            email: string;
            password: string;
            confirmPassword: string;
            error: string | null;
            authResponse: { accessToken: string; refreshToken: string; user: User } | null;
        },
        events: {} as
            | { type: 'CHANGE_FIELD'; field: 'username' | 'email' | 'password' | 'confirmPassword'; value: string }
            | { type: 'SUBMIT' }
            | { type: 'RESET' }
    },
    actors: {
        register: fromPromise(async ({ input }: { input: { username: string; email: string; password: string } }) => {
            const response = await registerApi({
                username: input.username,
                email: input.email,
                password: input.password,
            });
            return response;
        }),
    },
    actions: {
        changeField: assign(({ context, event }) => {
            if (event.type !== 'CHANGE_FIELD') return context;
            return {
                ...context,
                [event.field]: event.value,
            };
        }),
        setError: assign(({ context, event }) => {
            const error = (event as unknown as { error: Error | unknown }).error;
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            return {
                ...context,
                error: errorMessage,
            };
        }),
        clearError: assign(({ context }) => ({
            ...context,
            error: null,
        })),
        clearForm: assign(() => ({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            error: null,
            authResponse: null,
        })),
        setValidationError: assign(({ context }) => {
            const username = context.username.trim();
            const email = context.email.trim();
            const password = context.password.trim();
            const confirmPassword = context.confirmPassword.trim();

            if (!username) {
                return { ...context, error: 'Username is required' };
            }
            
            if (!email) {
                return { ...context, error: 'Email is required' };
            }
            
            if (!password) {
                return { ...context, error: 'Password is required' };
            }
            
            if (password.length <= 6) {
                return { ...context, error: 'Password must be at least 7 characters long' };
            }
            
            if (!confirmPassword) {
                return { ...context, error: 'Please confirm your password' };
            }
            
            if (password !== confirmPassword) {
                return { ...context, error: 'Passwords do not match' };
            }

            return context;
        }),
        storeAuth: assign(({ context, event }) => {
            const output = (event as unknown as { output: { accessToken: string; refreshToken: string; user: User } }).output;
            localStorage.setItem('accessToken', output.accessToken);
            localStorage.setItem('refreshToken', output.refreshToken);
            return {
                ...context,
                authResponse: output,
            };
        }),
    },
    guards: {
        isValidForm: ({ context }) => {
            const username = context.username.trim();
            const email = context.email.trim();
            const password = context.password.trim();
            const confirmPassword = context.confirmPassword.trim();
            
            return username.length > 0
                && email.length > 0
                && password.length > 6
                && confirmPassword.length > 6
                && password === confirmPassword;
        },
    },
}).createMachine({
    id: 'registerMachine',
    initial: 'idle',
    context: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        error: null,
        authResponse: null,
    },
    states: {
        idle: {
            entry: 'clearError',
            on: {
                CHANGE_FIELD: { actions: 'changeField' },
                SUBMIT: [
                    {
                        guard: 'isValidForm',
                        target: 'submitting',
                        actions: 'clearError',
                    },
                    {
                        actions: 'setValidationError',
                        target: 'idle',
                    },
                ],
            },
        },
        submitting: {
            invoke: {
                src: 'register',
                input: ({ context }) => ({
                    username: context.username,
                    email: context.email,
                    password: context.password,
                }),
                onDone: {
                    target: 'success',
                    actions: 'storeAuth',
                },
                onError: {
                    target: 'idle',
                    actions: 'setError',
                },
            },
        },
        success: {
            after: {
                1000: { target: 'idle', actions: 'clearForm' },
            },
        },
    },
});

export default registerMachine;

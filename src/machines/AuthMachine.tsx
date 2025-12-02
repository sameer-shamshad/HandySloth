import type { User } from "../types";
import { assign, fromPromise, setup } from "xstate";
import { checkSession as checkSessionApi } from "../services/authService";

const getInitialContext = () => {
    const accessToken = localStorage.getItem('accessToken');

    return {
        user: null,
        accessToken: accessToken || null,
        isAuthenticated: false,
        isLoading: false,
    };
};

const authMachine = setup({
    types: {
        context: {} as {
            user: User | null;
            accessToken: string | null;
            isAuthenticated: boolean;
            isLoading: boolean;
        },
        events: {} as
            | { type: 'LOGOUT' }
            | { type: 'SET_AUTHENTICATED'; user: User; accessToken: string }
    },
    actors: {
        checkSession: fromPromise(async ({ input }: { input: { accessToken: string | null } }) => {
            const { accessToken } = input;
            
            // If no token in localStorage, session is invalid
            if (!accessToken) {
                throw new Error('No access token found');
            }

            try { // Call the API to verify the session
                const response = await checkSessionApi(accessToken);
                return response;
            } catch (error) { // If API call fails, session is invalid
                throw error;
            }
        }),
    },
    actions: {
        storeUserData: assign(({ context, event }) => {
            // When checkSession succeeds, event.output contains the response
            const output = (event as unknown as { output: { user: User; accessToken: string; } }).output;
            
            // Update tokens if new ones are provided
            if (output.accessToken) {
                localStorage.setItem('accessToken', output.accessToken);
            }

            return {
                ...context,
                user: output.user,
                accessToken: output.accessToken || context.accessToken,
                isAuthenticated: true,
                isLoading: false,
            };
        }),
        setAuthenticated: assign(({ context, event }) => {
            if (event.type !== 'SET_AUTHENTICATED') return context;
            
            localStorage.setItem('accessToken', event.accessToken);

            return {
                ...context,
                user: event.user,
                accessToken: event.accessToken,
                isAuthenticated: true,
                isLoading: false,
            };
        }),
        clearTokens: assign(({ context }) => {
            localStorage.removeItem('accessToken');

            return {
                ...context,
                accessToken: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
            };
        }),
        logout: assign(({ context }) => {
            localStorage.removeItem('accessToken');

            return {
                ...context,
                accessToken: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
            };
        }),
    },
    guards: {
        isTokenValid: ({ event }) => {
            const output = (event as unknown as { output: { user: User } }).output;
            return !!output && !!output.user;
        },
    },
}).createMachine({
    id: 'authMachine',
    initial: 'checking',
    context: getInitialContext(),
    states: {
        checking: {
            entry: assign(({ context }) => ({ ...context, isLoading: true })),
            invoke: {
                src: "checkSession",
                input: ({ context }) => ({ accessToken: context.accessToken }),
                onDone: {
                    guard: 'isTokenValid',
                    target: 'authenticated',
                    actions: 'storeUserData',
                },
                onError: {
                    target: 'unauthenticated',
                    actions: 'clearTokens',
                }
            },
        },
        authenticated: {
            entry: assign(({ context }) => ({ ...context, isLoading: false })),
            on: {
                LOGOUT: { actions: 'logout', target: 'checking' },
                SET_AUTHENTICATED: { actions: 'setAuthenticated' },
            }
        },
        unauthenticated: {
            entry: assign(({ context }) => ({ ...context, isLoading: false })),
            on: {
                SET_AUTHENTICATED: { target: 'authenticated', actions: 'setAuthenticated' },
            }
        },
    },
});

export default authMachine;
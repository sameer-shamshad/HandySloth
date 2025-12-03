import type { User } from "../types";
import { assign, fromPromise, setup } from "xstate";
import { 
    checkSession as checkSessionApi, 
    refreshAccessToken as refreshAccessTokenApi
} from "../services/auth.service";

const getInitialContext = () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    return {
        user: null,
        accessToken: accessToken || null,
        refreshToken: refreshToken || null,
        isAuthenticated: false,
        isLoading: false,
    };
};

const authMachine = setup({
    types: {
        context: {} as {
            user: User | null;
            accessToken: string | null;
            refreshToken: string | null;
            isAuthenticated: boolean;
            isLoading: boolean;
        },
        events: {} as
            | { type: 'LOGOUT' }
            | { type: 'SET_AUTHENTICATED'; user: User; accessToken: string; refreshToken: string }
    },
    actors: {
        checkSession: fromPromise(async ({ input }: { input: { accessToken: string | null; refreshToken: string | null } }) => {
            const { accessToken, refreshToken } = input;
            
            // If no token in localStorage, session is invalid
            if (!accessToken) {
                throw new Error('No access token found');
            }

            try { // Call the API to verify the session
                const response = await checkSessionApi(accessToken);
                return response;
            } catch (error: unknown) { // If API call fails, check if it's a 401 and try to refresh
                if (error instanceof Error && 'statusCode' in error) {
                    const errorWithStatus = error as Error & { statusCode?: number };
                    if (errorWithStatus.statusCode === 401 && refreshToken) {
                        try { // Try to refresh the access token
                            const refreshResponse = await refreshAccessTokenApi(refreshToken);
                            
                            localStorage.setItem('accessToken', refreshResponse.accessToken);
                            
                            return {
                                accessToken: refreshResponse.accessToken,
                            };
                        } catch (refreshError) {
                            throw refreshError;
                        }
                    }
                }
                // If it's not a 401 or refresh failed, throw the original error
                throw error;
            }
        }),
    },
    actions: {
        storeUserData: assign(({ context, event }) => {
            // When checkSession succeeds, event.output contains the response
            const output = (event as unknown as { output: { user: User; accessToken: string; refreshToken: string } }).output;
            
            // Update tokens if new ones are provided
            if (output.accessToken) {
                localStorage.setItem('accessToken', output.accessToken);
            }

            if (output.refreshToken) {
                localStorage.setItem('refreshToken', output.refreshToken);
            }

            return {
                ...context,
                user: output.user,
                accessToken: output.accessToken || context.accessToken,
                refreshToken: output.refreshToken || context.refreshToken,
                isAuthenticated: true,
                isLoading: false,
            };
        }),
        setAuthenticated: assign(({ context, event }) => {
            if (event.type !== 'SET_AUTHENTICATED') return context;
            
            localStorage.setItem('accessToken', event.accessToken);
            localStorage.setItem('refreshToken', event.refreshToken);

            return {
                ...context,
                user: event.user,
                accessToken: event.accessToken,
                refreshToken: event.refreshToken,
                isAuthenticated: true,
                isLoading: false,
            };
        }),
        clearTokens: assign(({ context }) => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            return {
                ...context,
                accessToken: null,
                refreshToken: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
            };
        }),
        logout: assign(({ context }) => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            return {
                ...context,
                accessToken: null,
                refreshToken: null,
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
                input: ({ context }) => ({ 
                    accessToken: context.accessToken,
                    refreshToken: context.refreshToken,
                }),
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
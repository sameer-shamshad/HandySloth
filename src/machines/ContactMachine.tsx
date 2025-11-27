import { assign, setup } from "xstate";
import type { Contact } from "../types";

const initialContactContext: Contact = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    reason: '',
    terms: false,
};

export const contactMachine = setup({
    types: {
        context: {} as Contact,
        events: {} as
            | { type: 'CHANGE_FIELD'; field: keyof Contact; value: Contact[keyof Contact] }
            | { type: 'SUBMIT_CONTACT' }
            | { type: 'RESET' },
    },
    actions: {
        changeField: assign(({ context, event }) => {
            if (event.type !== 'CHANGE_FIELD') return context;
            return {
                ...context,
                [event.field]: event.value,
            };
        }),
        resetContact: assign(() => ({ ...initialContactContext })),
        submitContact: ({ context }) => {
            console.info('Submitting contact payload', context);
        },
    },
    guards: {
        hasRequiredContactInfo: ({ context }) => {
            return context.firstName.trim().length > 0 && 
                context.lastName.trim().length > 0 && 
                context.email.trim().length > 0 && 
                context.phone.trim().length > 0 && 
                context.company?.trim().length > 0 && 
                context.message.trim().length > 0 && 
                context.reason.trim().length > 0 && 
                context.terms;
        },
    },
}).createMachine({
    id: 'contactMachine',
    initial: 'idle',
    context: initialContactContext,
    states: {
        idle: {
            on: {
                CHANGE_FIELD: { actions: 'changeField' },
                SUBMIT_CONTACT: { 
                    guard: 'hasRequiredContactInfo',
                    actions: 'submitContact',
                    target: 'success',
                },
            },
        },
        success: {
            after: {
                1000: { actions: 'resetContact', target: 'idle' },
            },
        },
    },
})
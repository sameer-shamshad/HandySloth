import React from "react";
import { useMachine } from "@xstate/react";
import { contactMachine } from "../machines/ContactMachine";

const ContactPage = () => {
    const [state, send] = useMachine(contactMachine);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        send({ type: 'SUBMIT_CONTACT' });
    }
  return (
    <div>
        <div className='h-full max-w-[900px]'>
        <h3 className='pb-4 text-xl font-medium text-primary-color'>Contact Us</h3>
        <form 
            onSubmit={handleSubmit}
            className='flex flex-col gap-3 bg-[#E2E2FF] p-4 py-8 rounded-2xl dark:bg-primary-bg sm:p-6 md:p-8 lg:p-10 xl:p-15
                [&>input]:rounded-lg [&>input]:p-2 [&>input]:text-primary-color [&>input]:text-sm
                [&>input]:bg-secondary-bg [&>input]:outline-none [&>textarea]:rounded-lg 
                [&>textarea]:p-2 [&>textarea]:text-primary-color [&>textarea]:bg-secondary-bg [&>textarea]:outline-none'
        >
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-2 [&>input]:rounded-lg [&>input]:p-2 [&>input]:text-primary-color 
                [&>input]:bg-secondary-bg [&>input]:outline-none [&>input]:text-sm'>
                <input 
                    required
                    type='text' 
                    placeholder='First Name'
                    value={state.context.firstName}
                    onChange={(e) => send({ type: 'CHANGE_FIELD', field: 'firstName', value: e.target.value })}
                />
                <input 
                    required
                    type='text' 
                    placeholder='Last Name'
                    value={state.context.lastName}
                    onChange={(e) => send({ type: 'CHANGE_FIELD', field: 'lastName', value: e.target.value })}
                />
            </div>

            <input 
                required
                type='email' 
                placeholder='Email'
                value={state.context.email}
                onChange={(e) => send({ type: 'CHANGE_FIELD', field: 'email', value: e.target.value })}
            />

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-2 [&>input]:rounded-lg [&>input]:p-2 [&>input]:text-primary-color 
                [&>input]:bg-secondary-bg [&>input]:outline-none [&>input]:text-sm'>
                <input 
                    required
                    type="tel" 
                    placeholder="Contact Number"
                    value={state.context.phone}
                    onChange={(e) => send({ type: 'CHANGE_FIELD', field: 'phone', value: e.target.value })}
                />

                <input 
                    required
                    type="text" 
                    placeholder="Company Name"
                    value={state.context.company}
                    onChange={(e) => send({ type: 'CHANGE_FIELD', field: 'company', value: e.target.value })}
                />
            </div>

            <textarea 
                rows={5}
                required
                className='resize-none'
                placeholder='Message' 
                value={state.context.message}
                onChange={(e) => send({ type: 'CHANGE_FIELD', field: 'message', value: e.target.value })}
            />

            <div className='gap-2 flex items-center justify-between sm:justify-start'>
                <label htmlFor="reason" className='text-sm text-primary-color sm:text-[16px]'>Reason for contact</label>
                <select 
                    required
                    id="reason" 
                    className='rounded-lg p-2 bg-transparent text-sm text-primary-color border-2 border-border-color outline-none sm:ml-3'
                    value={state.context.reason}
                    onChange={(e) => send({ type: 'CHANGE_FIELD', field: 'reason', value: e.target.value })}
                >
                    <option value="" disabled>Reason for contact</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
            </div>

            <div className='flex items-center gap-4 pt-5'>
                <input 
                    id='terms' 
                    type='checkbox' 
                    className='w-5 h-5'
                    checked={state.context.terms}
                    onChange={(e) => send({ type: 'CHANGE_FIELD', field: 'terms', value: e.target.checked })}
                />
                <label htmlFor='terms' className='flex items-center gap-1 text-sm text-primary-color
                    [&>a]:text-primary-color [&>a]:font-extrabold [&>a]:underline! [&>a]:underline-offset-3 [&>span]:-ml-1'
                >
                    <span>I agree to</span>
                    <a href="#">Terms of service</a>
                    <span className=''>,</span>
                    <a href="#">Privacy Policy</a>
                    <span>.</span>
                </label>
            </div>

            <button 
                type='submit'
                className='w-full! py-2! bg-white! text-black! px-4! rounded-lg mt-2'
            >Send Message</button>
        </form>
    </div>
    </div>
  );
};

export default ContactPage;
import React from "react";
import { useMachine } from "@xstate/react";
// import { contactMachine } from "../machines/ContactMachine";

const Contact = () => {
    // const [state, send] = useMachine(contactMachine);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submitted');
    }
  return (
    <div>
        <div className='h-full max-w-[900px]'>
        <h3 className='pb-4 text-xl font-medium text-primary-color'>Contact Us</h3>
        <form 
            onSubmit={handleSubmit}
            className='flex flex-col gap-3 bg-[#E2E2FF] p-4 py-8 rounded-2xl dark:bg-primary-bg
                [&>input]:rounded-lg [&>input]:p-2 [&>input]:text-primary-color [&>input]:text-sm
                [&>input]:bg-secondary-bg [&>input]:outline-none [&>textarea]:rounded-lg 
                [&>textarea]:p-2 [&>textarea]:text-primary-color [&>textarea]:bg-secondary-bg [&>textarea]:outline-none'
        >
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-2 [&>input]:rounded-lg [&>input]:p-2 [&>input]:text-primary-color 
                [&>input]:bg-secondary-bg [&>input]:outline-none [&>input]:text-sm'>
                <input 
                    type='text' 
                    placeholder='First Name'
                />
                <input 
                    type='text' 
                    placeholder='Last Name'
                />
            </div>

            <input 
                type='email' 
                placeholder='Email'
            />

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-2 [&>input]:rounded-lg [&>input]:p-2 [&>input]:text-primary-color 
                [&>input]:bg-secondary-bg [&>input]:outline-none [&>input]:text-sm'>
                <input 
                    type="tel" 
                    placeholder="Contact Number"
                />

                <input 
                    type="text" 
                    placeholder="Company Name"
                />
            </div>

            <textarea 
                placeholder='Message' 
                rows={5}
            />

            <div className='gap-2 flex items-center justify-between sm:justify-start'>
                <label htmlFor="reason" className='text-sm text-primary-color sm:text-[16px]'>Reason for contact</label>
                <select 
                    id="reason" 
                    className='rounded-lg p-2 bg-transparent text-sm text-primary-color border-2 border-border-color outline-none sm:ml-20'
                >
                    <option value="1">Reason for contact</option>
                </select>
            </div>

            <div className='flex items-center gap-4'>
                <input 
                    id='terms' 
                    type='checkbox' 
                    className='w-5 h-5'
                    onChange={() => {}}
                />
                <label htmlFor='terms' className='flex items-center gap-1 text-sm text-secondary-color
                    [&>a]:text-primary-color [&>a]:font-extrabold [&>a]:hover:underline! [&>a]:underline-offset-3 [&>span]:-ml-1'
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
                className='w-full! bg-white! text-black! px-4 py-2 rounded-lg'
            >Send Message</button>
        </form>
    </div>
    </div>
  );
};

export default Contact;
import "bootstrap";
import { useState, memo } from 'react';
import type { Tool, ToolLink } from '../../types';

const ToolCard = memo(({ tool, tag }: {tool: Tool, tag: string }) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="relative flex flex-col gap-4 rounded-2xl bg-[#E2E2FF] p-6 dark:bg-secondary-bg">
      <div className="flex gap-3 pt-3">
        <img src={tool.logo} alt={tool.name} className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg object-cover shadow-[0_0_50px_1px_#A9ECEC] dark:shadow-[0_0_30px_1px_#A9ECEC4D]" />
        <div>
          <p className="text-base font-semibold text-primary-color">{tool.name}</p>
          <p className="text-[11px] uppercase tracking-wide text-secondary-color mt-1">{tool.category}</p>
          <p className="text-xs text-secondary-color font-maven-pro my-1">{tool.description}</p>
        </div>
        <span className="absolute -top-3 left-0 rounded-md bg-main-color w-14 text-center py-1 text-sm font-medium text-black-color">
          {tag}
        </span>

        <button 
          onClick={handleBookmark}
          className='min-w-max! p-0! text-primary-color ml-auto bg-transparent!'
        >
          {
            isBookmarked ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-bookmark" viewBox="0 0 16 16">
                <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-bookmark" viewBox="0 0 16 16">
                <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
              </svg>
            )
          }
        </button>
      </div>


      <div className="grid grid-cols-3 gap-3 text-xs font-medium mt-auto">
        {
            tool.links.map((link: ToolLink) => (
              <a
                  href={link.url}
                  key={link.label}
                  className={`w-full font-extralight! flex-1 text-center rounded-full shadow-[0_0_50px_0.1px_#A9ECEC] dark:shadow-none border-2 border-main-color dark:border-none px-4 lg:px-5 xl:px-2 py-1 md:py-2 bg-primary-bg 
                  text-primary-color drop-shadow-sm shadow-main-color${link.url === '' ? ' pointer-events-none opacity-100' : ''}`}
              >
                  {link.label}
              </a>
            ))
        }
      </div>
    </div>
  );
});

export default ToolCard;
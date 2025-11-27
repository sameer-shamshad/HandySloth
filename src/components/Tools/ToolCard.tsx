import { memo } from 'react';
import type { Tool, ToolLink } from '../../types';

const ToolCard = memo(({ tool, tag }: {tool: Tool, tag: string }) => {
  return (
    <div className="relative flex flex-col gap-4 rounded-2xl bg-[#E2E2FF] p-4 dark:bg-secondary-bg">
      <div className="flex items-center gap-3 pt-3">
        <img src={tool.logo} alt={tool.name} className="h-10 w-10 rounded-sm object-cover shadow-[0_0_30px_1px_#A9ECEC4D]" />
        <div>
          <p className="text-base font-semibold text-primary-color">{tool.name}</p>
          <p className="text-[11px] uppercase tracking-wide text-secondary-color mt-1">{tool.category}</p>
        </div>
        <span className="absolute -top-1 left-0 rounded-md bg-main-color w-14 text-center py-1 text-xs font-medium text-black-color">
          {tag}
        </span>

        <button 
          className='material-symbols-outlined text-primary-color ml-auto bg-transparent!'
        >
          bookmark
        </button>
      </div>

      <p className="text-xs text-secondary-color font-maven-pro dark:text-gray-200">{tool.description}</p>

      <div className="grid grid-cols-3 gap-2 text-xs font-medium mt-auto">
        {
            tool.links.map((link: ToolLink) => (
              <a
                  href={link.url}
                  key={link.label}
                  className={`flex-1 text-center rounded-full border-2 border-main-color dark:border-none px-4 lg:px-5 py-1 md:py-2 bg-primary-bg 
                  text-primary-color drop-shadow-sm shadow-main-color${link.url === '' ? ' pointer-events-none opacity-50' : ''}`}
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
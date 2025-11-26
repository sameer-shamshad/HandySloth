import type { Tool, ToolLink } from '../../types';

const ToolCard = ({ tool }: { tool: Tool }) => {
  return (
    <div className="relative flex flex-col gap-4 rounded-2xl bg-[#E2E2FF] p-4 shadow-main-color shadow-sm dark:bg-group-bg">
      <div className="flex items-center gap-3 pt-3">
        <img src={tool.logo} alt={tool.name} className="h-10 w-10 rounded-sm object-cover" />
        <div>
          <p className="text-base font-semibold text-primary-color">{tool.name}</p>
          <p className="text-[11px] uppercase tracking-wide text-secondary-color">{tool.category}</p>
        </div>
        <span className="absolute -top-3 left-0 rounded-lg bg-main-color px-3 py-1 text-xs font-medium text-black-color">
          NEW
        </span>

        <button 
          className='material-symbols-outlined text-primary-color ml-auto bg-transparent!'
        >bookmark</button>
      </div>

      <p className="text-xs text-secondary-color dark:text-gray-200">{tool.description}</p>

      <div className="flex flex-wrap gap-2 text-xs font-medium">
        {
            tool.links.map((link: ToolLink) => (
                <a
                    href={link.url}
                    key={link.label}
                    className={`rounded-full border-2 border-main-color px-4 lg:px-5 py-1 md:py-2 bg-primary-bg 
                    text-primary-color drop-shadow-sm shadow-main-color${link.url === '' ? ' pointer-events-none opacity-50' : ''}`}
                >
                    {link.label}
                </a>
            ))
        }
      </div>
    </div>
  );
};

export default ToolCard;
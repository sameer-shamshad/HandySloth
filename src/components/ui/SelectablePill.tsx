interface SelectablePillProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

const SelectablePill = ({ label, selected, onToggle }: SelectablePillProps) => (
  <button
    type="button"
    onClick={onToggle}
    className={`rounded-full! h-[35px]! border pl-4! text-sm font-semibold transition-all duration-200
      hover:[&_span]:bg-red-500 hover:[&_span]:text-white ${
      selected
        ? 'bg-main-color! text-black-color!'
        : 'bg-secondary-bg! text-secondary-color! border-(--border-color) pr-4!'
    }`}
  >
    {label}

    {
      selected &&
      <span className="material-symbols-outlined text-lg! w-6 h-6 flex! items-center justify-center rounded-full">
        close
      </span>
    }
  </button>
);

export default SelectablePill;
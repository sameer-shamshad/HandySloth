interface SelectablePillProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

const SelectablePill = ({ label, selected, onToggle }: SelectablePillProps) => (
  <button
    type="button"
    onClick={onToggle}
    className={`flex items-center justify-between bg-secondary-bg! py-1! rounded-full! border text-sm font-semibold transition-all duration-200
      hover:[&_span]:bg-red-500 hover:[&_span]:text-white ${
      selected
        ? 'pr-1!'
        : 'text-secondary-color! border-border-color'
    }`}
  >
    {label}

    {
      selected &&
      <span className="material-symbols-outlined text-lg! w-5 h-5 flex! items-center justify-center rounded-full">
        close
      </span>
    }
  </button>
);

export default SelectablePill;
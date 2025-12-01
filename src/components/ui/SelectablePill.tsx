interface SelectablePillProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

const SelectablePill = ({ label, selected, onToggle }: SelectablePillProps) => (
  <button
    type="button"
    onClick={onToggle}
    className={`rounded-full! border px-4! py-1! text-sm font-semibold transition-all duration-200 ${
      selected
        ? 'bg-main-color! text-black-color!'
        : 'bg-secondary-bg! text-secondary-color! border-(--border-color)'
    }`}
  >
    {label}
  </button>
);

export default SelectablePill;
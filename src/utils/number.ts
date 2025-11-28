export const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) {
    return '0';
  }

  return new Intl.NumberFormat('en-US').format(value);
};



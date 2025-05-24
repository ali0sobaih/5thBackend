export const parseQuantity = (row: any) => {
  const quantity: { string_val?: string; number_val?: number } = {};
  if (row.string_val) quantity.string_val = String(row.string_val);
  if (row.number_val) quantity.number_val = Number(row.number_val);
  return Object.keys(quantity).length ? quantity : undefined;
};

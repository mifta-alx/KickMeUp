export const formatPrice = price => {
  const formatted = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return formatted;
};

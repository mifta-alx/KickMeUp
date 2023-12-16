export const formatPrice = price => {
  const priceString = typeof price === 'string' ? price : price.toString();
  const formatted = priceString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return formatted;
};

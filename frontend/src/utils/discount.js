export function isDiscountActive(product) {
  if (!product.discount_price) return false;
  if (!product.discount_ends_at) return true;
  return new Date(product.discount_ends_at).getTime() > Date.now();
}

export function getEffectivePrice(product) {
  return isDiscountActive(product) ? Number(product.discount_price) : Number(product.price);
}

export function discountMargin(product) {
  return Number(product.price) - Number(product.discount_price);
}

// Discount wale products (jyada margin pehle) upar, baaki apne original
// order mein neeche — home page, category page, sabhi jagah isi se use hoga
export function sortByDiscountPriority(products) {
  const discounted = products
    .filter(isDiscountActive)
    .sort((a, b) => discountMargin(b) - discountMargin(a));
  const nonDiscounted = products.filter((p) => !isDiscountActive(p));
  return [...discounted, ...nonDiscounted];
}

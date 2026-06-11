import { products } from "@/mocks/products";

export function getProductName(productId: string) {
  return (
    products.find((product) => product.id === productId)?.name ?? productId
  );
}

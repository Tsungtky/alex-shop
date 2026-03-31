// products page
// 1) show all products in a grid
// 2) each product shows image, name, price
// 3) click on product to go to product detail page

import Link from "next/link";

type Product = {
  id: number;
  nameJa: string;
  price: number;
  imageUrl: string;
  category: string;
};

export default async function ProductsPage() {
  const res = await fetch("http://localhost:8080/api/products");
  const products = await res.json();

  return (
    <div className="grid grid-cols-3 gap-6 p-8">
      {products.map((product: Product) => (
        <Link href={`/products/${product.id}`} key={product.id}>
          <div className="border border-stone-200 rounded-xl overflow-hidden hover:shadow-md transition cursor-pointer">
            <img
              src={product.imageUrl}
              alt={product.nameJa}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <p className="font-medium text-stone-800">{product.nameJa}</p>
              <p className="text-stone-500 text-sm mt-1">
                ¥{product.price.toLocaleString()}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

import AddToCart from "./AddToCart";

type Product = {
  id: number;
  nameJa: string;
  price: number;
  imageUrl: string;
  category: string;
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(`http://localhost:8080/api/products/${id}`);
  const product: Product = await res.json();

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <div className="grid grid-cols-2 gap-12">
        <img
          src={product.imageUrl}
          alt={product.nameJa}
          className="w-full h-96 object-cover rounded-2xl"
        />
        <div className="flex flex-col justify-center gap-4">
          <p className="text-xs tracking-widest text-stone-400 uppercase">
            {product.category}
          </p>
          <h1 className="text-3xl font-light text-stone-800">
            {product.nameJa}
          </h1>
          <div className="w-8 h-px bg-stone-300"></div>
          <p className="text-2xl text-stone-700">
            ¥{product.price.toLocaleString()}
          </p>
          <AddToCart productId={product.id} />
        </div>
      </div>
    </div>
  );
}

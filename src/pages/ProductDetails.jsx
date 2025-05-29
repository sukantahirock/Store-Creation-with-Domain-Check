import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductDetails() {
  const { state } = useLocation();
  const { id } = useParams();
  const [product, setProduct] = useState(state?.product || null);
  const [loading, setLoading] = useState(!state?.product);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!product && id) {
      axios
        .get(`https://glore-bd-backend-node-mongo.vercel.app/api/product/${id}`)
        .then((res) => {
          setProduct(res.data.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load product.");
          setLoading(false);
        });
    }
  }, [id, product]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (!product) return <div className="p-4 text-center">Product not found.</div>;

  return (
    <div className="w-full flex justify-center">
    <div className="p-6 max-w-2xl mx-auto">
      <img
        src={product.images?.[0]?.secure_url}
        alt={product.name}
        className="w-full h-96 object-cover rounded"
      />
      <h1 className="text-3xl font-bold mt-4">{product.name}</h1>
      <p className="text-gray-600 mt-2">{product.description}</p>
      <p className="text-blue-500 text-xl font-semibold mt-4">
        ৳ {product.price}
      </p>
    </div>
    </div>
  );
}

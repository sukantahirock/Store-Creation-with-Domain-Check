import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("https://glore-bd-backend-node-mongo.vercel.app/api/product")
      .then((res) => {
        setProducts(res.data.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  return (
    <div className="w-full flex justify-center">
    <div className="max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {products.length === 0 ? (
        <p className="text-center col-span-3">No products found.</p>
      ) : (
        products.map((product) => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            state={{ product }}
            className="border rounded shadow-md p-4 hover:shadow-lg transition"
          >
            <img
              src={product.images?.[0]?.secure_url}
              alt={product.name}
              className="h-48 w-full object-cover rounded"
            />
            <h2 className="text-xl font-bold mt-2">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-blue-500 font-semibold">৳ {product.price}</p>
          </Link>
        ))
      )}
    </div>
    </div>
  );
}

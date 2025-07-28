import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { startupService } from "../../services/startupService";
import { StartupWithProducts, Product } from "../../types/database";

export function StartupDetailPage() {
  const { id } = useParams();
  const [startup, setStartup] = useState<StartupWithProducts | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      startupService.getStartup(id).then((data) => {
        setStartup(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading startup...</div>;
  if (!startup) return <div className="p-8 text-center text-red-500">Startup not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start">
        <img
          src={startup.logo_url || "/default-logo.png"}
          alt={startup.name}
          className="w-32 h-32 object-cover rounded-full border mb-4 md:mb-0"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{startup.name}</h1>
          <div className="text-gray-600 mb-2">{startup.location}</div>
          <div className="text-gray-800 mb-4 max-w-xl">{startup.description}</div>
          <a href={startup.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">{startup.website}</a>
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-4">Products & Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {startup.products && startup.products.length > 0 ? (
          startup.products.map((product: Product) => (
            <div key={product.id} className="border rounded-lg p-4 bg-white shadow hover:shadow-lg transition flex flex-col items-center">
              <img
                src={product.image_url || "/default-product.png"}
                alt={product.name}
                className="w-24 h-24 object-cover rounded mb-3 border"
              />
              <div className="font-bold text-lg mb-1 text-center">{product.name}</div>
              <div className="text-gray-700 mb-2 text-center">{product.description}</div>
              <div className="text-primary font-semibold mb-2">${product.price}</div>
              <button
                className="mt-auto px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
                onClick={() => {
                  if (!user) {
                    navigate("/auth");
                  } else {
                    // TODO: Implement shopping/buy logic
                    alert("Proceed to buy product: " + product.name);
                  }
                }}
              >
                Buy
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">No products or services found for this startup.</div>
        )}
      </div>
    </div>
  );
} 
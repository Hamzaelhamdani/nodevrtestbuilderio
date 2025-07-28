import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { startupService } from "../../services/startupService";
import { StartupWithProducts } from "../../types/database";

export function AllStartupsPage() {
  const [startups, setStartups] = useState<StartupWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    startupService.getStartups().then((data) => {
      setStartups(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center">Loading startups...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">All Registered Startups</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {startups.map((startup) => (
          <div
            key={startup.id}
            className="rounded-2xl shadow-xl bg-white/80 dark:bg-white/10 backdrop-blur-md border border-primary/20 flex flex-col items-center p-8 transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:bg-primary/10"
            style={{ minHeight: 320 }}
          >
            <img
              src={startup.logo_url || "/default-logo.png"}
              alt={startup.name}
              className="w-20 h-20 object-cover rounded-full mb-4 border-2 border-primary bg-white shadow"
            />
            <div className="font-bold text-xl mb-1 text-center text-primary-foreground opacity-90">
              {startup.name}
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-200 mb-1 opacity-80">
              {startup.location || startup.country}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 opacity-80">
              Products: <span className="font-semibold text-primary">{startup.products ? startup.products.length : 0}</span>
            </div>
            <button
              className="mt-auto px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow hover:bg-green-600 transition"
              onClick={() => navigate(`/startups/${startup.id}`)}
              style={{ opacity: 0.95 }}
            >
              View Products
            </button>
          </div>
        ))}
      </div>
      {startups.length === 0 && <div className="text-center text-gray-500 mt-8">No startups found.</div>}
    </div>
  );
} 
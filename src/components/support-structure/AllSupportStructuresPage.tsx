import { useEffect, useState } from "react";
import { structureService } from "../../services/structureService";

export function AllSupportStructuresPage() {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    structureService.getStructures().then((data) => {
      setStructures(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-center">Loading support structures...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Registered Support Structures</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {structures.map((structure) => (
          <div key={structure.id} className="border rounded-lg p-4 bg-white shadow hover:shadow-lg transition">
            <div className="font-bold text-lg mb-2">{structure.name}</div>
            <div className="text-sm text-gray-600 mb-2">{structure.structure_type} &bull; {structure.location}</div>
            <div className="text-gray-800 mb-2">{structure.description}</div>
            <a href={structure.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">{structure.website}</a>
          </div>
        ))}
      </div>
      {structures.length === 0 && <div className="text-center text-gray-500 mt-8">No support structures found.</div>}
    </div>
  );
} 
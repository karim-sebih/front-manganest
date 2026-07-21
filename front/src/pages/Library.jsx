import { useEffect, useState } from "react";
import { getUserLibrary } from "../api/library.js";
import { useNavigate } from "react-router";


export default function Library() {
    const [library, setLibrary] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchLibrary() {
            try {
                const data = await getUserLibrary();
                setLibrary(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchLibrary();
    }, []);

    if (loading) {
        return <div className="text-white p-10">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#0F172A] text-white p-10">
            <h1 className="text-3xl font-bold mb-6">📚 Ma Library</h1>

            {library.length === 0 ? (
                <p className="text-gray-400">Aucun manga ajouté</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {library.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => navigate(`/manga/${item.mangadex_id}`)}
                            className="bg-[#1E293B] rounded-xl p-3 hover:bg-[#334155] transition cursor-pointer hover:scale-105"

                        >
                            <img
                                src={item.cover}
                                alt={item.title}
                                className="w-full h-48 object-cover rounded-lg mb-2"
                            />

                            <h2 className="text-sm font-semibold line-clamp-2">
                                {item.title}
                            </h2>

                            <p className="text-xs text-blue-400 mt-1">
                                {item.status}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

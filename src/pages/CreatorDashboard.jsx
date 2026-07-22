import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getSelfMangaById, GetUsersSelfManga, deleteSelfManga, updateSelfManga } from "../api/selfmanga.js";
import { GetChaptersByManga } from "../api/chapter.js";


export default function CreatorDashboard() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    const [mangas, setMangas] = useState([]);
    const [selectedManga, setSelectedManga] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editData, setEditData] = useState({
        title: "",
        description: ""
    });

    useEffect(() => {
        async function fetchMangas() {
            try {
                setLoading(true);

                const data = await GetUsersSelfManga();
                setMangas(data || []);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchMangas();
    }, []);


    const handleSelectManga = async (manga) => {
        try {
            setSelectedManga(manga);

            const data = await GetChaptersByManga(manga.id);
            setChapters(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    const handleDelete = async (id) => {
        try {
            await deleteSelfManga(id);

            setMangas(prev => prev.filter(m => m.id !== id));

            if (selectedManga?.id === id) {
                setSelectedManga(null);
                setChapters([]);
            }

        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (manga) => {
        setEditData({
            title: manga.title,
            description: manga.description
        });
        setSelectedManga(manga);
        setIsEditOpen(true);
    };
    const handleUpdate = async () => {
        try {
            await updateSelfManga(selectedManga.id, editData);

            // refresh UI
            setMangas(prev =>
                prev.map(m =>
                    m.id === selectedManga.id
                        ? { ...m, ...editData }
                        : m
                )
            );

            setIsEditOpen(false);
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div className="min-h-screen bg-[#0F172A] text-white p-10">

            <h1 className="text-3xl font-bold mb-10 text-center">
                Dashboard Creator {username}
            </h1>

            <div className="flex gap-10">

                {/* COLONNE GAUCHE / MANGAS */}
                <div className="w-1/2 bg-[#1E293B] p-6 rounded-2xl">

                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">
                            Liste des mangas
                        </h2>

                        <button
                            onClick={() => navigate("/creator/create")}
                            className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-lg"
                        >
                            ➕
                        </button>
                    </div>

                    {mangas.length === 0 ? (
                        <p className="text-gray-400">
                            Aucun manga créé
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {mangas.map((manga) => (
                                <div
                                    key={manga.id}
                                    className={`p-4 rounded-xl transition ${selectedManga?.id === manga.id
                                        ? "bg-blue-600"
                                        : "bg-[#0F172A]"
                                        }`}
                                >
                                    <div
                                        onClick={() => handleSelectManga(manga)}
                                        className="cursor-pointer flex gap-3 items-center"
                                    >
                                        <img
                                            src={`https://back-manganest.onrender.com

${manga.cover}`}
                                            alt={manga.title}
                                            className="w-12 h-16 object-cover rounded"
                                        />

                                        <div>
                                            <p className="font-semibold">{manga.title}</p>
                                            <p className="text-xs text-gray-400">{manga.status}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => handleEdit(manga)}
                                            className="text-xs bg-yellow-500 px-2 py-1 rounded"
                                        >
                                            ✏️
                                        </button>

                                        <button
                                            onClick={() => handleDelete(manga.id)}
                                            className="text-xs bg-red-600 px-2 py-1 rounded"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}
                </div>

                {/*  COLONNE DROITE CHAPITRES */}
                <div className="w-1/2 bg-[#1E293B] p-6 rounded-2xl">

                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">
                            Liste des chapitres
                        </h2>

                        {selectedManga && selectedManga.status === "approved" && (
                            <button
                                onClick={() =>
                                    navigate(`/creator/${selectedManga.id}/create-chapter`)
                                }
                                className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded-lg"
                            >
                                ➕
                            </button>
                        )}
                        {selectedManga && selectedManga.status !== "approved" && (
                            <p className="text-sm text-yellow-400">
                                Ton manga doit être approuvé pour ajouter des chapitres
                            </p>
                        )}


                    </div>

                    {!selectedManga ? (
                        <p className="text-gray-400">
                            Sélectionne un manga
                        </p>
                    ) : chapters.length === 0 ? (
                        <p className="text-gray-400">
                            Aucun chapitre
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {chapters.map((chapter) => (
                                <div
                                    key={chapter.id}
                                    onClick={() => navigate(`/reader/${chapter.id}`, {
                                        state: {
                                            mangaId: selectedManga.id,
                                            chapters,
                                        }
                                    })}
                                    className="p-4 bg-[#0F172A] rounded-xl cursor-pointer hover:bg-[#334155]"
                                >
                                    <p className="font-semibold">
                                        Chapitre {chapter.chapter}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        {chapter.title}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
            {isEditOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-[#1E293B] p-6 rounded-xl w-96">

                        <h2 className="text-lg font-bold mb-4">
                            Modifier le manga
                        </h2>

                        <input
                            type="text"
                            value={editData.title}
                            onChange={(e) =>
                                setEditData({ ...editData, title: e.target.value })
                            }
                            className="w-full mb-3 p-2 rounded bg-[#0F172A]"
                            placeholder="Titre"
                        />

                        <textarea
                            value={editData.description}
                            onChange={(e) =>
                                setEditData({ ...editData, description: e.target.value })
                            }
                            className="w-full mb-4 p-2 rounded bg-[#0F172A]"
                            placeholder="Description"
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsEditOpen(false)}
                                className="px-3 py-1 bg-gray-500 rounded"
                            >
                                Annuler
                            </button>

                            <button
                                onClick={handleUpdate}
                                className="px-3 py-1 bg-green-600 rounded"
                            >
                                Sauvegarder
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

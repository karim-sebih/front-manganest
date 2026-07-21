import { useEffect, useState } from "react";
import { GetPendingManga, GetApprovedManga, ApproveManga, RejectManga, DeleteManga } from "../../api/adminmanga.js";
import { GetChaptersByManga } from "../../api/chapter.js";
import { GetPagesByChapter } from "../../api/page.js";
import { useNavigate } from "react-router";

export default function AdminManga() {
    const [mangas, setMangas] = useState([]);
    const [filter, setFilter] = useState("pending");
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [previewModal, setPreviewModal] = useState(false);
    const [previewPages, setPreviewPages] = useState([]);
    const [previewMangaId, setPreviewMangaId] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchMangas();
    }, [filter]);

    async function fetchMangas() {
        try {
            let data = [];

            if (filter === "pending") {
                data = await GetPendingManga();
            } else if (filter === "approved") {
                data = await GetApprovedManga();
            }

            setMangas(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function handleApprove(id) {
        await ApproveManga(id);
        fetchMangas();
    }

    async function handleReject(id) {
        await RejectManga(id);
        fetchMangas();
    }

    async function handleDelete(id) {
        await DeleteManga(id);
        fetchMangas();
    }

    function openDeleteModal(id) {
        setSelectedId(id);
        setShowModal(true);
    }

    async function confirmDelete() {
        await DeleteManga(selectedId);
        setShowModal(false);
        setSelectedId(null);
        fetchMangas();
    }

    async function openPreview(mangaId) {
        try {
            const chapters = await GetChaptersByManga(mangaId);

            if (!chapters || chapters.length === 0) {
                alert("Aucun chapitre");
                return;
            }

            const firstChapter = chapters[0];

            const pages = await GetPagesByChapter(firstChapter.id);

            setPreviewPages(pages);
            setPreviewMangaId(mangaId);
            setPreviewModal(true);

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6"> Gestion des mangas</h1>

            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setFilter("pending")}
                    className={`px-4 py-2 rounded ${filter === "pending" ? "bg-yellow-500 text-white" : "bg-gray-200"
                        }`}
                >
                    Pending
                </button>

                <button
                    onClick={() => setFilter("approved")}
                    className={`px-4 py-2 rounded ${filter === "approved" ? "bg-green-500 text-white" : "bg-gray-200"
                        }`}
                >
                    Approved
                </button>
            </div>

            <div className="space-y-4">
                {mangas.map((manga) => (
                    <div
                        key={manga.id}
                        className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={`${API_URL}${manga.cover}`}
                                alt=""
                                className="w-14 h-20 object-cover rounded"
                            />

                            <div>
                                <p className="font-bold">{manga.title}</p>
                                <p className="text-sm text-gray-500">
                                    Status: {manga.status}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {filter === "pending" && (
                                <>
                                    <button
                                        onClick={() => openPreview(manga.id)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                    >
                                        👁️
                                    </button>

                                    <button
                                        onClick={() => handleApprove(manga.id)}
                                        className="bg-green-500 text-white px-3 py-1 rounded"
                                    >
                                        ✅
                                    </button>

                                    <button
                                        onClick={() => handleReject(manga.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        ❌
                                    </button>
                                </>
                            )}

                            <button
                                onClick={() => openDeleteModal(manga.id)}
                                className="bg-gray-800 text-white px-3 py-1 rounded"
                            >
                                🗑
                            </button>

                        </div>
                    </div>
                ))}

                {mangas.length === 0 && (
                    <p className="text-gray-500">Aucun manga</p>
                )}
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-80">
                        <h2 className="text-lg font-bold mb-4">
                            Confirmer la suppression
                        </h2>

                        <p className="text-gray-600 mb-6">
                            Tu es sûr de vouloir supprimer ce manga ?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded"
                            >
                                Annuler
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>

                </div>
            )}
            {previewModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white w-[90%] max-w-3xl h-[90%] rounded-xl overflow-hidden flex flex-col">

                        {/* HEADER */}
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="font-bold text-lg">Preview chapitre</h2>

                            <button
                                onClick={() => setPreviewModal(false)}
                                className="text-red-500"
                            >
                                ✖
                            </button>
                        </div>

                        {/* CONTENT (pages scroll) */}
                        <div className="flex-1 overflow-y-auto bg-gray-100 p-4 space-y-4">
                            {previewPages.length === 0 && (
                                <p className="text-center text-gray-500">
                                    Aucune page
                                </p>
                            )}

                            {previewPages.map((page) => (
                                <img
                                    key={page.id}
                                    src={`${API_URL}${page.image_url}`}
                                    className="w-full max-w-4xl rounded"
                                    loading="lazy"
                                    alt="page"
                                />
                            ))}
                        </div>

                        <div className="p-4 border-t flex justify-end gap-3">


                            <button
                                onClick={async () => {
                                    await handleReject(previewMangaId);
                                    setPreviewModal(false);
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded"
                            >
                                Rejeter
                            </button>

                            <button
                                onClick={async () => {
                                    await handleApprove(previewMangaId);
                                    setPreviewModal(false);
                                }}
                                className="px-4 py-2 bg-green-500 text-white rounded"
                            >
                                Approuver
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

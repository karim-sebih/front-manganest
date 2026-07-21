import { Outlet, useLocation, useNavigate, useParams } from "react-router";
import { useState, useEffect, useMemo } from "react";
import { GetChaptersByManga } from "../api/chapter";

export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    const state = location.state || {};

    const [openSidebar, setOpenSidebar] = useState(false);
    const [chapters, setChapters] = useState(state.chapters || null);
    const [mangaId, setMangaId] = useState(state.mangaId || null);
    const [loading, setLoading] = useState(!state.chapters);

    // bloque scroll quand sidebar ouverte
    useEffect(() => {
        document.body.style.overflow = openSidebar ? "hidden" : "auto";
    }, [openSidebar]);

    //  fetch si besoin
    useEffect(() => {
        if (chapters) return;

        async function fetchData() {
            try {
                setLoading(true);

                if (!mangaId) return;

                const data = await GetChaptersByManga(mangaId);
                setChapters(data);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [mangaId, chapters]);

    //  CALCUL DYNAMIQUE 
    const currentIndex = useMemo(() => {
        if (!chapters) return 0;
        const index = chapters.findIndex((c) => c.id == id);
        return index !== -1 ? index : 0;
    }, [chapters, id]);

    const currentChapter = chapters?.[currentIndex];
    const prevChapter = chapters?.[currentIndex - 1];
    const nextChapter = chapters?.[currentIndex + 1];

    if (loading || !chapters) {
        return (
            <div className="text-white flex items-center justify-center h-screen">
                Chargement...
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white">

            {/*  NAVBAR */}
            <div className="fixed top-0 left-0 right-0 bg-[#0F172A] p-4 flex justify-between items-center z-30">

                <button onClick={() => navigate(`/self/${mangaId}`)
                }>
                    ← Retour
                </button>

                <span>
                    Chapitre {currentChapter?.chapter_number ?? "?"}
                </span>

                <button onClick={() => setOpenSidebar(!openSidebar)}>
                    ☰
                </button>
            </div>

            {/*  OVERLAY */}
            {openSidebar && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setOpenSidebar(false)}
                />
            )}

            {/*  SIDEBAR */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-[#020617] z-50 transform transition-transform duration-300
                ${openSidebar ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="p-4 pt-20">

                    <div className="flex justify-between mb-4">
                        <h2>Chapitres</h2>
                        <button onClick={() => setOpenSidebar(false)}>✕</button>
                    </div>

                    {/*  NAV */}
                    <div className="flex justify-between mb-4">
                        <button
                            disabled={!prevChapter}
                            onClick={() => {
                                navigate(`/reader/${prevChapter.id}`, {
                                    state: { mangaId, chapters }
                                });
                                setOpenSidebar(false);
                            }}
                        >
                            ⬅
                        </button>

                        <button
                            disabled={!nextChapter}
                            onClick={() => {
                                navigate(`/reader/${nextChapter.id}`, {
                                    state: { mangaId, chapters }
                                });
                                setOpenSidebar(false);
                            }}
                        >
                            ➡
                        </button>
                    </div>

                    {/*  LIST */}
                    <div className="overflow-y-auto max-h-[70vh] space-y-2">
                        {chapters.map((chap) => {
                            const isActive = chap.id == id;

                            return (
                                <div
                                    key={chap.id}
                                    onClick={() => {
                                        navigate(`/reader/${chap.id}`, {
                                            state: { mangaId, chapters }
                                        });
                                        setOpenSidebar(false);
                                    }}
                                    className={`p-2 rounded cursor-pointer ${isActive
                                        ? "bg-blue-500"
                                        : "hover:bg-gray-700"
                                        }`}
                                >
                                    Chapitre {chap.chapter_number}
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>

            <div className="pt-16">
                <Outlet context={{ prevChapter, nextChapter, mangaId, chapters }} />

            </div>
        </div>
    );
}

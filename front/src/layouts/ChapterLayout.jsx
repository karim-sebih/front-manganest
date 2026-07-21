import { Outlet, useLocation, useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";

export default function ChapterLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    const state = location.state || {};

    const [openSidebar, setOpenSidebar] = useState(false);
    const [chapters, setChapters] = useState(state.chapters || null);
    const [currentIndex, setCurrentIndex] = useState(
        state.currentIndex ?? null
    );
    const [mangaId, setMangaId] = useState(state.mangaId || null);
    const [loading, setLoading] = useState(!state.chapters);

    //  lock scroll sidebar
    useEffect(() => {
        document.body.style.overflow = openSidebar ? "hidden" : "auto";
    }, [openSidebar]);

    // * FETCH si reload
    useEffect(() => {
        if (chapters && currentIndex !== null) return;

        async function fetchData() {
            try {
                setLoading(true);

                let realMangaId = mangaId;

                //  récupérer mangaId si absent
                if (!realMangaId) {
                    const res = await fetch(`https://api.mangadex.org/chapter/${id}`);
                    const data = await res.json();

                    const mangaRel = data.data.relationships.find(
                        (r) => r.type === "manga"
                    );

                    realMangaId = mangaRel?.id;
                    setMangaId(realMangaId);
                }

                //  récupérer tous les chapitres
                const res = await fetch(
                    `https://api.mangadex.org/manga/${realMangaId}/feed?translatedLanguage[]=en&order[chapter]=desc`
                );
                const data = await res.json();

                const chaps = data.data;

                setChapters(chaps);

                // trouver index actuel
                const foundIndex = chaps.findIndex((c) => c.id === id);
                setCurrentIndex(foundIndex !== -1 ? foundIndex : 0);

            } catch (err) {
                console.error("Erreur fetch chapters:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    useEffect(() => {
        if (location.state) {
            setChapters(location.state.chapters || null);
            setCurrentIndex(location.state.currentIndex ?? null);
            setMangaId(location.state.mangaId || null);
        }
    }, [location.state]);

    //  LOADING SAFE
    if (loading || !chapters || currentIndex === null) {
        return (
            <div className="text-white flex items-center justify-center h-screen">
                Chargement...
            </div>
        );
    }

    const currentChapter = chapters[currentIndex];
    const prevChapter = chapters[currentIndex + 1];
    const nextChapter = chapters[currentIndex - 1];

    return (
        <div className="bg-black min-h-screen text-white">

            {/* NAVBAR */}
            <div className="fixed top-0 left-0 right-0 bg-[#0F172A] p-4 flex justify-between items-center z-30">

                <button onClick={() => navigate(`/manga/${mangaId}`)}>
                    ← Retour
                </button>

                <span>
                    Chapitre {
                        currentChapter?.chapter ??                  // ✅ depuis ton API
                        currentChapter?.attributes?.chapter ??      // ✅ fallback mangadex
                        location.state?.chapterNumber ??            // ✅ fallback navigation
                        "?"

                    }


                </span>

                <button onClick={() => setOpenSidebar(!openSidebar)}>
                    ☰
                </button>
            </div>

            {/* OVERLAY */}
            {openSidebar && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setOpenSidebar(false)}
                />
            )}

            {/* SIDEBAR */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-[#020617] z-50 transform transition-transform duration-300
                ${openSidebar ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="p-4 pt-20">

                    <div className="flex justify-between mb-4">
                        <h2>Chapitres</h2>
                        <button onClick={() => setOpenSidebar(false)}>✕</button>
                    </div>

                    {/* NAV */}
                    <div className="flex justify-between mb-4">
                        <button
                            disabled={!prevChapter}
                            onClick={() => {
                                if (!prevChapter) return;

                                navigate(`/chapter/${prevChapter.id}`, {
                                    state: {
                                        mangaId,
                                        chapters,
                                        currentIndex: currentIndex + 1
                                    }
                                });

                                setOpenSidebar(false);
                            }}
                        >
                            ⬅
                        </button>

                        <button
                            disabled={!nextChapter}
                            onClick={() => {
                                if (!nextChapter) return;

                                navigate(`/chapter/${nextChapter.id}`, {
                                    state: {
                                        mangaId,
                                        chapters,
                                        currentIndex: currentIndex - 1
                                    }
                                });

                                setOpenSidebar(false);
                            }}
                        >
                            ➡
                        </button>
                    </div>

                    {/* LIST */}
                    <div className="overflow-y-auto max-h-[70vh] space-y-2">
                        {chapters.map((chap, i) => (
                            <div
                                key={chap.id}
                                onClick={() => {
                                    navigate(`/chapter/${chap.id}`, {
                                        state: {
                                            mangaId,
                                            chapters,
                                            currentIndex: i
                                        }
                                    });
                                    setOpenSidebar(false);
                                }}
                                className={`p-2 rounded cursor-pointer ${i === currentIndex
                                    ? "bg-blue-500"
                                    : "hover:bg-gray-700"
                                    }`}
                            >
                                Chapitre {chap.attributes?.chapter ?? "?"}
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            <div className="pt-16">
                <Outlet />
            </div>
        </div>
    );
}

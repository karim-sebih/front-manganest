import { useParams, useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { getChapterPages } from "../../api/manga.js";
import { getCommentsByChapter, createComment, deleteComment, updateComment } from "../../api/comments.js";
import { addLike, getLikesByChapter, removeLike } from "../../api/like.js";
import { useTranslation } from "react-i18next";
import { saveProgress, getProgress } from "../../api/progress.js";

export default function Chapter() {
    const { t } = useTranslation();
    const { id } = useParams();
    const username = localStorage.getItem("username");
    const location = useLocation();
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const { mangaId, chapters, currentIndex } = location.state || {};

    const [localChapters, setLocalChapters] = useState(chapters || null);
    const [localIndex, setLocalIndex] = useState(currentIndex ?? null);

    const prevChapter = localChapters?.[localIndex + 1];
    const nextChapter = localChapters?.[localIndex - 1];

    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [likesCount, setLikesCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [savedPage, setSavedPage] = useState(0);
    const [safeMangaId, setSafeMangaId] = useState(mangaId || null);



    useEffect(() => {
        async function fetchPage() {
            try {
                setLoading(true);
                const data = await getChapterPages(id);
                setPages(data.pages);
            } catch (err) {
                console.error(err);
                setError("Impossible de charger la page");
            } finally {
                setLoading(false);
            }
        }

        fetchPage();
    }, [id]);

    const fetchComments = async () => {
        try {
            const data = await getCommentsByChapter(id);
            setComments(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [id]);

    const handleCreate = async () => {
        if (!content.trim()) return;

        await createComment({
            content,
            mangadex_id: mangaId,
            mangadex_chapter_id: id,
        });

        setContent("");
        fetchComments();
    };

    const handleDelete = async (commentId) => {
        await deleteComment(commentId);
        fetchComments();
    };

    const handleUpdate = async (commentId) => {
        await updateComment(commentId, editContent);

        setEditingId(null);
        setEditContent("");
        fetchComments();
    };

    const fetchLikes = async () => {
        try {
            const data = await getLikesByChapter(id);

            setLikesCount(data.length);
            const userLiked = data.some(
                (like) => like.user_id == userId
            );
            setLiked(userLiked);
        } catch (err) {
            console.error(err);
        }
    };


    const handleLike = async () => {
        if (!username) {
            alert("Tu dois être connecté pour liker");
            return;
        }


        try {
            if (liked) {
                await removeLike(id);
                setLikesCount((prev) => prev - 1);
            } else {
                await addLike(id);
                setLikesCount((prev) => prev + 1);
            }

            setLiked(!liked);
        } catch (err) {
            console.error(err);
        }
    };



    useEffect(() => {
        fetchLikes();
    }, [id]);

    //secu
    useEffect(() => {
        if (safeMangaId) return;

        async function fetchChapter() {
            try {
                const res = await fetch(`https://api.mangadex.org/chapter/${id}`);
                const data = await res.json();

                const mangaRel = data.data.relationships.find(r => r.type === "manga");

                if (mangaRel) {
                    setSafeMangaId(mangaRel.id);
                }
            } catch (err) {
                console.error(err);
            }
        }

        fetchChapter();
    }, [id]);
    //pagination
    useEffect(() => {
        if (localChapters && localIndex !== null) return;

        async function fetchChapters() {
            try {
                let realMangaId = mangaId;

                if (!realMangaId) {
                    const res = await fetch(`https://api.mangadex.org/chapter/${id}`);
                    const data = await res.json();

                    const mangaRel = data.data.relationships.find(r => r.type === "manga");
                    realMangaId = mangaRel?.id;
                    setSafeMangaId(realMangaId);
                }

                const res = await fetch(
                    `https://api.mangadex.org/manga/${realMangaId}/feed?translatedLanguage[]=en&order[chapter]=desc`
                );

                const data = await res.json();
                const chaps = data.data;

                setLocalChapters(chaps);

                const index = chaps.findIndex(c => c.id === id);
                setLocalIndex(index !== -1 ? index : 0);

            } catch (err) {
                console.error(err);
            }
        }

        fetchChapters();
    }, [id]);

    // progression

    useEffect(() => {
        const handleScroll = () => {
            const images = document.querySelectorAll("img");

            let current = 0;

            images.forEach((img, index) => {
                const rect = img.getBoundingClientRect();

                if (rect.top <= window.innerHeight / 2) {
                    current = index;
                }
            });

            setCurrentPage(current);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        async function fetchProgress() {
            if (!safeMangaId) return;

            try {
                const data = await getProgress(mangaId);

                if (data && data.mangadex_chapter_id === id) {
                    setSavedPage(data.page);
                }
            } catch (err) {
                console.error(err);
            }
        }

        fetchProgress();
    }, [id, mangaId]);

    // pour save auto

    useEffect(() => {
        if (!mangaId || pages.length === 0) return;

        const timeout = setTimeout(() => {
            saveProgress(safeMangaId, {
                mangadex_chapter_id: id,
                page: currentPage
            });
        }, 1000);

        return () => clearTimeout(timeout);
    }, [currentPage]);


    // auto scroll a la page dernierement lue 
    useEffect(() => {
        if (savedPage === null || pages.length === 0) return;

        const images = document.querySelectorAll("img");

        if (images[savedPage]) {
            images[savedPage].scrollIntoView({
                behavior: "auto",
                block: "start"
            });
        }
    }, [savedPage, pages]);

    // scroll top
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        if (currentIndex !== undefined && currentIndex !== null) {
            setLocalIndex(currentIndex);
        }
    }, [currentIndex]);

    useEffect(() => {
        if (chapters) {
            setLocalChapters(chapters);
        }
    }, [chapters]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
                <p className="text-xl text-gray-400">{t('chapter.loading')}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-red-500">
                {t('chapter.error')}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020617] flex flex-col items-center">


            {pages.map((page, index) => (
                <img
                    key={index}
                    src={page}
                    alt={`Page ${index + 1}`}
                    loading="lazy"
                    className="
        w-full
        max-w-3xl
        mx-auto
        h-auto
        object-contain
        bg-black
    "

                />

            ))}

            <div className="w-full max-w-5xl flex justify-between items-center py-10">
                <button
                    disabled={!prevChapter}
                    onClick={() => {
                        if (!prevChapter) return;

                        navigate(`/chapter/${prevChapter.id}`, {
                            state: {
                                mangaId: safeMangaId,
                                chapters: localChapters,
                                currentIndex: localIndex + 1
                            }
                        });
                    }}
                    className="bg-gray-800 px-6 py-3 rounded-lg disabled:opacity-30"
                >
                    ⬅️ Précédent
                </button>

                <button
                    disabled={!nextChapter}
                    onClick={() => {
                        if (!nextChapter) return;

                        navigate(`/chapter/${nextChapter.id}`, {
                            state: {
                                mangaId: safeMangaId,
                                chapters: localChapters,
                                currentIndex: localIndex - 1
                            }
                        });
                    }}

                    className="bg-gray-800 px-6 py-3 rounded-lg disabled:opacity-30"
                >
                    Suivant ➡️
                </button>
            </div>

            <div className="w-full max-w-5xl flex items-center justify-between py-6 text-white">

                <button
                    onClick={handleLike}
                    className={`
        flex items-center gap-2 px-4 py-2 rounded-full
        transition-all duration-200
        ${liked
                            ? "bg-red-600 shadow-lg shadow-red-900/40 scale-105"
                            : "bg-gray-800 hover:bg-gray-700"
                        }
    `}
                >
                    ❤️ <span className="font-medium">{likesCount}</span>
                </button>


                {!username && (
                    <p className="text-gray-400 text-sm">
                        Connecte-toi pour liker
                    </p>
                )}

            </div>

            <div className="w-full max-w-5xl text-white mb-20">
                <h2 className="text-2xl mb-4">Commentaires</h2>

                {/* CREATE */}
                {!username && (
                    <p className="text-gray-400 mb-4">
                        Connecte-toi pour écrire un commentaire
                    </p>
                )}

                {username && (
                    <div className="flex gap-2 mb-6">
                        <input
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Écrire un commentaire..."
                            className="flex-1 px-4 py-2 rounded bg-gray-800"
                        />
                        <button
                            onClick={handleCreate}
                            className="bg-blue-600 px-4 py-2 rounded"
                        >
                            Envoyer
                        </button>
                    </div>
                )}


                {/* LIST */}
                <div className="flex flex-col gap-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-900 p-4 rounded">
                            <p className="text-sm text-gray-400 mb-1">
                                {comment.User?.username || "User"}
                            </p>

                            {editingId === comment.id ? (
                                <div className="flex gap-2">
                                    <input
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="flex-1 px-2 py-1 bg-gray-800 rounded"
                                    />
                                    <button
                                        onClick={() => handleUpdate(comment.id)}
                                        className="bg-green-600 px-2 rounded"
                                    >
                                        ✓
                                    </button>
                                </div>
                            ) : (
                                <p>{comment.content}</p>
                            )}

                            {comment.User?.username === username && (
                                <div className="flex gap-3 mt-2 text-sm">
                                    <button
                                        onClick={() => {
                                            setEditingId(comment.id);
                                            setEditContent(comment.content);
                                        }}
                                        className="text-yellow-400"
                                    >
                                        Modifier
                                    </button>

                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="text-red-400"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            )}

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

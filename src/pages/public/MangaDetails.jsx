import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getMangaById } from "../../api/manga.js";
import { useTranslation } from "react-i18next";
import { getCommentsByManga, createComment, deleteComment, updateComment } from "../../api/comments.js";
import { getLikesByChapter } from "../../api/like.js";
import { getRatingsByManga, createOrUpdateRating, deleteRating } from "../../api/rating.js";
import { getUserLibrary, addOrUpdateEntry, deleteEntry } from "../../api/library";
import { getProgress } from "../../api/progress.js";

export default function MangaDetails() {
    const { id } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();

    //  STATES
    const [manga, setManga] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [chapters, setChapters] = useState([]);
    const [likes, setLikes] = useState({});
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [rating, setRating] = useState(null);
    const [average, setAverage] = useState(0);
    const [ratingCount, setRatingCount] = useState(0);
    const [libraryEntry, setLibraryEntry] = useState(null);
    const [loadingLibrary, setLoadingLibrary] = useState(true);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [progress, setProgress] = useState(null);



    const username = localStorage.getItem("username");

    //  FETCH MANGA
    useEffect(() => {
        async function fetchManga() {
            try {
                setLoading(true);

                const chapterLanguage =
                    localStorage.getItem("chapterLanguage") || "fr";

                const data = await getMangaById(id, [chapterLanguage]);

                setManga(data.manga);
                setChapters(data.chapters);
            } catch (err) {
                console.error(err);
                setError("Impossible de charger le manga");
            } finally {
                setLoading(false);
            }
        }

        fetchManga();
        window.scrollTo(0, 0);

    }, [id]);

    //  FETCH COMMENTS
    const fetchComments = async () => {
        try {
            const data = await getCommentsByManga(id);
            setComments(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [id]);

    //  ACTIONS COMMENTS
    const handleCreate = async () => {
        if (!content.trim()) return;

        await createComment({
            content,
            mangadex_id: id,
            mangadex_chapter_id: null,
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

    // AFFICHAGE LIKES 
    useEffect(() => {
        async function fetchLikes() {
            try {
                const likesData = {};

                for (const chapter of chapters) {
                    const count = await getLikesByChapter(chapter.id);
                    likesData[chapter.id] = count.length;
                }

                setLikes(likesData);
            } catch (err) {
                console.error(err);
            }
        }

        if (chapters.length > 0) {
            fetchLikes();
        }
    }, [chapters]);

    // RATINGS
    useEffect(() => {
        async function fetchRatings() {
            try {
                const data = await getRatingsByManga(id);

                setRating(data.userRating);
                setAverage(data.average);
                setRatingCount(data.count);
            } catch (err) {
                console.error(err);
            }
        }

        fetchRatings();
    }, [id]);

    const handleRate = async (value) => {
        try {
            await createOrUpdateRating(id, value);

            setRating(value);

            const data = await getRatingsByManga(id);
            setAverage(data.average);
            setRatingCount(data.count);

        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteRating = async () => {
        try {
            await deleteRating(id);
            setRating(null);

            const data = await getRatingsByManga(id);
            setAverage(data.average);
            setRatingCount(data.count);

        } catch (err) {
            console.error(err);
        }
    };

    // PROGRESS

    const lastChapter = chapters?.find(
        (c) => c.id === progress?.mangadex_chapter_id
    );

    const chapterIndex = chapters?.findIndex(
        (c) => c.id === progress?.mangadex_chapter_id
    );

    useEffect(() => {
        async function fetchProgress() {
            try {
                const data = await getProgress(id);
                setProgress(data);
            } catch (err) {
                console.error(err);
            }
        }

        if (username) {
            fetchProgress();
        }
    }, [id, username]);



    // LIBRARY
    useEffect(() => {
        async function fetchLibrary() {
            try {
                const data = await getUserLibrary();

                const entry = data.find(
                    (item) => item.mangadex_id === id
                );
                setLibraryEntry(entry || null);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingLibrary(false);
            }
        }

        fetchLibrary();
    }, [id]);

    async function handleAdd() {
        try {
            await addOrUpdateEntry(id, "READING");

            setLibraryEntry({
                mangadex_id: id,
                status: "READING"
            });

        } catch (err) {
            console.error(err);
        }
    }


    async function handleRemove() {
        try {
            await deleteEntry(id);
            setLibraryEntry(null);
        } catch (err) {
            console.error(err);
        }
    }

    async function handleStatusChange(e) {
        const newStatus = e.target.value;

        try {
            const res = await addOrUpdateEntry(id, newStatus);
            setLibraryEntry({ ...libraryEntry, status: newStatus });
        } catch (err) {
            console.error(err);
        }
    }




    useEffect(() => {
        function handleClickOutside() {
            setOpenDropdown(false);
        }

        if (openDropdown) {
            window.addEventListener("click", handleClickOutside);
        }

        return () => {
            window.removeEventListener("click", handleClickOutside);
        };
    }, [openDropdown]);


    const handleChapterClick = (chapterId, index) => {
        navigate(`/chapter/${chapterId}`, {
            state: {
                mangaId: id,
                chapters,
                currentIndex: index
            }
        });
    };

    //  CONDITIONS (APRÈS LES HOOKS)
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-white">
                {t('mangaDetails.loading')}
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-red-500">
                {t('mangaDetails.error')}
            </div>
        );
    }

    // Visuel
    return (
        <div className="min-h-screen bg-[#0F172A] text-white">
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">


                <div className="flex flex-col md:flex-row gap-8 md:gap-12">


                    <div className="flex flex-col">
                        <img
                            src={manga.cover}
                            alt={manga.title}
                            className="w-64 h-[380px] object-cover rounded-2xl shadow-lg"
                        />

                        {/* BOUTON REPRENDRE */}
                        {progress && chapters.length > 0 && lastChapter && (
                            <button
                                onClick={() =>
                                    navigate(`/chapter/${progress.mangadex_chapter_id}`, {
                                        state: {
                                            mangaId: id,
                                            chapters,
                                            currentIndex: chapterIndex !== -1 ? chapterIndex : 0,
                                            page: progress.page,
                                            chapterNumber: lastChapter?.chapter
                                        }
                                    })
                                }
                                className="mt-4 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-xl font-semibold transition"
                            >
                                ▶ Reprendre chapitre {lastChapter.chapter}
                            </button>
                        )}

                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
                            {manga.title}
                        </h1>
                        <div className="mt-2">
                            <p className="text-yellow-400 font-semibold">
                                ⭐ {average.toFixed(1)} / 10 ({ratingCount} votes)
                            </p>

                            {username && (
                                <div className="flex gap-2 mt-2 flex-wrap py-6 ">
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => handleRate(num)}
                                            className={`px-2 py-1 rounded transition ${rating === num
                                                ? "bg-yellow-500 text-black"
                                                : "bg-gray-700 hover:bg-gray-600"
                                                }`}
                                        >
                                            {num}
                                        </button>
                                    ))}

                                    {rating && (
                                        <button
                                            onClick={handleDeleteRating}
                                            className="ml-2 text-red-400"
                                        >
                                            ❌
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {manga.tags?.map((tag) => (
                                <span
                                    key={tag}
                                    className="
        bg-blue-500/10
        border border-blue-500/20
        text-blue-400
        px-3 py-1
        rounded-full
        text-sm
    "
                                >

                                    {tag}
                                </span>
                            ))}
                        </div>

                        <p className="text-gray-300 leading-relaxed mt-4">
                            {manga.description}
                        </p>

                        <div className="mt-6 space-y-2 text-gray-400 text-sm">
                            <p>
                                <span className="text-white font-semibold">
                                    {t('mangaDetails.author')}
                                </span>{" "}
                                {manga.authors?.join(", ")}
                            </p>

                            <p>
                                <span className="text-white font-semibold">
                                    {t('mangaDetails.artist')}
                                </span>{" "}
                                {manga.artists?.join(", ")}
                            </p>

                            <p>
                                <span className="text-white font-semibold">
                                    {t('mangaDetails.status')}
                                </span>{" "}
                                {manga.status}
                            </p>
                        </div>
                        <div className="relative mt-4">

                            {loadingLibrary ? (
                                <p className="text-gray-400">Loading...</p>
                            ) : libraryEntry ? (
                                <>
                                    {/* BOUTON */}

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenDropdown(!openDropdown);
                                        }}

                                        className="bg-[#1E293B] hover:bg-[#334155] px-4 py-2 rounded-lg flex items-center gap-2"
                                    >
                                        📚 {libraryEntry.status}
                                        <span>›</span>
                                    </button>

                                    {/* DROPDOWN */}
                                    {openDropdown && (
                                        <div
                                            onClick={(e) => e.stopPropagation()}
                                            className="absolute mt-2 w-56 bg-[#1E293B] border border-gray-700 rounded-xl shadow-lg z-50"
                                        >


                                            <p className="px-4 py-2 text-xs text-gray-400">
                                                MOVE TO
                                            </p>

                                            {[
                                                { label: "Reading", value: "READING" },
                                                { label: "Completed", value: "COMPLETED" },
                                                { label: "Plan to Read", value: "PLAN_TO_READ" },
                                                { label: "Dropped", value: "DROPPED" },
                                            ].map((item) => (
                                                <div
                                                    key={item.value}
                                                    onClick={() => {
                                                        handleStatusChange({ target: { value: item.value } });
                                                        setOpenDropdown(false);
                                                    }}
                                                    className={`px-4 py-2 cursor-pointer hover:bg-[#334155] flex justify-between ${libraryEntry.status === item.value ? "text-blue-400" : ""
                                                        }`}
                                                >
                                                    {item.label}
                                                    {libraryEntry.status === item.value && "✓"}
                                                </div>
                                            ))}

                                            <div className="border-t border-gray-700 my-2"></div>

                                            <div
                                                onClick={() => {
                                                    handleRemove();
                                                    setOpenDropdown(false);
                                                }}
                                                className="px-4 py-2 text-red-400 cursor-pointer hover:bg-[#334155]"
                                            >
                                                ✖ Remove
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <button
                                    onClick={handleAdd}
                                    className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg"
                                >
                                    ➕ Ajouter à ma liste
                                </button>
                            )}

                        </div>
                    </div>




                </div>

                {/*  CHAPTERS */}
                <div className="mt-14">
                    <h2 className="text-3xl font-bold mb-6">
                        {t('mangaDetails.chaptersSection')}
                    </h2>

                    <div className="space-y-3">
                        {chapters.map((chapter, index) => (
                            <div
                                key={chapter.id}
                                onClick={() => handleChapterClick(chapter.id, index)}
                                className="bg-[#1E293B] p-5 rounded-xl cursor-pointer hover:bg-[#334155] flex justify-between items-center"
                            >
                                <div>
                                    <p className="text-lg font-semibold">
                                        {t('mangaDetails.chapterPrefix')} {chapter.chapter}
                                    </p>

                                    <p className="text-gray-400">
                                        {chapter.title}
                                    </p>
                                </div>

                                <div className="text-blue-400 font-semibold">
                                    ❤️ {likes[chapter.id] || 0}
                                </div>
                            </div>


                        ))}
                    </div>
                </div>

                {/* 💬 COMMENTS */}
                <div className="mt-16 max-w-5xl">
                    <h2 className="text-2xl mb-4">Commentaires</h2>

                    {username ? (
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
                    ) : (
                        <p className="text-gray-400 mb-4">
                            Connecte-toi pour écrire un commentaire
                        </p>
                    )}

                    <div className="flex flex-col gap-4">
                        {comments.map((comment) => (
                            <div key={comment.id} className="bg-gray-900 p-4 rounded">

                                <p className="text-sm text-gray-400 mb-1">
                                    {comment.User?.username || "Utilisateur inconnu"}
                                </p>

                                {editingId === comment.id ? (
                                    <div className="flex gap-2">
                                        <input
                                            autoFocus
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
        </div>
    );
}

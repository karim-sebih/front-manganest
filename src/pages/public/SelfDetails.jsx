import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getSelfMangaById } from "../../api/selfmanga.js";
import { getProgress } from "../../api/progress.js";

export default function SelfDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [manga, setManga] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL;
    const sortedChapters = [...chapters].sort(
        (a, b) => b.chapter_number - a.chapter_number
    );

    // ✅ FETCH MANGA
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);

                const data = await getSelfMangaById(id);
                console.log(data);

                setManga(data.manga);
                setChapters(data.chapters);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    // ✅ FETCH PROGRESS
    useEffect(() => {
        async function fetchProgress() {
            try {
                const data = await getProgress(id);
                setProgress(data);
            } catch (err) {
                console.error(err);
            }
        }

        fetchProgress();
    }, [id]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    if (!manga) {
        return <p className="text-white">Manga introuvable</p>;
    }

    const lastChapter = chapters.find(
        (c) => c.id === progress?.mangadex_chapter_id
    );

    const chapterIndex = chapters.findIndex(
        (c) => c.id === progress?.mangadex_chapter_id
    );

    return (
        <div className="min-h-screen bg-[#0F172A] text-white p-6">

            {/* ✅ HEADER */}
            <div className="flex gap-8">

                <img
                    src={`${API_URL}${manga.cover}`}
                    alt={manga.title}
                    className="w-60 h-[350px] object-cover rounded-xl"
                />

                <div>
                    <h1 className="text-3xl font-bold mb-4">
                        {manga.title}
                    </h1>

                    <p className="text-gray-300 max-w-xl">
                        {manga.description}
                    </p>

                    {/*  REPRENDRE */}
                    {/* {progress && lastChapter && (
                        <button
                            onClick={() =>
                                navigate(`/reader/${progress.mangadex_chapter_id}`, {
                                    state: { mangaId: id, chapters }
                                })
                            }
                            className="mt-4 bg-green-600 px-4 py-2 rounded-lg"
                        >
                            ▶ Reprendre chapitre {lastChapter.chapter_number}
                        </button>
                    )} */}
                </div>
            </div>

            {/*  CHAPTERS */}
            <div className="mt-12">
                <h2 className="text-2xl mb-4">Chapitres</h2>

                <div className="space-y-3">
                    {sortedChapters.map((chapter) => (
                        <div
                            key={chapter.id}
                            onClick={() =>
                                navigate(`/reader/${chapter.id}`, {
                                    state: { mangaId: id, chapters }
                                })
                            }
                            className="bg-[#1E293B] p-4 rounded-lg cursor-pointer hover:bg-[#334155]"
                        >
                            <p className="font-semibold">
                                Chapitre {chapter.chapter_number}
                            </p>
                            <p className="text-gray-400 text-sm">
                                {chapter.title}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

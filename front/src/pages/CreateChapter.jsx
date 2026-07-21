import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { CreateChapter } from "../api/chapter";
import { CreatePages } from "../api/page";

export default function CreatorChapter() {
    const navigate = useNavigate();
    const { mangaId } = useParams(); // ✅ important

    const [chapterTitle, setChapterTitle] = useState("");
    const [chapterNumber, setChapterNumber] = useState("");
    const [pages, setPages] = useState([]);

    const [loading, setLoading] = useState(false);

    // ✅ handle files
    function handleFiles(e) {
        setPages(Array.from(e.target.files));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setLoading(true);

            //  create chapter
            const chapter = await CreateChapter({
                manga_id: mangaId,
                chapter_number: Number(chapterNumber),
                title: chapterTitle,
            });

            //  upload pages
            if (pages.length > 0) {
                const formData = new FormData();

                pages.forEach((file) => {
                    formData.append("pages", file); // ✅ FIX
                });

                await CreatePages(chapter.id, formData);
            }

            navigate("/creator/dashboard");

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-black text-white flex justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="bg-[#020617] p-6 rounded w-full max-w-md space-y-4"
            >
                <h1 className="text-xl font-bold">Créer un chapitre</h1>

                {/*  TITLE */}
                <input
                    type="text"
                    placeholder="Titre du chapitre"
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                    className="w-full p-2 rounded bg-gray-800"
                    required
                />

                {/*  NUMBER */}
                <input
                    type="number"
                    placeholder="Numéro du chapitre"
                    value={chapterNumber}
                    onChange={(e) => setChapterNumber(e.target.value)}
                    className="w-full p-2 rounded bg-gray-800"
                    required
                />

                {/*  FILES */}
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFiles}
                    className="w-full"
                    required
                />

                {/*  SUBMIT */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 p-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Création..." : "Créer"}
                </button>
            </form>
        </div>
    );
}

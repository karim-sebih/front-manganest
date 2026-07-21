import { useState } from "react";
import { useNavigate } from "react-router";
import { createSelfManga } from "../api/selfmanga";
import { CreateChapter } from "../api/chapter";
import { CreatePages } from "../api/page";

export default function CreatorManga() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [chapterTitle, setChapterTitle] = useState("");

    const [cover, setCover] = useState(null);
    const [pages, setPages] = useState([]);

    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);

            if (cover) {
                formData.append("cover", cover);
            }

            const manga = await createSelfManga(formData);

            const chapter = await CreateChapter({
                manga_id: manga.id,
                chapter_number: 1,
                title: chapterTitle,
            });

            if (pages.length > 0) {
                const formData = new FormData();

                pages.forEach((file) => {
                    formData.append("pages", file);
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
        <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="bg-[#1E293B] p-8 rounded-2xl w-full max-w-xl space-y-6"
            >
                <h1 className="text-2xl font-bold">Créer un manga</h1>

                {/* TITLE */}
                <input
                    type="text"
                    placeholder="Titre"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 rounded bg-gray-800"
                    required
                />

                {/* DESCRIPTION */}
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 rounded bg-gray-800"
                    required
                />

                {/* COVER */}
                <div>
                    <p className="mb-1">Cover</p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCover(e.target.files[0])}
                    />
                </div>

                {/* CHAPTER */}
                <div className="border-t border-gray-700 pt-4">
                    <h2 className="text-lg font-semibold mb-2">
                        Premier chapitre
                    </h2>

                    <input
                        type="text"
                        placeholder="Titre du chapitre"
                        value={chapterTitle}
                        onChange={(e) => setChapterTitle(e.target.value)}
                        className="w-full p-3 rounded bg-gray-800"
                    />
                </div>

                {/* PAGES */}
                <div>
                    <p className="mb-1">Pages du chapitre</p>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setPages([...e.target.files])}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl"
                >
                    {loading ? "Création..." : "Créer"}
                </button>
            </form>
        </div>
    );
}

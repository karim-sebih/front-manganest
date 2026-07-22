import { useEffect, useState } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router";
import { GetChapterById } from "../../api/chapter.js";
import ReaderPagination from "../../components/ReaderPagination.jsx";

export default function Reader() {
    const { id } = useParams();
    const navigate = useNavigate();
    const context = useOutletContext() || {};

    const { prevChapter, nextChapter } = context;



    const [chapter, setChapter] = useState(null);
    const [loading, setLoading] = useState(true);

    const pages = chapter?.Pages || [];

    useEffect(() => {
        async function fetchChapter() {
            try {
                setLoading(true);
                const data = await GetChapterById(id);
                setChapter(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchChapter();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    if (!chapter) {
        return <p className="text-white">Chapitre introuvable</p>;
    }

    return (
        <div className="flex flex-col items-center bg-black min-h-screen">

            <h1 className="text-white text-lg my-6">
                Chapitre {chapter.chapter_number} - {chapter.title}
            </h1>

            {/* ✅ SCROLL */}
            <div className="flex flex-col items-center gap-4">
                {pages.map((page) => (
                    <img
                        key={page.id}
                        src={`https://back-manganest.onrender.com${page.image_url}`}
                        className="w-full max-w-2xl rounded"
                        loading="lazy"
                        alt="page"
                    />
                ))}
            </div>

            <ReaderPagination
                prevChapter={prevChapter}
                nextChapter={nextChapter}
                navigate={navigate}
            />


        </div>
    );
}

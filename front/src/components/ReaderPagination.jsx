export default function ReaderPagination({
    prevChapter,
    nextChapter,
    navigate
}) {
    return (
        <div className="flex gap-6 my-10">

            <button
                disabled={!prevChapter}
                onClick={() => navigate(`/reader/${prevChapter.id}`)}
                className="px-6 py-3 bg-[#1E293B] rounded disabled:opacity-40"
            >
                ← Précédent
            </button>

            <button
                disabled={!nextChapter}
                onClick={() => navigate(`/reader/${nextChapter.id}`)}
                className="px-6 py-3 bg-[#1E293B] rounded disabled:opacity-40"
            >
                Suivant →
            </button>

        </div>
    );
}

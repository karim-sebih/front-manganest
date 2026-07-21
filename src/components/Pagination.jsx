

export default function Pagination({
    page,
    setPage,
    hasNextPage = true
}) {

    const handlePrev = () => {
        if (page > 1) {
            setPage(page - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleNext = () => {
        if (hasNextPage) {
            setPage(page + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="flex items-center justify-center gap-6 mt-10">

            {/* Bouton Précédent */}
            <button
                onClick={handlePrev}
                disabled={page === 1}
                className="
                    w-12 h-12
                    rounded-full
                    bg-[#1E293B]
                    hover:bg-[#334155]
                    transition-all
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    text-2xl
                    flex items-center justify-center
                "
            >
                ←
            </button>

            {/* ✅ Numéro de page */}
            <span className="text-white font-semibold text-lg min-w-[3rem] text-center">
                {page}
            </span>

            {/* Bouton Suivant */}
            <button
                onClick={handleNext}
                disabled={!hasNextPage}
                className="
                    w-12 h-12
                    rounded-full
                    bg-[#1E293B]
                    hover:bg-[#334155]
                    transition-all
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    text-2xl
                    flex items-center justify-center
                "
            >
                →
            </button>
        </div>
    );
}

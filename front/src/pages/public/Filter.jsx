import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { searchManga, getLatestChapters } from "../../api/manga.js";
import Pagination from "../../components/Pagination.jsx";
import TagsModal from "../../components/TagSelector.jsx";

export default function SearchPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const [latestChapters, setLatestChapters] = useState([]);

    const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);


    const [tags, setTags] = useState(
        JSON.parse(localStorage.getItem("tags")) || { included: [], excluded: [] }
    );


    useEffect(() => {
        localStorage.setItem("tags", JSON.stringify(tags));

    }, [tags]);

    useEffect(() => {
        const handleTagsUpdated = () => {
            const newTags =
                JSON.parse(localStorage.getItem("tags")) || {
                    included: [],
                    excluded: [],
                };

            setPage(1);
            setTags(newTags);
        };

        window.addEventListener("tagsUpdated", handleTagsUpdated);

        return () =>
            window.removeEventListener("tagsUpdated", handleTagsUpdated);
    }, []);

    useEffect(() => {
        async function fetchLatestChapters() {
            try {
                setLoading(true);

                const chapterData = await getLatestChapters(
                    20,
                    (page - 1) * 20,
                    localStorage.getItem("chapterLanguage") || "fr",
                    JSON.parse(localStorage.getItem("contentFilters")) || ["safe", "suggestive"],
                    tags.included,
                    tags.excluded
                );

                setLatestChapters(chapterData.chapters || []);
            } catch (error) {
                console.error("Error fetching latest chapters:", error);
            } finally {
                setLoading(false);
            }
        }

        if (query.trim().length === 0) {
            fetchLatestChapters();
        }
    }, [query, tags, page]);


    useEffect(() => {
        setPage(1);
    }, [query]);

    useEffect(() => {
        if (query.trim().length < 2) {
            return;
        }

        const timeoutId = setTimeout(async () => {
            setLoading(true);
            try {
                const data = await searchManga(
                    query,
                    20,
                    (page - 1) * 20,
                    tags.included,
                    tags.excluded
                );

                // Formatage des résultats pour inclure les tags
                const formattedResults = data.mangas.map(manga => ({
                    ...manga,
                    tags: manga.attributes?.tags?.map(tag => tag.attributes.name.en) || []
                }));

                setResults(formattedResults);
                setTotalResults(data.count || 0);
            } catch (error) {
                console.error("Search error:", error);
                setResults([]);
                setTotalResults(0);
            } finally {
                setLoading(false);
            }
        }, 200);

        return () => clearTimeout(timeoutId);
    }, [query, page, tags]);

    const handleMangaClick = (id) => {
        navigate(`/manga/${id}`);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
    };

    const displayResults = query.trim().length < 2 ? latestChapters : results;
    const isSearching = query.trim().length >= 2;

    if (loading && page === 1 && isSearching) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
                <p className="text-xl text-gray-400">{t('common.loading')}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F172A] text-white pb-12">
            <div className="max-w-7xl mx-auto px-6 pt-8">
                {/* Barre de recherche avec bouton de tags */}
                <div className="mb-8 flex flex-col md:flex-row gap-4 md:items-center">

                    {/* SEARCH BAR */}
                    <form
                        onSubmit={handleSearch}
                        className="flex-1 flex items-center gap-2 bg-[#1E293B] border border-gray-700 rounded-xl px-3 py-2 focus-within:border-blue-500 transition-all"
                    >
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t('search.placeholder')}
                            className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none px-2"
                        />

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 active:scale-95 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        >
                            {t('search.search')}
                        </button>
                    </form>

                    {/* TAG BUTTON */}
                    <button
                        onClick={() => setIsTagsModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-[#1E293B] border border-gray-700 hover:bg-[#25334b] px-4 py-2.5 rounded-xl transition-all active:scale-95"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-300"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 3a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span className="text-sm text-gray-200 font-medium">
                            Tags
                        </span>
                    </button>
                </div>


                {/* Titre des résultats */}
                {isSearching ? (
                    <h2 className="text-2xl font-bold mb-6">
                        {totalResults > 0 ? t('search.results', { count: totalResults, query }) : t('search.noResults', { query })}
                    </h2>
                ) : (
                    <h2 className="text-2xl font-bold mb-6">
                        {t('search.latestUpdates')}
                    </h2>
                )}

                {/* Résultats */}
                {query.trim().length < 2 && latestChapters.length === 0 && !loading ? (
                    <div className="text-center py-12 text-gray-400">
                        <p>{t('common.loading')}</p>
                    </div>
                ) : displayResults.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {displayResults.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => handleMangaClick(item.id)}
                                    className="bg-[#1E293B] rounded-2xl p-4 hover:bg-[#25334b] transition-all cursor-pointer flex flex-col"
                                >
                                    <div className="mb-4 h-48 flex items-center justify-center bg-gray-800 rounded-xl">
                                        {item.cover ? (
                                            <img
                                                loading="lazy"
                                                src={item.cover}
                                                alt={item.mangaTitle || item.title}
                                                className="w-full h-full object-cover rounded-xl"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerHTML = `
                                                        <div class="flex flex-col items-center justify-center h-full text-center p-4">
                                                            <p class="text-gray-400 text-sm">Pas de cover</p>
                                                            <p class="text-gray-400 text-sm">pour le moment</p>
                                                        </div>
                                                    `;
                                                }}
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                                <p className="text-gray-400 text-sm">Pas de cover</p>
                                                <p className="text-gray-400 text-sm">pour le moment</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-400 transition-colors mb-2">
                                            {item.mangaTitle || item.title}
                                        </h3>

                                        {item.lastChapter && (
                                            <p className="text-blue-400 text-lg font-medium mb-2">
                                                {t('home.chapterPrefix')} {item.lastChapter}
                                            </p>
                                        )}

                                        {item.publishAt && (
                                            <p className="text-gray-400 text-sm mb-3">
                                                {new Date(item.publishAt).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        )}

                                        {/* Affichage des tags */}
                                        {item.tags && item.tags.length > 0 && (
                                            <div className="flex gap-1 flex-wrap mb-3">
                                                {item.tags.slice(0, 3).map((tag, i) => (
                                                    <span
                                                        key={i}
                                                        className="text-[10px] bg-gray-700 px-2 py-0.5 rounded hover:bg-gray-600 transition-colors"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {item.tags.length > 3 && (
                                                    <span className="text-[10px] bg-gray-700 px-2 py-0.5 rounded">
                                                        +{item.tags.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {(isSearching && totalResults > 20) || (!isSearching && latestChapters.length >= 20) ? (
                            <Pagination
                                page={page}
                                setPage={setPage}
                                hasNextPage={
                                    isSearching
                                        ? page * 20 < totalResults
                                        : latestChapters.length === 20
                                }
                                hasPrevPage={page > 1}
                            />

                        ) : null}
                    </>
                ) : (
                    <div className="text-center py-12 text-gray-400">
                        {isSearching ? (
                            <p>{t('search.noResults', { query })}</p>
                        ) : (
                            <p>{t('common.loading')}</p>
                        )}
                    </div>
                )}
            </div>

            {/* Modal des tags */}
            <TagsModal
                isOpen={isTagsModalOpen}
                onClose={() => setIsTagsModalOpen(false)}
            />
        </div>
    );
}

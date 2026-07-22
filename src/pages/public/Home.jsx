import { useEffect, useState } from "react";
import { getAllManga, getLatestChapters } from "../../api/manga.js";
import { useNavigate } from "react-router";
import Pagination from "../../components/Pagination.jsx";
import { useTranslation } from "react-i18next";
import Carousel from "../../components/Carousel.jsx";
import { getAllProgress } from "../../api/progress.js";
import { GetAllSelfManga } from "../../api/selfmanga.js";
import { GetChaptersByManga } from "../../api/chapter.js";
import { getLibraryWithLatest } from "../../api/library";

export default function Home() {
  const { t } = useTranslation();

  const [mangas, setMangas] = useState([]);
  const [latestChapters, setLatestChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [progressList, setProgressList] = useState([]);
  const [approvedMangas, setApprovedMangas] = useState([]);
  const [libraryLatest, setLibraryLatest] = useState([]);

  const LIMIT = 20;

  const BACK_URL = "https://back-manganest.onrender.com";

  // ✅ Robust cover url builder
  const coverToUrl = (cover) => {
    if (!cover) return null;
    if (typeof cover !== "string") return null;

    // URL absolue
    if (cover.startsWith("http")) return cover;

    // Chemin relatif => préfixe ton back
    if (cover.startsWith("/")) return `${BACK_URL}${cover}`;

    // Sinon, on ne fait rien
    return cover;
  };

  const chapterLanguage =
    localStorage.getItem("chapterLanguage") || "fr";

  const contentFilters =
    JSON.parse(localStorage.getItem("contentFilters")) || [
      "safe",
      "suggestive",
    ];

  const tags =
    JSON.parse(localStorage.getItem("tags")) || {
      included: [],
      excluded: [],
    };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          mangaData,
          chapterData,
          progressData,
          selfMangaData,
          libraryData,
        ] = await Promise.all([
          getAllManga(
            LIMIT,
            (page - 1) * LIMIT,
            contentFilters,
            tags.included,
            tags.excluded
          ),
          getLatestChapters(
            LIMIT,
            (page - 1) * LIMIT,
            chapterLanguage,
            contentFilters,
            tags.included,
            tags.excluded
          ),
          getAllProgress().catch(() => []),
          GetAllSelfManga().catch(() => []),
          getLibraryWithLatest().catch(() => []),
        ]);

        // Self published
        const approved = (selfMangaData || [])
          .filter((m) => m.status === "approved")
          .slice(0, 10);

        const mangasWithChapters = await Promise.all(
          approved.map(async (m) => {
            try {
              const chapters = await GetChaptersByManga(m.id);
              const last = chapters?.sort(
                (a, b) => b.chapter_number - a.chapter_number
              )[0];
              return { ...m, lastChapter: last || null };
            } catch {
              return { ...m, lastChapter: null };
            }
          })
        );

        setApprovedMangas(mangasWithChapters);
        setLibraryLatest(libraryData);
        setMangas(mangaData?.mangas || []);
        setLatestChapters(chapterData?.chapters || []);
        setProgressList(progressData);

        // ✅ Debug 1 fois : on vérifie si chapter.cover est bien une URL
        if (chapterData?.chapters?.[0]) {
          console.log("DEBUG latestChapters[0] :", chapterData.chapters[0]);
        }
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handleMangaClick = (id) => {
    navigate(`/manga/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <p className="text-xl text-gray-400">{t("common.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  const fallbackImg = "https://picsum.photos/300/420?random=1";

  return (
    <div className="min-h-screen bg-[#0F172A] text-white pb-12">
      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* Self Published */}
        <Carousel
          title="Self Published"
          items={approvedMangas}
          renderItem={(manga) => (
            <div
              onClick={() => {
                if (manga.lastChapter) {
                  navigate(`/reader/${manga.lastChapter.id}`, {
                    state: { mangaId: manga.id },
                  });
                } else {
                  navigate(`/self/${manga.id}`);
                }
              }}
              className="bg-[#1E293B] rounded-2xl p-4 hover:bg-[#25334b] transition-all cursor-pointer flex gap-4 w-[300px]"
            >
              <img
                src={manga.cover ? coverToUrl(manga.cover) : fallbackImg}
                alt={manga.title}
                loading="lazy"
                className="w-24 h-36 object-cover rounded-xl flex-shrink-0"
                onError={(e) => {
                  e.target.src = fallbackImg;
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="mt-2 text-sm font-semibold line-clamp-2">
                  {manga.title}
                </p>

                {manga.lastChapter && (
                  <p className="text-blue-400 text-sm mt-1">
                    Chapitre {manga.lastChapter.chapter_number}
                  </p>
                )}
              </div>
            </div>
          )}
        />

        {/* Ma bibliothèque */}
        <Carousel
          title="Ma bibliothèque"
          items={libraryLatest}
          renderItem={(manga) => (
            <div
              onClick={() => {
                if (manga.chapterId) {
                  navigate(`/chapter/${manga.chapterId}`, {
                    state: { mangaId: manga.mangadex_id },
                  });
                } else {
                  navigate(`/manga/${manga.mangadex_id}`);
                }
              }}
              className="bg-[#1E293B] rounded-2xl p-4 hover:bg-[#25334b] transition-all cursor-pointer flex gap-4 w-[300px]"
            >
              <img
                src={coverToUrl(manga.cover) || fallbackImg}
                alt={manga.title}
                className="w-24 h-36 object-cover rounded-xl"
                onError={(e) => {
                  e.target.src = fallbackImg;
                }}
              />

              <div className="flex-1 min-w-0">
                <p className="font-semibold line-clamp-2">{manga.title}</p>

                {manga.lastChapter && (
                  <p className="text-blue-400 mt-2 text-sm">
                    Chapitre {manga.lastChapter}
                  </p>
                )}
              </div>
            </div>
          )}
        />

        {/* Continuer la lecture */}
        <Carousel
          title="Continuer la lecture"
          items={progressList}
          renderItem={(item) => (
            <div
              onClick={() =>
                navigate(`/chapter/${item.mangadex_chapter_id}`, {
                  state: {
                    mangaId: item.mangadex_id,
                    chapterNumber: item.chapter,
                  },
                })
              }
              className="bg-[#1E293B] rounded-2xl p-4 hover:bg-[#25334b] transition-all cursor-pointer flex gap-4 w-[300px]"
            >
              <img
                src={coverToUrl(item.cover) || fallbackImg}
                alt="manga.progress"
                className="w-24 h-36 object-cover rounded-xl flex-shrink-0"
                onError={(e) => {
                  e.target.src = fallbackImg;
                }}
              />

              <div className="flex-1 min-w-0">
                <p className="font-semibold line-clamp-2">{item.title}</p>
                <p className="text-blue-400 mt-2 text-sm">
                  Chapitre {item.chapter}
                </p>
                <p className="text-gray-400 text-sm">Page {item.page}</p>
              </div>
            </div>
          )}
        />

        {/* Derniers chapitres */}
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          {t("home.title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestChapters.map((chapter) => {
            const imgUrl = coverToUrl(chapter.cover) || fallbackImg;

            return (
              <div
                key={chapter.id}
                onClick={() => handleMangaClick(chapter.id)}
                className="bg-[#1E293B] rounded-2xl p-6 hover:bg-[#25334b] transition-all cursor-pointer flex gap-5 group"
              >
                <div className="flex-shrink-0">
                  <img
                    src={imgUrl}
                    alt={chapter.mangaTitle}
                    className="w-24 h-36 object-cover rounded-xl flex-shrink-0"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = fallbackImg;
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {chapter.mangaTitle}
                  </h3>

                  <p className="text-blue-400 text-xl font-medium mt-3">
                    {t("home.chapterPrefix")} {chapter.lastChapter}
                  </p>

                  {chapter.publishAt && (
                    <p className="text-gray-400 text-sm mt-2">
                      {new Date(chapter.publishAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Pagination
        page={page}
        setPage={setPage}
        hasNextPage={mangas.length >= LIMIT}
      />
    </div>
  );
}
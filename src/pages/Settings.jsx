import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TagsModal from "../components/TagSelector";
import { DeleteUser } from "../api/user";

export default function Settings() {
    const { t, i18n } = useTranslation();

    const [currentLang, setCurrentLang] = useState(i18n.language || 'fr');
    const [chapterLanguage, setChapterLanguage] = useState(
        localStorage.getItem("chapterLanguage") || "fr"
    );
    const [contentFilters, setContentFilters] = useState(JSON.parse(localStorage.getItem("contentFilters")) || ["safe", "suggestive"]);
    const [tags, setTags] = useState(JSON.parse(localStorage.getItem("tags")) || { included: [], excluded: [] });

    const [showDeleteModal, setShowDeleteModal] = useState(false);


    useEffect(() => {
        const savedLang = localStorage.getItem('i18nextLng') || 'fr';
        i18n.changeLanguage(savedLang);
        setCurrentLang(savedLang);
    }, [i18n]);

    const handleLanguageChange = (newLang) => {
        i18n.changeLanguage(newLang);
        setCurrentLang(newLang);
        localStorage.setItem('i18nextLng', newLang);
    };

    const toggleContentFilter = (filter) => {

        let updatedFilters;

        if (contentFilters.includes(filter)) {

            updatedFilters = contentFilters.filter(
                (f) => f !== filter
            );

        } else {

            updatedFilters = [
                ...contentFilters,
                filter
            ];
        }

        setContentFilters(updatedFilters);

        localStorage.setItem(
            "contentFilters",
            JSON.stringify(updatedFilters)
        );



    };
    useEffect(() => {
        localStorage.setItem("tags", JSON.stringify(tags));
    }, [tags]);


    const [isTagsOpen, setIsTagsOpen] = useState(false);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();

        window.location.href = "/";
    };



    const handleDeleteAccount = async () => {
        try {
            const res = await fetch("http://localhost:3000/users/me", {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Erreur");
            }

            handleLogout();

        } catch (error) {
            console.error(error);
            alert("Erreur suppression compte");
        }
    };


    return (
        <div className="min-h-screen bg-[#0B1220] text-white flex ">



            {/* CONTENT */}
            <main className="flex-1 p-6 md:p-10">
                <div className="max-w-4xl mx-auto space-y-8">

                    <h2 className="text-4xl font-bold tracking-tight">
                        {t('settings.title')}
                    </h2>


                    {/* INTERFACE LANGUAGE */}
                    <section className="border-b border-gray-700 py-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-semibold mb-2">
                                    {t('settings.interfaceLanguage.title')}
                                </h3>
                                <p className="text-gray-400 max-w-xl">
                                    {t('settings.interfaceLanguage.description')}
                                </p>
                            </div>

                            <select
                                value={currentLang}
                                onChange={(e) => handleLanguageChange(e.target.value)}
                                className="bg-[#1E293B] border border-gray-600 rounded-xl px-4 py-3 min-w-[220px]"
                            >
                                <option value="fr">Français</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                    </section>

                    {/* CHAPTER LANGUAGE */}
                    <section className="border-b border-gray-700 py-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-semibold mb-2">
                                    {t('settings.chapterLanguage.title')}
                                </h3>
                                <p className="text-gray-400 max-w-xl">
                                    {t('settings.chapterLanguage.description')}
                                </p>
                            </div>

                            <select
                                value={chapterLanguage}
                                onChange={(e) => {
                                    const lang = e.target.value;

                                    setChapterLanguage(lang);

                                    localStorage.setItem("chapterLanguage", lang);
                                }}
                                className="bg-[#1E293B] border border-gray-600 rounded-xl px-4 py-3 min-w-[220px]"
                            >
                                <option value="fr">Français</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                    </section>

                    {/* CONTENT FILTER */}
                    <section className="border-b border-gray-700 py-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-semibold mb-2">
                                    {t('settings.contentFilter.title')}
                                </h3>
                                <p className="text-gray-400 max-w-xl">
                                    {t('settings.contentFilter.description')}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={contentFilters.includes("safe")}
                                        onChange={() =>
                                            toggleContentFilter("safe")
                                        }
                                    />
                                    {t('settings.contentFilter.safe')}
                                </label>
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={contentFilters.includes("suggestive")}
                                        onChange={() =>
                                            toggleContentFilter("suggestive")
                                        }
                                    />
                                    {t('settings.contentFilter.suggestive')}
                                </label>
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={contentFilters.includes("pornographic")}
                                        onChange={() =>
                                            toggleContentFilter("pornographic")
                                        }
                                    />
                                    {t('settings.contentFilter.nsfw')}
                                </label>
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={contentFilters.includes("erotica")}
                                        onChange={() =>
                                            toggleContentFilter("erotica")
                                        }
                                    />
                                    {t('settings.contentFilter.mature')}
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* TAGS */}
                    <section className="border-b border-gray-700 py-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                            <div>
                                <h3 className="text-2xl font-semibold mb-2">
                                    Tags Manga
                                </h3>
                                <p className="text-gray-400 max-w-xl">
                                    Choisis les tags inclus ou exclus dans tes recommandations.
                                </p>
                            </div>

                            <button
                                onClick={() => setIsTagsOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl"
                            >
                                Manage Tags
                            </button>
                        </div>
                    </section>
                    {/* DANGER ZONE */}
                    <section className="bg-[#0F172A] border border-red-900 rounded-2xl p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-semibold mb-2 text-red-500">
                                    {t('settings.dangerZone.title')}
                                </h3>
                                <p className="text-gray-400 max-w-xl">
                                    {t('settings.dangerZone.description')}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="bg-red-500 hover:bg-red-600 active:scale-95 transition px-5 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-red-500/20"
                                >


                                    {t('settings.dangerZone.deleteAccount')}
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="bg-gray-800 hover:bg-gray-700 active:scale-95 transition px-5 py-2.5 rounded-xl text-sm font-medium w-full"
                                >
                                    {t('settings.dangerZone.logout')}
                                </button>

                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <TagsModal
                isOpen={isTagsOpen}
                onClose={() => setIsTagsOpen(false)}
            />
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">

                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowDeleteModal(false)}
                    />

                    <div className="relative bg-[#0F172A] border border-red-900 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fadeIn">

                        <h3 className="text-xl font-semibold text-red-500 mb-2">
                            Supprimer le compte
                        </h3>

                        <p className="text-gray-400 text-sm mb-6">
                            Cette action est irréversible. Toutes tes données seront définitivement supprimées.
                        </p>

                        <div className="flex justify-end gap-3">

                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl text-sm transition"
                            >
                                Annuler
                            </button>

                            <button
                                onClick={async () => {
                                    await handleDeleteAccount();
                                    setShowDeleteModal(false);
                                }}
                                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-sm font-medium transition shadow-lg shadow-red-500/20"
                            >
                                Supprimer
                            </button>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
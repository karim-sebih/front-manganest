import { useEffect, useState } from "react";

export default function TagsModal({ isOpen, onClose }) {
    const [tags, setTags] = useState({
        included: [],
        excluded: []
    });

    const [availableTags, setAvailableTags] = useState([]);

    useEffect(() => {
        if (!isOpen) return;

        setTags(
            JSON.parse(localStorage.getItem("tags")) || {
                included: [],
                excluded: []
            }
        );

        async function fetchTags() {
            const res = await fetch("https://api.mangadex.org/manga/tag");
            const data = await res.json();
            setAvailableTags(data.data || []);
        }

        fetchTags();
    }, [isOpen]);

    const toggleTag = (type, tagId) => {
        setTags((prev) => {
            const opposite = type === "included" ? "excluded" : "included";

            return {
                ...prev,

                [type]: prev[type].includes(tagId)
                    ? prev[type].filter(t => t !== tagId)
                    : [...prev[type], tagId],

                [opposite]: prev[opposite].filter(t => t !== tagId)
            };
        });
    };
    const save = () => {
        localStorage.setItem("tags", JSON.stringify(tags));

        window.dispatchEvent(new Event("tagsUpdated")); // ✅ trigger update

        onClose();
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">

            <div className="bg-[#1E293B] w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl shadow-xl flex flex-col">

                {/* HEADER */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-lg md:text-xl font-semibold text-white">
                        Manage Tags
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition"
                    >
                        ✕
                    </button>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto p-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* INCLUDED */}
                        <div>
                            <h3 className="text-green-400 mb-3 font-semibold text-sm uppercase tracking-wide">
                                Included
                            </h3>

                            <div className="flex flex-wrap gap-2">
                                {availableTags.map((tag) => (
                                    <button
                                        key={tag.id}
                                        onClick={() => toggleTag("included", tag.id)}
                                        className={`px-3 py-1.5 rounded-full text-xs md:text-sm transition-all border
                                    ${tags.included.includes(tag.id)
                                                ? "bg-green-600 border-green-500 text-white"
                                                : "bg-[#0F172A] border-gray-700 text-gray-300 hover:bg-gray-800"
                                            }`}
                                    >
                                        {tag.attributes?.name?.en}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* EXCLUDED */}
                        <div>
                            <h3 className="text-red-400 mb-3 font-semibold text-sm uppercase tracking-wide">
                                Excluded
                            </h3>

                            <div className="flex flex-wrap gap-2">
                                {availableTags.map((tag) => (
                                    <button
                                        key={tag.id}
                                        onClick={() => toggleTag("excluded", tag.id)}
                                        className={`px-3 py-1.5 rounded-full text-xs md:text-sm transition-all border
                                    ${tags.excluded.includes(tag.id)
                                                ? "bg-red-600 border-red-500 text-white"
                                                : "bg-[#0F172A] border-gray-700 text-gray-300 hover:bg-gray-800"
                                            }`}
                                    >
                                        {tag.attributes?.name?.en}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-3 p-4 border-t border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-sm"
                    >
                        Close
                    </button>

                    <button
                        onClick={save}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-sm font-medium"
                    >
                        Save
                    </button>
                </div>

            </div>
        </div>
    );

}
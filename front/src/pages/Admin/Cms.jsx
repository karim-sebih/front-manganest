import { useState, useEffect } from 'react';
import axios from '../../api/config';

function Cms() {
    const [enTranslations, setEnTranslations] = useState({});
    const [frTranslations, setFrTranslations] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedPage, setSelectedPage] = useState('');
    const [pages, setPages] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchTranslations();
    }, []);

    const fetchTranslations = async () => {
        try {
            setLoading(true);

            const [enRes, frRes] = await Promise.all([
                axios.get('/translations/en'),
                axios.get('/translations/fr')
            ]);

            setEnTranslations(enRes.data);
            setFrTranslations(frRes.data);

            const pageKeys = Object.keys(enRes.data);
            setPages(pageKeys);

            if (pageKeys.length > 0) {
                setSelectedPage(pageKeys[0]);
            }

            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const tryParseJSON = (value) => {
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    };

    const formatValue = (value) => {
        if (typeof value === "object") {
            return JSON.stringify(value, null, 2);
        }
        return value || "";
    };

    const handleChange = (lang, page, key, value) => {
        const parsedValue = tryParseJSON(value);

        if (lang === "en") {
            setEnTranslations(prev => ({
                ...prev,
                [page]: {
                    ...prev[page],
                    [key]: parsedValue
                }
            }));
        } else {
            setFrTranslations(prev => ({
                ...prev,
                [page]: {
                    ...prev[page],
                    [key]: parsedValue
                }
            }));
        }
    };

    const saveTranslations = async () => {
        try {
            setSaving(true);
            setSuccessMessage('');

            await Promise.all([
                axios.put('/translations/en/bulk', { translations: enTranslations }),
                axios.put('/translations/fr/bulk', { translations: frTranslations })
            ]);

            setSuccessMessage('✅ Sauvegardé !');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la sauvegarde");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <section className="container mx-auto px-4 py-8">
                <div className="text-center">Loading translations...</div>
            </section>
        );
    }

    const currentPageData = selectedPage
        ? Object.keys(enTranslations[selectedPage] || {})
        : [];

    return (
        <section className="container mx-auto px-4 py-8">

            {/* HEADER */}
            <div className="bg-background rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold uppercase tracking-[2px]">
                        Translation CMS
                    </h2>

                    <button
                        onClick={saveTranslations}
                        disabled={saving}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        {saving ? 'Saving...' : 'Save All Changes'}
                    </button>
                </div>

                {successMessage && (
                    <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded mb-4">
                        {successMessage}
                    </div>
                )}

                {/* SELECT PAGE */}
                <div className="flex items-center gap-4">
                    <label className="font-semibold">Page:</label>
                    <select
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(e.target.value)}
                        className="px-4 py-2 border rounded-md"
                    >
                        {pages.map(page => (
                            <option key={page} value={page}>
                                {page}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-background rounded-lg shadow-md overflow-hidden">

                <div className="grid grid-cols-[200px_1fr_1fr] gap-4 p-4 font-bold border-b">
                    <div>Key</div>
                    <div>English</div>
                    <div>French</div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto">
                    {currentPageData.length === 0 ? (
                        <div className="text-center p-8">
                            No translations found
                        </div>
                    ) : (
                        currentPageData.map(key => (
                            <div
                                key={key}
                                className="grid grid-cols-[200px_1fr_1fr] gap-4 p-4 border-b"
                            >
                                <div className="flex items-center">
                                    <code className="text-sm">{key}</code>
                                </div>

                                <textarea
                                    value={formatValue(enTranslations[selectedPage]?.[key])}
                                    onChange={(e) =>
                                        handleChange("en", selectedPage, key, e.target.value)
                                    }
                                    className="w-full p-2 border rounded"
                                    rows={3}
                                />

                                <textarea
                                    value={formatValue(frTranslations[selectedPage]?.[key])}
                                    onChange={(e) =>
                                        handleChange("fr", selectedPage, key, e.target.value)
                                    }
                                    className="w-full p-2 border rounded"
                                    rows={3}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* FOOTER */}
            <div className="mt-6 text-center">
                <button
                    onClick={saveTranslations}
                    disabled={saving}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                    {saving ? 'Saving...' : 'Save All Changes'}
                </button>
            </div>

        </section>
    );
}

export default Cms;

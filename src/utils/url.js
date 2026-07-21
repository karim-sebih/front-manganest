export function makeCoverUrl(coverPathOrUrl, apiBaseUrl) {
    if (!coverPathOrUrl) return "";

    // Si c'est déjà une URL complète
    if (coverPathOrUrl.startsWith("http://") || coverPathOrUrl.startsWith("https://")) {
        return coverPathOrUrl;
    }

    // Sinon c'est un chemin genre /covers/xxx.jpg
    const base = apiBaseUrl?.replace(/\/$/, "") || "";
    const path = coverPathOrUrl.startsWith("/") ? coverPathOrUrl : `/${coverPathOrUrl}`;

    return `${base}${path}`;
}
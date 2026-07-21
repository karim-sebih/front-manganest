import instance from "./config.js";

async function searchManga(query, limit = 10, offset = 0) {
  try {
    const response = await instance.get("/api/manga/search", {
      params: { q: query, limit, offset },
    });

    return response.data;
  } catch (error) {
    console.error("Search API Error:", error.response?.data || error.message);
    throw error;
  }
}


async function getAllManga(
  limit,
  offset,
  contentFilters,
  includedTags = [],
  excludedTags = []
) {

  const filters = contentFilters.join(",");

  const included = includedTags.join(",");
  const excluded = excludedTags.join(",");

  const response = await instance.get(
    `/api/manga/all-mangas`,
    {
      params: {
        limit,
        offset,
        filters,
        included,
        excluded
      }
    }
  );

  return response.data;
}

async function getLatestChapters(
  limit,
  offset,
  language,
  contentFilters = [],
  includedTags = [],
  excludedTags = []
) {

  const filters = contentFilters.join(",");

  const included = includedTags.join(",");
  const excluded = excludedTags.join(",");

  const response = await instance.get(
    "/api/manga/latest-chapters",
    {
      params: {
        limit,
        offset,
        language,
        filters,
        included,
        excluded
      }
    }
  );

  return response.data;
}


async function getMangaById(
  id,
  languages = ["fr"]
) {

  const langQuery = languages.join(",");

  const response = await instance.get(
    `/api/manga/${id}?lang=${langQuery}`
  );

  return response.data;
}


async function getChapterPages(id) {
  const response = await instance.get(`/api/manga/chapter/${id}/pages`);
  return response.data;
}

async function getMangaTags() {
  try {
    const response = await fetch("https://api.mangadex.org/manga/tag");
    const data = await response.json();

    return data.data || [];
  } catch (error) {
    console.error("getMangaTags Error:", error);
    return [];
  }
}

export { searchManga, getMangaById, getAllManga, getLatestChapters, getChapterPages, getMangaTags };


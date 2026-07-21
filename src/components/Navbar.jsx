import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { Search, Menu, Sun, Bell, User, Shield } from "lucide-react";
import { searchManga } from "../api/manga";
import ManganestLogo from "../assets/Manganest-removebg-preview.png";
import { getLibraryWithLatest } from "../api/library";
import handleLogout from "../utils/helpers";


export default function Navbar() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const role = localStorage.getItem("role");
  const isAdmin = role === "ADMIN";
  const storedNotifs = JSON.parse(localStorage.getItem("notifications")) || [];
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;





  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(stored);
  }, []);



  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    } /*sa fait en sorte que quand y a plus de 2 char sa affiche le dropdown avec les résultats */

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchManga(query, 8);
        setResults(data.mangas || []);
        setShowDropdown(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query]);

  /* ferme le dropdown quand tu clique en dehors */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (manga) => {
    setQuery("");
    setShowDropdown(false);
    navigate(`/manga/${manga.id}`);
  };


  const handleUserClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth/login");
      return;
    }

    setShowUserMenu(!showUserMenu);
  };

  /*Notif */
  useEffect(() => {
    async function checkNewChapters() {
      try {
        const data = await getLibraryWithLatest();

        const previous = JSON.parse(localStorage.getItem("libraryLatest")) || [];
        const storedNotifs = JSON.parse(localStorage.getItem("notifications")) || [];

        // première visite -> init
        if (previous.length === 0) {
          localStorage.setItem("libraryLatest", JSON.stringify(data));
          return;
        }

        const newNotifs = data.filter((manga) => {
          const old = previous.find(
            (m) => m.mangadex_id === manga.mangadex_id
          );

          if (!old) return false;

          return Number(manga.lastChapter) > Number(old.lastChapter);
        });

        console.log("PREVIOUS:", previous);
        console.log("NEW DATA:", data);
        console.log("NEW NOTIFS:", newNotifs);

        //  merge + anti doublons
        const updatedNotifs = [...storedNotifs, ...newNotifs].filter(
          (item, index, self) =>
            index === self.findIndex((m) => m.chapterId === item.chapterId)
        );

        setNotifications(updatedNotifs);

        //  save
        localStorage.setItem("notifications", JSON.stringify(updatedNotifs));
        localStorage.setItem("libraryLatest", JSON.stringify(data));

      } catch (e) {
        console.error(e);
      }
    }

    checkNewChapters();
    const interval = setInterval(checkNewChapters, 60000);

    return () => clearInterval(interval);
  }, []);


  return (
    <nav className="bg-[#0F172A]/90 backdrop-blur-md text-white sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">

            <Link to="/" className="flex items-center">
              <img src={ManganestLogo} alt="Manganest" className="h-10" />
            </Link>


          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-6 relative" ref={dropdownRef}>

            <div className="relative group">
              <div className="flex items-center h-10 bg-[#1E293B] rounded-xl px-4 border border-gray-700 group-focus-within:border-blue-500 transition">

                <Search size={18} className="text-gray-400" />

                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="flex-1 bg-transparent outline-none px-3 text-sm placeholder-gray-400"
                />

                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    ✕
                  </button>
                )}

                <Link to="search">
                  <div className="ml-2 px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition">
                    Advanced search
                  </div>
                </Link>
              </div>
            </div>


            {showDropdown && (
              <div className="absolute mt-2 w-full bg-[#0F172A] border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">

                {loading ? (
                  <div className="p-5 text-center text-gray-400">Chargement...</div>
                ) : results.length > 0 ? (
                  results.map((manga) => (
                    <div
                      key={manga.id}
                      onClick={() => handleSelect(manga)}
                      className="flex gap-3 p-3 hover:bg-[#1E293B] transition cursor-pointer"
                    >
                      <img
                        src={manga.cover || "/placeholder-cover.jpg"}
                        alt={manga.title}
                        className="w-12 h-16 object-cover rounded-md flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {manga.title}
                        </p>

                        {manga.description && (
                          <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                            {manga.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-5 text-center text-gray-400">
                    Aucun résultat pour <span className="text-white">{query}</span>
                  </div>
                )}
              </div>
            )}
          </div>


          {/* Les Icons */}
          <div className="flex gap-4 text-gray-300">
            <Menu
              className="md:hidden cursor-pointer"
              size={24}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />

            {isAdmin && (
              <Link to="/admin">
                <Shield
                  className="cursor-pointer hover:text-red-400 transition"
                  size={22}
                />
              </Link>
            )}

            <div className="relative">
              <Bell
                className="cursor-pointer hover:text-white"
                size={22}
                onClick={() => setShowNotif(!showNotif)}
              />

              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1.5 rounded-full">
                  {notifications.length}
                </span>
              )}

              {showNotif && (
                <div className="absolute right-0 mt-3 w-80 bg-[#1E293B] border border-gray-700 rounded-xl shadow-xl z-50">

                  {notifications.length === 0 ? (
                    <p className="p-4 text-gray-400 text-sm">
                      Aucune notification
                    </p>
                  ) : (
                    notifications.map((manga) => (
                      <div
                        key={manga.mangadex_id}
                        onClick={() => {
                          navigate(`/chapter/${manga.chapterId}`, {
                            state: { mangaId: manga.mangadex_id }
                          });

                          setNotifications(prev => {
                            const filtered = prev.filter(n => n.chapterId !== manga.chapterId);
                            localStorage.setItem("notifications", JSON.stringify(filtered));
                            return filtered;
                          });

                          setShowNotif(false);
                        }}
                        className="flex gap-3 p-3 hover:bg-[#334155] transition cursor-pointer"
                      >
                        <img
                          src={manga.cover}
                          alt={manga.title}
                          className="w-16 h-24 object-cover rounded-lg"
                        />

                        <div className="flex flex-col justify-center min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {manga.title}
                          </p>

                          <p className="text-blue-400 text-xs mt-1">
                            Chapitre {manga.lastChapter}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>


            <div className="relative">
              <User
                className="cursor-pointer hover:text-white transition"
                size={22}
                onClick={handleUserClick}
              />


              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-[#1E293B] border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-700 text-sm font-semibold">
                    Mon compte
                  </div>

                  <div className="flex flex-col text-sm">
                    {isLoggedIn ? (
                      <>
                        <Link
                          to="/profile/"
                          className="px-4 py-2 hover:bg-[#334155] transition"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Profil
                        </Link>

                        <Link
                          to="/library"
                          className="px-4 py-2 hover:bg-[#334155] transition"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Bibliothèque
                        </Link>

                        <Link
                          to="/settings"
                          className="px-4 py-2 hover:bg-[#334155] transition"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Paramètres
                        </Link>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            handleLogout();
                          }}
                          className="px-4 py-2 text-left hover:bg-red-500/20 transition text-red-400"
                        >
                          Déconnexion
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate("/auth/login");
                        }}
                        className="px-4 py-2 text-left hover:bg-[#334155] transition"
                      >
                        Se connecter
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>



        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-4 animate-fadeIn">

          {/* SEARCH MOBILE */}
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center h-10 bg-[#1E293B] rounded-xl px-4 border border-gray-700">
              <Search size={18} className="text-gray-400" />

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher..."
                className="flex-1 bg-transparent outline-none px-3 text-sm"
              />
            </div>

            {showDropdown && (
              <div className="absolute mt-2 w-full bg-[#0F172A] border border-gray-800 rounded-xl shadow-xl z-50">
                {results.map((manga) => (
                  <div
                    key={manga.id}
                    onClick={() => {
                      handleSelect(manga);
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-3 hover:bg-[#1E293B] cursor-pointer"
                  >
                    {manga.title}
                  </div>
                ))}
              </div>
            )}
          </div>



        </div>
      )}

    </nav>

  );
}

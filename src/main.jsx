import "./utils/i18n";

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Register from './pages/Auth/Register.jsx';
import Login from './pages/Auth/Login.jsx';
import Home from './pages/public/Home.jsx';
import { BrowserRouter, Route, Routes } from "react-router";
import PublicLayout from './layouts/PublicLayout.jsx';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MangaDetails from './pages/public/MangaDetails.jsx'
import SearchPage from './pages/public/Filter.jsx'
import Library from './pages/Library.jsx';
import Settings from './pages/Settings.jsx';
import Profile from './pages/Profile.jsx';
import Chapter from './pages/public/Chapter.jsx';
import ChapterLayout from './layouts/ChapterLayout.jsx'
import AccessDeniedPage from './pages/public/AccessDenied.jsx';
import CreatorDashboard from './pages/CreatorDashboard.jsx';
import CreatorRules from './pages/CreatorRules.jsx';
import CreateManga from './pages/CreateManga.jsx';
import Reader from "./pages/public/Reader.jsx";
import ReaderLayout from "./layouts/ReaderLayout.jsx";
import CreatorChapter from "./pages/CreateChapter.jsx";
import SelfDetails from "./pages/public/SelfDetails.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import { RoleGuard } from "./middleware/RoleGuard.jsx";
import AdminManga from "./pages/Admin/AdminManga.jsx"
import AdminUser from "./pages/Admin/AdminUser.jsx";
import Cms from "./pages/Admin/Cms.jsx";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<PublicLayout />} >
            <Route index element={<Home />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/manga/:id" element={<MangaDetails />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile/" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/library" element={<Library />} />
            <Route path="/access-denied" element={<AccessDeniedPage />} />
            <Route path="/creator/rules" element={<CreatorRules />} />
            <Route path="/creator/dashboard" element={<CreatorDashboard />} />
            <Route path="/creator/:mangaId/create-chapter" element={<CreatorChapter />} />
            <Route path="/self/:id" element={<SelfDetails />} />
            <Route path="/creator/create" element={<CreateManga />} />

          </Route>

          <Route path='/chapter/:id' element={<ChapterLayout />} >
            <Route index element={<Chapter />} />
          </Route>

          <Route path="/reader/:id" element={<ReaderLayout />}>
            <Route index element={<Reader />} />
          </Route>

          <Route
            path="admin"
            element={
              <RoleGuard allowedRoles={["ADMIN"]}>
                <AdminLayout />
              </RoleGuard>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="mangas" element={<AdminManga />} />
            <Route path="users" element={<AdminUser />} />
            <Route path="cms" element={<Cms />} />
          </Route>

        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)

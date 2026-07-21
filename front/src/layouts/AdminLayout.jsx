import { Outlet, Link } from "react-router";

export default function AdminLayout() {
    const username = localStorage.getItem("username");

    return (
        <div className="flex h-screen bg-gray-100">

            {/*  SIDEBAR */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-4 text-xl font-bold border-b border-gray-700">
                    Admin Panel
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin" className="block p-2 rounded hover:bg-gray-700">
                        Dashboard
                    </Link>

                    <Link to="/admin/users" className="block p-2 rounded hover:bg-gray-700">
                        Users
                    </Link>

                    <Link to="/admin/mangas" className="block p-2 rounded hover:bg-gray-700">
                        Mangas
                    </Link>

                    <Link to="/admin/cms" className="block p-2 rounded hover:bg-gray-700">
                        CMS
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <button className="w-full bg-red-500 hover:bg-red-600 p-2 rounded">
                        Logout
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col">

                <header className="h-16 bg-white shadow flex items-center justify-between px-6">
                    <h1 className="text-lg font-semibold">Admin</h1>

                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">👤 {username}</span>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}

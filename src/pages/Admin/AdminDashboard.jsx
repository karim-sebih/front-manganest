import { useEffect, useState } from "react";
import { getAllUsers } from "../../api/adminuser.js";
import { GetPendingManga, GetApprovedManga } from "../../api/adminmanga.js";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        mangas: 0,
        pending: 0,
    });
    useEffect(() => {
        async function fetchStats() {
            try {
                const users = await getAllUsers();

                let pending = [];
                let approved = [];

                try {
                    pending = await GetPendingManga();
                    approved = await GetApprovedManga();
                } catch (err) {
                    console.log("error:", err);
                }

                setStats({
                    users: users?.length || 0,
                    mangas: approved?.length || 0, // ✅ ICI
                    pending: pending?.length || 0,
                });

            } catch (err) {
                console.error(err);
            }
        }

        fetchStats();
    }, []);


    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">📊 Dashboard</h1>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-gray-500">Users</h2>
                    <p className="text-3xl font-bold">{stats.users}</p>
                </div>


                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-gray-500">Self-Published</h2>
                    <p className="text-3xl font-bold">{stats.mangas}</p>
                </div>


                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-gray-500">En attente</h2>
                    <p className="text-3xl font-bold text-yellow-500">
                        {stats.pending}
                    </p>
                </div>
            </div>


        </div>
    );
}

import { useEffect, useState } from "react";
import {
    getAllUsers,
    createUserByAdmin,
    updateUserByAdmin,
    deleteUserByAdmin
} from "../../api/adminuser.js";

export default function AdminUser() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);

    const [form, setForm] = useState({
        username: "",
        email: "",
        role: "VIEWER",
        password: ""
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        const data = await getAllUsers();
        setUsers(data);
    }

    async function handleCreate() {
        await createUserByAdmin(form);
        setShowCreate(false);
        setForm({ username: "", role: "VIEWER", email: "", password: "" });
        fetchUsers();
    }

    async function handleUpdate() {
        await updateUserByAdmin(selectedUser.id, {
            username: form.username,
            role: form.role
        });

        setShowEdit(false);
        setSelectedUser(null);
        fetchUsers();
    }

    async function handleDelete() {
        await deleteUserByAdmin(selectedUser.id);
        setShowDelete(false);
        setSelectedUser(null);
        fetchUsers();
    }

    function openEdit(user) {
        setSelectedUser(user);
        setForm({
            username: user.username,
            email: user.email,
            role: user.role
        });
        setShowEdit(true);
    }

    function openDelete(user) {
        setSelectedUser(user);
        setShowDelete(true);
    }

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="mb-4 flex items-center bg-white border rounded px-3">
                <span className="mr-2">🔍</span>
                <input
                    type="text"
                    placeholder="Rechercher..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-2 outline-none"
                />
            </div>

            {filteredUsers.length === 0 && (
                <p className="text-gray-500">Aucun utilisateur trouvé</p>
            )}

            <h1 className="text-2xl font-bold mb-6">👤 Gestion des users</h1>

            <button
                onClick={() => setShowCreate(true)}
                className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
                + Créer user
            </button>

            <div className="space-y-3">
                {filteredUsers.map(user => (
                    <div key={user.id} className="bg-white p-4 rounded shadow flex justify-between">
                        <div>
                            <p className="font-bold">{user.username}</p>
                            <p className="text-sm text-gray-500">{user.role}</p>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => openEdit(user)} className="bg-yellow-400 px-3 py-1 rounded">
                                ✏️
                            </button>

                            <button onClick={() => openDelete(user)} className="bg-red-500 text-white px-3 py-1 rounded">
                                🗑
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showCreate && (
                <Modal title="Créer utilisateur" onClose={() => setShowCreate(false)}>
                    <Input form={form} setForm={setForm} withPassword />
                    <button onClick={handleCreate} className="btn-green">Créer</button>
                </Modal>
            )}

            {showEdit && (
                <Modal title="Modifier utilisateur" onClose={() => setShowEdit(false)}>
                    <Input form={form} setForm={setForm} />
                    <button onClick={handleUpdate} className="btn-green">Modifier</button>
                </Modal>
            )}

            {showDelete && (
                <Modal title="Confirmer suppression" onClose={() => setShowDelete(false)}>
                    <p>Supprimer {selectedUser?.username} ?</p>

                    <div className="flex justify-end gap-2">
                        <button onClick={() => setShowDelete(false)} className="px-3 py-1 bg-gray-300 rounded">
                            Annuler
                        </button>

                        <button onClick={handleDelete} className="px-3 py-1 bg-red-500 text-white rounded">
                            Supprimer
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
function Input({ form, setForm, withPassword = false }) {
    return (
        <div className="space-y-3">
            <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full border p-2 rounded"
            />
            <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border p-2 rounded"
            />

            <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full border p-2 rounded"
            >
                <option value="VIEWER">viewer</option>
                <option value="ADMIN">admin</option>


            </select>

            {withPassword && (
                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full border p-2 rounded"
                />
            )}
        </div>
    );
}

function Modal({ children, title, onClose }) {
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-80 space-y-4 shadow-xl">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold">{title}</h2>
                    <button onClick={onClose} className="text-red-500">✖</button>
                </div>
                {children}
            </div>
        </div>
    );
}

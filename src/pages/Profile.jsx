import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { getProfile, updateProfile } from "../api/profile.js";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";

const profileSchema = z.object({
    username: z.string().min(1, "Le username est requis"),
    email: z.string().email("Email invalide"),
})


export default function Profile() {
    const navigate = useNavigate();

    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);

    const { data: apiResponse, isLoading, error } = useQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
        staleTime: 5 * 60 * 1000,
    });

    const user = apiResponse?.data?.data;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: user || {},
    });

    useEffect(() => {
        if (user) {
            reset(user);
        }
    }, [user, reset]);

    const updateMutation = useMutation({
        mutationFn: (updatedData) => updateProfile(updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['profile']
            });
            setIsEditing(false);
            console.log('le profile est mis a jour')
        },
        onError: () => {
            console.log('erreur lors de le mis a jour ')
        },
    });

    const onSubmit = (data) => {
        updateMutation.mutate(data);
    };

    if (isLoading) return <div className="text-center py-20 text-gray-400">Chargement...</div>;
    if (error) return <div className="text-center py-20 text-red-500">Erreur : {error.message}</div>;
    if (!user) return <div className="text-center py-20 text-gray-400">Profil non trouvé</div>;




    return (
        <div className="min-h-screen bg-[#0F172A] text-white flex justify-center py-10 px-4">

            <div className="w-full max-w-2xl bg-[#1E293B] rounded-2xl shadow-lg p-8">

                <div className="flex items-center justify-between mb-8">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Mon Profil
                        </h1>

                        <p className="text-gray-400 mt-2">
                            Gère tes informations personnelles
                        </p>
                    </div>

                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-500 hover:bg-blue-600 transition px-5 py-2 rounded-xl font-medium"
                        >
                            Modifier
                        </button>
                    )}
                </div>

                {isEditing ? (

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >

                        <div>
                            <label className="block mb-2 text-sm text-gray-300">
                                Username
                            </label>

                            <input
                                type="text"
                                {...register("username")}
                                className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                            />

                            {errors.username && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2 text-sm text-gray-300">
                                Email
                            </label>

                            <input
                                type="email"
                                {...register("email")}
                                className="w-full bg-[#0F172A] border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                            />

                            {errors.email && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">

                            <button
                                type="submit"
                                disabled={updateMutation.isPending}
                                className="bg-green-500 hover:bg-green-600 transition px-5 py-3 rounded-xl font-medium disabled:opacity-50"
                            >
                                {updateMutation.isPending
                                    ? "Sauvegarde..."
                                    : "Sauvegarder"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    reset(user);
                                }}
                                className="bg-gray-700 hover:bg-gray-600 transition px-5 py-3 rounded-xl font-medium"
                            >
                                Annuler
                            </button>

                        </div>

                    </form>

                ) : (

                    <div className="space-y-6">

                        <div className="bg-[#0F172A] p-5 rounded-xl">
                            <p className="text-gray-400 text-sm mb-1">
                                Username
                            </p>

                            <h2 className="text-xl font-semibold">
                                {user.username}
                            </h2>
                        </div>

                        <div className="bg-[#0F172A] p-5 rounded-xl">
                            <p className="text-gray-400 text-sm mb-1">
                                Email
                            </p>

                            <h2 className="text-xl font-semibold">
                                {user.email}
                            </h2>
                        </div>

                    </div>

                )}

                <button
                    onClick={() => {



                        navigate("/creator/rules");

                    }}
                    className="bg-purple-500 px-5 py-3 my-3 rounded-xl"
                >
                    Devenir créateur
                </button>



            </div>

        </div>
    );
}
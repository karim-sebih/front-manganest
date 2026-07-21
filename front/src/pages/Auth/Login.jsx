import { Link, useNavigate } from "react-router";
import { login } from "../../api/auth.js";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import handleLogout from "../../utils/helpers.js";
import { useTranslation } from "react-i18next";



export default function Login() {
    const { t } = useTranslation();
    const loginSchema = z.object({
        email: z.string().email("Email invalide").optional().or(z.string().email()),
        password: z.string().min(1, "Mot de passe requis"),
    })
    const navigate = useNavigate();

    const { register, handleSubmit } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const loginMutation = useMutation({
        mutationFn: async (data) => {
            return await login(data);
        },
        onSuccess: (response) => {
            localStorage.setItem("token", response.data?.token);
            navigate("/");

        },
        onError: (error) => {
            if (error.code === "ERR_NETWORK") {
                alert("Impossible de contacter le serveur.");
            } else if (error.response?.data?.error) {
                alert(error.response.data.error);
            } else {
                alert("Erreur lors de la connexion");
            }
        },
    });

    const isLoggedIn = !!localStorage.getItem("token");

    if (isLoggedIn) {
        return (
            <>
                <h1>
                    {t('auth.login.alreadyLoggedIn', { username: localStorage.getItem("username") })}
                </h1>
                <button onClick={handleLogout} className="bg-red-500 text-white p-2">
                    {t('auth.login.logout')}
                </button>
            </>
        );
    }

    const onSubmit = (data) => {
        loginMutation.mutate(data);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B1220] px-4">

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md bg-[#0F172A] border border-gray-800 rounded-2xl p-8 shadow-2xl space-y-5"
            >

                <h2 className="text-3xl font-bold text-white text-center">
                    {t('auth.login.title')}
                </h2>

                {/* EMAIL */}
                <input
                    placeholder={t('auth.login.email')}
                    {...register("email")}
                    className="w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    type="text"
                />

                {/* PASSWORD */}
                <input
                    placeholder={t('auth.login.password')}
                    {...register("password")}
                    className="w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    type="password"
                />

                {/* BUTTON */}
                <button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20"
                >
                    {loginMutation.isPending
                        ? t('auth.login.loggingIn')
                        : t('auth.login.loginButton')}
                </button>

                {/* REGISTER LINK */}
                <p className="text-sm text-gray-400 text-center">
                    {t('auth.login.noAccount')}{" "}
                    <Link
                        to="/auth/register"
                        className="text-blue-400 hover:underline"
                    >
                        {t('auth.login.register')}
                    </Link>
                </p>

            </form>
        </div>
    );


}
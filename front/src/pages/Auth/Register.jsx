import * as z from "zod";
import { register } from "../../api/auth.js";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export default function Register() {
    const { t } = useTranslation();

    // Schema Zod 
    const registerSchema = z.object({
        username: z.string().min(1, t('auth.register.validation.usernameRequired')),
        email: z.string().email(t('auth.register.validation.emailInvalid')),
        password: z.string().min(8, t('auth.register.validation.passwordMin')),
        confirmPassword: z.string(),
    })
        .refine((data) => data.password === data.confirmPassword, {
            message: t('auth.register.validation.passwordsNotMatch'),
            path: ["confirmPassword"],
        });

    const navigate = useNavigate();

    const {
        register: formRegister,
        handleSubmit,
    } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const registerMutation = useMutation({
        mutationFn: register,
        onSuccess: () => {
            navigate("/auth/login");
        },
        onError: (err) => {
            alert(err.response?.data?.error || t('common.error'));
        },
    });

    const onSubmit = (data) => {
        registerMutation.mutate(data);
    };

    if (localStorage.getItem("token")) {
        return (
            <>
                <h1 className="text-2xl font-bold mb-4">
                    {t('auth.register.alreadyLoggedIn', {
                        username: localStorage.getItem("username")
                    })}
                </h1>
                <Link to="/">{t('auth.register.goToHomepage')}</Link>
            </>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B1220] px-4">

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md bg-[#0F172A] border border-gray-800 rounded-2xl p-8 shadow-2xl space-y-5"
            >

                <h2 className="text-3xl font-bold text-white text-center mb-2">
                    {t('auth.register.title')}
                </h2>

                {/* USERNAME */}
                <input
                    placeholder={t('auth.register.username')}
                    {...formRegister("username")}
                    className="w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    type="text"
                />

                {/* EMAIL */}
                <input
                    placeholder={t('auth.register.email')}
                    {...formRegister("email")}
                    className="w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    type="email"
                />

                {/* PASSWORD */}
                <input
                    placeholder={t('auth.register.password')}
                    {...formRegister("password")}
                    className="w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    type="password"
                />

                {/* CONFIRM PASSWORD */}
                <input
                    placeholder={t('auth.register.confirmPassword')}
                    {...formRegister("confirmPassword")}
                    className="w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    type="password"
                />

                {/* BUTTON */}
                <button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20"
                >
                    {registerMutation.isPending
                        ? t('auth.login.loggingIn')
                        : t('auth.register.registerButton')}
                </button>

                {/* LINK LOGIN */}
                <p className="text-sm text-gray-400 text-center">
                    {t('auth.register.haveAccount')}{" "}
                    <Link
                        to="/auth/login"
                        className="text-blue-400 hover:underline"
                    >
                        {t('auth.register.login')}
                    </Link>
                </p>

            </form>
        </div>
    );

}
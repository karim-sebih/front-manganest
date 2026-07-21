import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AccessDeniedPage({
    autoRedirectToLogin = false,
    redirectDelaySeconds = 30,
    alertMessage = "",
}) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [secondsLeft, setSecondsLeft] = useState(redirectDelaySeconds);

    useEffect(() => {
        setSecondsLeft(redirectDelaySeconds);

        if (!autoRedirectToLogin) {
            return;
        }

        const timeoutId = setTimeout(() => {
            navigate("/auth/login");
        }, redirectDelaySeconds * 1000);

        const intervalId = setInterval(() => {
            setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };
    }, [autoRedirectToLogin, navigate, redirectDelaySeconds]);

    return (
        <>
            {/* <div className="min-h-screen bg-black text-white font-sans">

                <main className="mx-auto max-w-295 px-6 py-16">
                    <section className="rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-md md:p-12">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-[11px] font-black tracking-widest text-white/80">
                            {t("accessdenied.access_denied")}
                        </div>

                        <h1 className="m-0 text-[40px] leading-[1.05] font-black tracking-[-1px] md:text-[56px]">
                            {t("accessdenied.sorry")}{" "}
                            <span className="bg-linear-to-r from-[#ff4fd8] to-[#7b2cff] bg-clip-text text-transparent">
                                {t("accessdenied.not_access")}
                            </span>{" "}
                            {t("accessdenied.page")}
                        </h1>

                        <p className="mt-4 max-w-[75ch] text-white/70">
                            {t("accessdenied.message_reason")}
                        </p>

                        {alertMessage && (
                            <p className="mt-3 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-200">
                                {alertMessage}
                            </p>
                        )}

                        {autoRedirectToLogin && (
                            <p className="mt-3 text-sm font-semibold text-amber-300">
                                {t("accessdenied.redirect_notice", {
                                    seconds: secondsLeft,
                                    defaultValue:
                                        "Temporary warning: you will be redirected to the login page in {{seconds}}s.",
                                })}
                            </p>
                        )}

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <button
                                onClick={() => navigate("/")}
                                className="rounded-2xl px-6 py-4 text-sm font-black text-white
                         bg-linear-to-r from-[#7b2cff] to-[#FF2B7F]
                         shadow-[0_24px_80px_rgba(0,0,0,0.55)] transition hover:opacity-95"
                            >
                                {t("accessdenied.home_button")}
                            </button>

                            <button
                                onClick={() => navigate("/auth/login")}
                                className="rounded-2xl px-6 py-4 text-sm font-black text-white
                         bg-linear-to-r from-[#7b2cff] to-[#FF2B7F]
                         shadow-[0_24px_80px_rgba(0,0,0,0.55)] transition hover:opacity-95"
                            >
                                Login
                            </button>

                            <button
                                onClick={() => navigate(-1)}
                                className="rounded-2xl px-6 py-4 text-sm font-black text-white/80 transition hover:bg-white/5"
                            >
                                {t("accessdenied.back_button")}
                            </button>
                        </div>
                    </section>
                </main>


            </div> */}

        </>


    );
}

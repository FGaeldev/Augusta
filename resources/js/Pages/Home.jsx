import { Link } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import MainLayout from "../Layouts/MainLayout";

/**
 * Home Page — Golden Sky Travel & Tours landing page.
 *
 * Hero section with full-height background, brand identity,
 * tagline, and CTAs. Adapts CTAs based on auth state.
 *
 * Design tokens from app.css control all colors/fonts.
 * Edit tokens there — no changes needed here to retheme.
 *
 * Sections:
 *   - Hero: full viewport, background image, overlay, CTAs
 *   - Features: three USP cards (outdoorsy, light bg)
 *   - Trust bar: accreditation logos placeholder
 */
export default function Home() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <MainLayout>
            {/* ── Hero Section ── */}
            <div
                style={{
                    position: "relative",
                    minHeight: "100vh",
                    backgroundImage: "url('/background.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "2rem 1.5rem",
                }}
            >
                {/* Overlay — light navy tint, not fully dark */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(to bottom, rgba(26,43,95,0.65) 0%, rgba(26,43,95,0.45) 50%, rgba(26,43,95,0.75) 100%)",
                    }}
                />

                {/* Content */}
                <div
                    style={{ position: "relative", zIndex: 10, maxWidth: 700 }}
                >
                    {/* Eyebrow */}
                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            backgroundColor: "rgba(212,160,23,0.15)",
                            border: "1px solid rgba(212,160,23,0.4)",
                            borderRadius: "9999px",
                            padding: "0.375rem 1rem",
                            marginBottom: "1.5rem",
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "var(--font-body)",
                                fontWeight: 700,
                                fontSize: "1.25rem",
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                                color: "var(--color-primary)",
                            }}
                        >
                            Travel & Tours
                        </span>
                    </div>

                    {/* Brand name */}
                    <h1
                        style={{
                            fontFamily: "var(--font-heading)",
                            fontWeight: 900,
                            fontSize: "clamp(3rem, 8vw, 6rem)",
                            color: "#FFFFFF",
                            lineHeight: 1.1,
                            marginBottom: "0.5rem",
                            textShadow: "0 2px 20px rgba(0,0,0,0.3)",
                        }}
                    >
                        Golden Sky
                    </h1>

                    {/* Gold divider */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            margin: "1.5rem auto",
                            maxWidth: 300,
                        }}
                    >
                        <div
                            style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: "var(--color-primary)",
                                opacity: 0.6,
                            }}
                        />
                        <span
                            style={{
                                color: "var(--color-primary)",
                                fontSize: "1rem",
                            }}
                        >
                            ✦
                        </span>
                        <div
                            style={{
                                flex: 1,
                                height: 1,
                                backgroundColor: "var(--color-primary)",
                                opacity: 0.6,
                            }}
                        />
                    </div>

                    {/* Tagline */}
                    <p
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
                            color: "rgba(255,255,255,0.85)",
                            lineHeight: 1.7,
                            marginBottom: "2.5rem",
                            fontWeight: 400,
                        }}
                    >
                        Explore the world with confidence.
                        <br />
                        Your journey begins with Golden Sky.
                    </p>

                    {/* CTAs */}
                    <div
                        style={{
                            display: "flex",
                            gap: "1rem",
                            justifyContent: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        {!user && (
                            <>
                                <Link href="/register" className="btn-primary">
                                    Start Your Journey
                                </Link>
                                <Link
                                    href="/login"
                                    className="btn-secondary"
                                    style={{
                                        color: "white",
                                        borderColor: "rgba(255,255,255,0.6)",
                                    }}
                                >
                                    Sign In
                                </Link>
                            </>
                        )}
                        {user && (
                            <Link href="/profile" className="btn-primary">
                                My Profile
                            </Link>
                        )}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "2rem",
                        left: "50%",
                        transform: "translateX(-50%)",
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "0.75rem",
                        fontFamily: "var(--font-body)",
                        letterSpacing: "0.1em",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                >
                    <span>SCROLL</span>
                    <span style={{ fontSize: "1rem" }}>↓</span>
                </div>
            </div>

            {/* ── Features Section ── */}
            <div
                style={{
                    backgroundColor: "var(--color-bg-alt)",
                    padding: "5rem 1.5rem",
                }}
            >
                <div className="max-w-6xl mx-auto">
                    {/* Section heading */}
                    <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                        <p
                            style={{
                                fontFamily: "var(--font-body)",
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                                color: "var(--color-primary)",
                                marginBottom: "0.75rem",
                            }}
                        >
                            Why Choose Us
                        </p>
                        <h2
                            style={{
                                fontFamily: "var(--font-heading)",
                                fontWeight: 700,
                                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                                color: "var(--color-secondary)",
                            }}
                        >
                            Travel With Confidence
                        </h2>
                    </div>

                    {/* Feature cards */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: "1.5rem",
                        }}
                    >
                        {[
                            {
                                icon: (
                                    <svg
                                        width="40"
                                        height="40"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="var(--color-secondary)"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="2" y1="12" x2="22" y2="12" />
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                                    </svg>
                                ),
                                title: "International & Domestic",
                                desc: "From local island hopping to global adventures — we cover every destination.",
                            },
                            {
                                icon: (
                                    <svg
                                        width="40"
                                        height="40"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="var(--color-secondary)"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                ),
                                title: "DOT Accredited",
                                desc: "Licensed, accredited, and trusted by thousands of travelers since day one.",
                            },
                            {
                                icon: (
                                    <svg
                                        width="40"
                                        height="40"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="var(--color-secondary)"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.28h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                ),
                                title: "Full Service Agency",
                                desc: "Flights, hotels, tours, visa assistance, travel insurance — all in one place.",
                            },
                        ].map((f) => (
                            <div
                                key={f.title}
                                className="card"
                                style={{ textAlign: "center" }}
                            >
                                <div
                                    style={{
                                        marginBottom: "1rem",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    {f.icon}
                                </div>
                                <h3
                                    style={{
                                        fontFamily: "var(--font-heading)",
                                        fontWeight: 700,
                                        fontSize: "1.1rem",
                                        color: "var(--color-secondary)",
                                        marginBottom: "0.75rem",
                                    }}
                                >
                                    {f.title}
                                </h3>
                                <p
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        color: "var(--color-text-muted)",
                                        lineHeight: 1.7,
                                        fontSize: "0.95rem",
                                    }}
                                >
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Trust Bar ── */}
            <div
                style={{
                    backgroundColor: "var(--color-secondary)",
                    padding: "2.5rem 1.5rem",
                    textAlign: "center",
                }}
            >
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "var(--color-primary)",
                        marginBottom: "1.5rem",
                    }}
                >
                    Accredited & Trusted
                </p>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "3rem",
                        flexWrap: "wrap",
                    }}
                >
                    {[
                        { label: "DOT", sub: "Accredited" },
                        { label: "IATA", sub: "Member" },
                        { label: "SKAL", sub: "Member" },
                        { label: "TBL", sub: "Licensed" },
                    ].map((badge) => (
                        <div key={badge.label} style={{ textAlign: "center" }}>
                            <div
                                style={{
                                    fontFamily: "var(--font-heading)",
                                    fontWeight: 700,
                                    fontSize: "1.25rem",
                                    color: "var(--color-primary)",
                                    letterSpacing: "0.1em",
                                    lineHeight: 1,
                                    marginBottom: "0.25rem",
                                }}
                            >
                                {badge.label}
                            </div>
                            <div
                                style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: "0.7rem",
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    color: "rgba(255,255,255,0.4)",
                                }}
                            >
                                {badge.sub}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}

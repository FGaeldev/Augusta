/**
 * MainLayout.jsx
 *
 * Purpose: Shared shell layout for all Augusta pages.
 * Context: Wraps every page with navbar, main content area, and footer.
 *          All auth-aware navigation logic lives here.
 *
 * Dependencies: @inertiajs/react (Link, router, usePage), React (useState)
 *
 * Augusta — Royal × Programmer photo wall.
 * Design tokens from app.css control all colors and fonts.
 * Edit tokens there; no changes needed here to retheme.
 *
 * Navbar roles:
 *   guest        → Login, Join the Order (Register)
 *   public/business → Profile, Logout
 *   admin        → Dashboard, Applications, Profile, Logout
 *
 * Mobile: animated hamburger → dropdown drawer.
 */

import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function MainLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [mobileOpen, setMobileOpen] = useState(false);

    /**
     * Triggers an Inertia POST to /logout.
     * Backend handles session invalidation and session log closure.
     */
    const handleLogout = () => {
        router.post("/logout");
    };

    // ── Style constants ──────────────────────────────────────────────

    /**
     * Desktop nav link — inherits royal parchment tone on dark navy bar.
     * Uppercase + wide tracking matches Cinzel heading font character.
     */
    const navLinkStyle = {
        color: "rgba(247,244,239,0.7)",
        fontFamily: "var(--font-heading)",
        fontWeight: 600,
        fontSize: "0.72rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        textDecoration: "none",
        transition: "color 0.2s",
        cursor: "pointer",
        background: "none",
        border: "none",
        padding: 0,
    };

    /**
     * Mobile nav link — wider tap target, bottom border as separator.
     */
    const mobileNavLinkStyle = {
        display: "block",
        color: "rgba(247,244,239,0.8)",
        fontFamily: "var(--font-heading)",
        fontWeight: 600,
        fontSize: "0.75rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        textDecoration: "none",
        padding: "0.875rem 0",
        borderBottom: "1px solid rgba(201,168,76,0.15)",
        transition: "color 0.2s",
        cursor: "pointer",
        background: "none",
        border: "none",
        borderBottom: "1px solid rgba(201,168,76,0.15)",
        width: "100%",
        textAlign: "left",
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)" }}>

            {/* ── Navbar ────────────────────────────────────────────── */}
            <nav
                style={{
                    backgroundColor: "var(--color-secondary-dark)",
                    borderBottom: "2px solid var(--color-primary)",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    boxShadow: "0 4px 24px rgba(14,17,36,0.5)",
                }}
            >
                <div
                    className="max-w-7xl mx-auto px-6"
                    style={{
                        height: "3.75rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    {/* ── Wordmark ── */}
                    <Link
                        href="/"
                        style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.625rem" }}
                    >
                        {/* Crown glyph — purely decorative SVG, no external dep */}
                        <svg
                            width="20"
                            height="16"
                            viewBox="0 0 20 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                d="M1 14L4 5L8 10L10 3L12 10L16 5L19 14H1Z"
                                fill="var(--color-primary)"
                                stroke="var(--color-primary-dark)"
                                strokeWidth="0.75"
                                strokeLinejoin="round"
                            />
                            {/* Base bar */}
                            <rect x="1" y="14" width="18" height="1.5" rx="0.75" fill="var(--color-primary)" />
                        </svg>

                        <span
                            style={{
                                fontFamily: "var(--font-heading)",
                                fontWeight: 700,
                                fontSize: "1.25rem",
                                color: "var(--color-primary)",
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                            }}
                        >
                            Augusta
                        </span>
                    </Link>

                    {/* ── Desktop Links ── */}
                    <div className="hidden md:flex" style={{ alignItems: "center", gap: "2.25rem" }}>
                        {/* Guest state */}
                        {!user && (
                            <>
                                <Link href="/login" style={navLinkStyle}>
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="btn-primary"
                                    style={{ padding: "0.5rem 1.25rem", fontSize: "0.65rem" }}
                                >
                                    Join
                                </Link>
                            </>
                        )}

                        {/* Authenticated state */}
                        {user && (
                            <>
                                {/* Admin-only links */}
                                {user.role === "admin" && (
                                    <>
                                        <Link href="/admin" style={navLinkStyle}>
                                            Dashboard
                                        </Link>
                                        <Link href="/admin/applications" style={navLinkStyle}>
                                            Applications
                                        </Link>
                                    </>
                                )}

                                <Link href="/profile" style={navLinkStyle}>
                                    Profile
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    style={{
                                        ...navLinkStyle,
                                        color: "rgba(210,100,100,0.8)",
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>

                    {/* ── Mobile Hamburger ── */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden"
                        aria-label="Toggle navigation menu"
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "0.5rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "5px",
                        }}
                    >
                        {/* Three-bar hamburger with animated X transform */}
                        {[
                            {
                                transform: mobileOpen ? "rotate(45deg) translateY(7px)" : "none",
                            },
                            {
                                opacity: mobileOpen ? 0 : 1,
                                transform: mobileOpen ? "scaleX(0)" : "none",
                            },
                            {
                                transform: mobileOpen ? "rotate(-45deg) translateY(-7px)" : "none",
                            },
                        ].map((barStyle, i) => (
                            <span
                                key={i}
                                style={{
                                    display: "block",
                                    width: 22,
                                    height: 2,
                                    backgroundColor: "var(--color-primary)",
                                    borderRadius: 2,
                                    transition: "all 0.3s ease",
                                    ...barStyle,
                                }}
                            />
                        ))}
                    </button>
                </div>

                {/* ── Mobile Dropdown Drawer ── */}
                {mobileOpen && (
                    <div
                        style={{
                            backgroundColor: "var(--color-secondary)",
                            borderTop: "1px solid rgba(201,168,76,0.2)",
                            padding: "0.5rem 1.5rem 1.25rem",
                        }}
                    >
                        {/* Guest state */}
                        {!user && (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setMobileOpen(false)}
                                    style={mobileNavLinkStyle}
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setMobileOpen(false)}
                                    style={mobileNavLinkStyle}
                                >
                                    Join the Order
                                </Link>
                            </>
                        )}

                        {/* Authenticated state */}
                        {user && (
                            <>
                                {user.role === "admin" && (
                                    <>
                                        <Link
                                            href="/admin"
                                            onClick={() => setMobileOpen(false)}
                                            style={mobileNavLinkStyle}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/admin/applications"
                                            onClick={() => setMobileOpen(false)}
                                            style={mobileNavLinkStyle}
                                        >
                                            Applications
                                        </Link>
                                    </>
                                )}

                                <Link
                                    href="/profile"
                                    onClick={() => setMobileOpen(false)}
                                    style={mobileNavLinkStyle}
                                >
                                    Profile
                                </Link>

                                <button
                                    onClick={() => {
                                        setMobileOpen(false);
                                        handleLogout();
                                    }}
                                    style={{
                                        ...mobileNavLinkStyle,
                                        color: "rgba(210,100,100,0.85)",
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                )}
            </nav>

            {/* ── Page Content ── */}
            {/* paddingTop clears fixed navbar height (3.75rem) */}
            <main style={{ paddingTop: "3.75rem" }}>{children}</main>

            {/* ── Footer ── */}
            <footer
                style={{
                    backgroundColor: "var(--color-secondary-dark)",
                    borderTop: "2px solid var(--color-primary)",
                    color: "var(--color-text-light)",
                    padding: "2rem 1.5rem",
                    marginTop: "4rem",
                }}
            >
                <div
                    className="max-w-7xl mx-auto"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.75rem",
                        textAlign: "center",
                    }}
                >
                    {/* Wordmark repeat */}
                    <span
                        style={{
                            fontFamily: "var(--font-heading)",
                            fontWeight: 700,
                            fontSize: "1rem",
                            color: "var(--color-primary)",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                        }}
                    >
                        Augusta
                    </span>

                    {/* Ornamental separator */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            width: "100%",
                            maxWidth: 200,
                        }}
                    >
                        <div style={{ flex: 1, height: 1, backgroundColor: "rgba(201,168,76,0.3)" }} />
                        <span style={{ color: "var(--color-primary)", fontSize: "0.6rem", opacity: 0.7 }}>✦</span>
                        <div style={{ flex: 1, height: 1, backgroundColor: "rgba(201,168,76,0.3)" }} />
                    </div>

                    <p
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.8rem",
                            color: "rgba(247,244,239,0.35)",
                            letterSpacing: "0.05em",
                            fontStyle: "italic",
                        }}
                    >
                        © 2026 Augusta. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
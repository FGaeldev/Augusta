import { Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

/**
 * MainLayout
 *
 * Shared layout for all pages.
 * Uses CSS design tokens from app.css — edit tokens there to retheme.
 *
 * Navbar:
 *   - Navy background matching Golden Sky branding
 *   - Gold accents on active/hover states
 *   - Role-aware navigation links
 *   - Mobile hamburger menu
 *
 * Roles:
 *   guest        → Login, Register
 *   public/business → Profile, Logout
 *   admin        → Dashboard, Applications, Profile, Logout
 */
export default function MainLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        router.post("/logout");
    };

    const navLinkClass =
        "text-white/70 hover:text-white text-sm font-semibold tracking-wide transition-colors duration-200";
    const mobileNavLinkClass =
        "block text-white/80 hover:text-white text-sm font-semibold tracking-wide py-3 border-b border-white/10 transition-colors duration-200";

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)" }}>
            {/* ── Navbar ── */}
            <nav
                style={{
                    backgroundColor: "var(--color-secondary)",
                    boxShadow: "var(--shadow-lg)",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 50,
                }}
            >
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <span
                            style={{
                                fontFamily: "var(--font-heading)",
                                fontWeight: 700,
                                fontSize: "1.5rem",
                                color: "var(--color-primary)",
                                letterSpacing: "0.05em",
                            }}
                        >
                            Golden Sky
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {!user && (
                            <>
                                <Link
                                    href="/login"
                                    className={navLinkClass}
                                    style={{ fontFamily: "var(--font-body)" }}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="btn-primary py-2! px-5! text-xs!"
                                >
                                    Register
                                </Link>
                            </>
                        )}

                        {user && (
                            <>
                                {user.role === "admin" && (
                                    <>
                                        <Link
                                            href="/admin"
                                            className={navLinkClass}
                                            style={{
                                                fontFamily: "var(--font-body)",
                                            }}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/admin/applications"
                                            className={navLinkClass}
                                            style={{
                                                fontFamily: "var(--font-body)",
                                            }}
                                        >
                                            Applications
                                        </Link>
                                    </>
                                )}
                                <Link
                                    href="/profile"
                                    className={navLinkClass}
                                    style={{ fontFamily: "var(--font-body)" }}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className={navLinkClass}
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        color: "#FCA5A5",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden flex flex-col gap-1.5 p-2"
                        aria-label="Toggle menu"
                    >
                        <span
                            style={{
                                display: "block",
                                width: 22,
                                height: 2,
                                backgroundColor: "var(--color-primary)",
                                transition: "all 0.3s",
                                transform: mobileOpen
                                    ? "rotate(45deg) translateY(6px)"
                                    : "none",
                            }}
                        />
                        <span
                            style={{
                                display: "block",
                                width: 22,
                                height: 2,
                                backgroundColor: "var(--color-primary)",
                                transition: "all 0.3s",
                                opacity: mobileOpen ? 0 : 1,
                            }}
                        />
                        <span
                            style={{
                                display: "block",
                                width: 22,
                                height: 2,
                                backgroundColor: "var(--color-primary)",
                                transition: "all 0.3s",
                                transform: mobileOpen
                                    ? "rotate(-45deg) translateY(-6px)"
                                    : "none",
                            }}
                        />
                    </button>
                </div>

                {/* Mobile Dropdown */}
                {mobileOpen && (
                    <div
                        style={{
                            backgroundColor: "var(--color-secondary-dark)",
                            borderTop: "1px solid rgba(255,255,255,0.1)",
                            padding: "0.5rem 1.5rem 1rem",
                        }}
                    >
                        {!user && (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className={mobileNavLinkClass}
                                    style={{ fontFamily: "var(--font-body)" }}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setMobileOpen(false)}
                                    className={mobileNavLinkClass}
                                    style={{ fontFamily: "var(--font-body)" }}
                                >
                                    Register
                                </Link>
                            </>
                        )}
                        {user && (
                            <>
                                {user.role === "admin" && (
                                    <>
                                        <Link
                                            href="/admin"
                                            onClick={() => setMobileOpen(false)}
                                            className={mobileNavLinkClass}
                                            style={{
                                                fontFamily: "var(--font-body)",
                                            }}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/admin/applications"
                                            onClick={() => setMobileOpen(false)}
                                            className={mobileNavLinkClass}
                                            style={{
                                                fontFamily: "var(--font-body)",
                                            }}
                                        >
                                            Applications
                                        </Link>
                                    </>
                                )}
                                <Link
                                    href="/profile"
                                    onClick={() => setMobileOpen(false)}
                                    className={mobileNavLinkClass}
                                    style={{ fontFamily: "var(--font-body)" }}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        setMobileOpen(false);
                                        handleLogout();
                                    }}
                                    className={mobileNavLinkClass}
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        color: "#FCA5A5",
                                        background: "none",
                                        border: "none",
                                        width: "100%",
                                        textAlign: "left",
                                        cursor: "pointer",
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                )}
            </nav>

            {/* Page Content */}
            <main style={{ paddingTop: "4rem" }}>{children}</main>

            {/* Footer */}
            <footer
                style={{
                    backgroundColor: "var(--color-secondary)",
                    color: "var(--color-text-light)",
                    padding: "2rem 1.5rem",
                    marginTop: "4rem",
                }}
            >
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <span
                            style={{
                                fontFamily: "var(--font-heading)",
                                fontWeight: 700,
                                color: "var(--color-primary)",
                                fontSize: "1.1rem",
                            }}
                        >
                            Golden Sky Travel & Tours
                        </span>
                    </div>
                    <p
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.8rem",
                            color: "rgba(255,255,255,0.5)",
                        }}
                    >
                        © 2026 Golden Sky Travel & Tours Corp. All Rights
                        Reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

/**
 * Home.jsx
 *
 * Purpose: Augusta landing page — "Wall of Photos" for the group.
 * Context: Public-facing page. Shows the group's member photo wall,
 *          a royal motto section, and auth-aware CTAs.
 *
 * Dependencies:
 *   - @inertiajs/react (Link, usePage)
 *   - ../Layouts/MainLayout
 *   - Design tokens from resources/css/app.css
 *
 * Sections:
 *   1. Hero      — full-viewport crest + group name + CTA
 *   2. Wall      — masonry-style photo grid of members
 *   3. Motto     — group tagline / programmer oath banner
 *
 * Auth-aware:
 *   Guest        → "Join the Order" + "Sign In" CTAs
 *   Authenticated → "View Profile" CTA
 *
 * Photo data is static placeholder — swap `MEMBERS` array
 * with real data from backend props when ready.
 */

import { Link, usePage } from "@inertiajs/react";
import MainLayout from "../Layouts/MainLayout";

// ---------------------------------------------------------------------------
// Static member data — replace with Inertia props from backend when ready.
// Each entry: { id, name, role, photoUrl, tag }
// `tag` is the programmer title shown on the nameplate.
// ---------------------------------------------------------------------------
const MEMBERS = [
    {
        id: 1,
        name: "Aragorn",
        tag: "Systems Architect",
        photoUrl: null,
        initials: "AR",
        hue: 220,
    },
    {
        id: 2,
        name: "Legolas",
        tag: "Frontend Dev",
        photoUrl: null,
        initials: "LG",
        hue: 160,
    },
    {
        id: 3,
        name: "Gimli",
        tag: "Database Admin",
        photoUrl: null,
        initials: "GM",
        hue: 30,
    },
    {
        id: 4,
        name: "Gandalf",
        tag: "DevOps Wizard",
        photoUrl: null,
        initials: "GN",
        hue: 260,
    },
    {
        id: 5,
        name: "Frodo",
        tag: "QA Engineer",
        photoUrl: null,
        initials: "FR",
        hue: 10,
    },
    {
        id: 6,
        name: "Samwise",
        tag: "Backend Dev",
        photoUrl: null,
        initials: "SW",
        hue: 100,
    },
    {
        id: 7,
        name: "Boromir",
        tag: "Security Lead",
        photoUrl: null,
        initials: "BR",
        hue: 350,
    },
    {
        id: 8,
        name: "Merry",
        tag: "UI Designer",
        photoUrl: null,
        initials: "MR",
        hue: 190,
    },
    {
        id: 9,
        name: "Pippin",
        tag: "Junior Dev",
        photoUrl: null,
        initials: "PP",
        hue: 55,
    },
];

// ---------------------------------------------------------------------------
// MemberCard — one framed portrait in the wall.
// Shows photo if available, else a monogram on a tinted background.
// ---------------------------------------------------------------------------
function MemberCard({ member }) {
    return (
        <div className="photo-frame">
            {/* Portrait area — fixed aspect ratio */}
            <div
                style={{
                    width: "100%",
                    aspectRatio: "3/4",
                    borderRadius: "2px",
                    overflow: "hidden",
                    position: "relative",
                    backgroundColor: `hsl(${member.hue}, 28%, 22%)`,
                }}
            >
                {member.photoUrl ? (
                    <img
                        src={member.photoUrl}
                        alt={member.name}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                        }}
                    />
                ) : (
                    // Monogram placeholder when no photo supplied
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            gap: "0.5rem",
                            // Subtle vignette gradient over tinted bg
                            background: `radial-gradient(ellipse at 50% 40%, hsl(${member.hue},30%,32%) 0%, hsl(${member.hue},20%,14%) 100%)`,
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "var(--font-heading)",
                                fontSize: "2.25rem",
                                fontWeight: 700,
                                color: "var(--color-primary)",
                                letterSpacing: "0.08em",
                                lineHeight: 1,
                            }}
                        >
                            {member.initials}
                        </span>
                        {/* Thin gold rule beneath initials */}
                        <div
                            style={{
                                width: 32,
                                height: 1,
                                backgroundColor: "var(--color-primary)",
                                opacity: 0.5,
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Nameplate */}
            <div className="name-plate" title={member.tag}>
                {member.name}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// OrnamentalDivider — reusable gold-flanked symbol row
// ---------------------------------------------------------------------------
function OrnamentalDivider({ symbol = "✦" }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                maxWidth: 280,
                margin: "0 auto",
            }}
        >
            <div
                style={{
                    flex: 1,
                    height: 1,
                    background:
                        "linear-gradient(to right, transparent, var(--color-primary))",
                    opacity: 0.7,
                }}
            />
            <span
                style={{
                    color: "var(--color-primary)",
                    fontSize: "0.75rem",
                    opacity: 0.8,
                }}
            >
                {symbol}
            </span>
            <div
                style={{
                    flex: 1,
                    height: 1,
                    background:
                        "linear-gradient(to left, transparent, var(--color-primary))",
                    opacity: 0.7,
                }}
            />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Home — main export
// ---------------------------------------------------------------------------
export default function Home() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <MainLayout>

            {/* ── 1. Hero ─────────────────────────────────────────────── */}
            <section
                style={{
                    minHeight: "100vh",
                    backgroundColor: "var(--color-secondary-dark)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    padding: "5rem 1.5rem 4rem",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Background: radial gold glow from center — atmospheric */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%)",
                        pointerEvents: "none",
                    }}
                />

                {/* Subtle grid pattern — programmer aesthetic over royal base */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage:
                            "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                        pointerEvents: "none",
                    }}
                />

                {/* Content */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 10,
                        maxWidth: 680,
                    }}
                >
                    {/* Crown SVG — large decorative crest */}
                    <svg
                        width="56"
                        height="44"
                        viewBox="0 0 56 44"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ marginBottom: "1.5rem", opacity: 0.9 }}
                        aria-hidden="true"
                    >
                        <path
                            d="M3 40L10 14L22 28L28 8L34 28L46 14L53 40H3Z"
                            fill="var(--color-primary)"
                            stroke="var(--color-primary-dark)"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                        />
                        <rect
                            x="3"
                            y="40"
                            width="50"
                            height="3"
                            rx="1.5"
                            fill="var(--color-primary)"
                        />
                        {/* Jewel dots on crown peaks */}
                        <circle cx="10" cy="14" r="2.5" fill="var(--color-primary-dark)" />
                        <circle cx="28" cy="8" r="2.5" fill="var(--color-primary-dark)" />
                        <circle cx="46" cy="14" r="2.5" fill="var(--color-primary-dark)" />
                    </svg>

                    {/* Eyebrow */}
                    <span
                        className="eyebrow"
                        style={{ marginBottom: "1rem", display: "block" }}
                    >
                        The Order of
                    </span>

                    {/* Main wordmark */}
                    <h1
                        style={{
                            fontFamily: "var(--font-heading)",
                            fontWeight: 900,
                            fontSize: "clamp(3.5rem, 10vw, 7rem)",
                            color: "var(--color-primary)",
                            lineHeight: 1,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            marginBottom: "1.5rem",
                            // Gold text shimmer via text-shadow layers
                            textShadow:
                                "0 0 40px rgba(201,168,76,0.3), 0 2px 4px rgba(0,0,0,0.5)",
                        }}
                    >
                        Augusta
                    </h1>

                    <OrnamentalDivider />

                    {/* Tagline */}
                    <p
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                            color: "rgba(247,244,239,0.65)",
                            lineHeight: 1.8,
                            marginTop: "1.5rem",
                            marginBottom: "2.5rem",
                            fontStyle: "italic",
                            fontWeight: 300,
                        }}
                    >
                        A fellowship of engineers, bound by craft and code.
                        <br />
                        Forged in the halls of computation.
                    </p>

                    {/* CTAs — auth-aware */}
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
                                    Join the Order
                                </Link>
                                <Link
                                    href="/login"
                                    className="btn-secondary"
                                    style={{
                                        color: "rgba(247,244,239,0.8)",
                                        borderColor: "rgba(247,244,239,0.3)",
                                    }}
                                >
                                    Sign In
                                </Link>
                            </>
                        )}
                        {user && (
                            <Link href="/profile" className="btn-primary">
                                My Chamber
                            </Link>
                        )}
                    </div>
                </div>

                {/* Scroll cue */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "2rem",
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.4rem",
                        color: "rgba(201,168,76,0.4)",
                        fontFamily: "var(--font-heading)",
                        fontSize: "0.55rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                    }}
                >
                    <span>Enter</span>
                    <span style={{ fontSize: "0.9rem" }}>↓</span>
                </div>
            </section>

            {/* ── 2. Photo Wall ───────────────────────────────────────── */}
            <section
                style={{
                    backgroundColor: "var(--color-bg-alt)",
                    padding: "5rem 1.5rem",
                    // Faint diagonal hatching — heraldic background texture
                    backgroundImage:
                        "repeating-linear-gradient(45deg, rgba(201,168,76,0.025) 0, rgba(201,168,76,0.025) 1px, transparent 0, transparent 50%)",
                    backgroundSize: "12px 12px",
                }}
            >
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>

                    {/* Section heading */}
                    <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
                        <span
                            className="eyebrow"
                            style={{ marginBottom: "0.75rem", display: "block" }}
                        >
                            The Fellowship
                        </span>
                        <h2
                            className="section-heading"
                            style={{
                                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                                marginBottom: "1rem",
                            }}
                        >
                            Members of the Order
                        </h2>
                        <OrnamentalDivider />
                    </div>

                    {/* Photo grid — responsive columns, deliberate slight-rotate handled by CSS */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(160px, 1fr))",
                            gap: "1.75rem",
                        }}
                    >
                        {MEMBERS.map((member, index) => (
                            /*
                             * Alternate slight rotation per card — gives pinned-photos-on-corkboard feel.
                             * Even index: tiny clockwise tilt. Odd: tiny counter-clockwise.
                             * Hover in .photo-frame CSS resets + lifts.
                             */
                            <div
                                key={member.id}
                                style={{
                                    transform: `rotate(${index % 2 === 0 ? 1.2 : -1.0}deg)`,
                                    transition: "transform 0.3s ease",
                                }}
                            >
                                <MemberCard member={member} />
                            </div>
                        ))}
                    </div>

                    {/* Member count footnote */}
                    <p
                        style={{
                            textAlign: "center",
                            marginTop: "3rem",
                            fontFamily: "var(--font-body)",
                            fontSize: "0.85rem",
                            color: "var(--color-text-muted)",
                            fontStyle: "italic",
                        }}
                    >
                        {MEMBERS.length} members strong — and growing.
                    </p>
                </div>
            </section>

            {/* ── 3. Motto Banner ─────────────────────────────────────── */}
            <section
                style={{
                    backgroundColor: "var(--color-secondary)",
                    borderTop: "2px solid var(--color-primary)",
                    borderBottom: "2px solid var(--color-primary)",
                    padding: "3.5rem 1.5rem",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Faint radial glow behind motto text */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)",
                        pointerEvents: "none",
                    }}
                />

                <div style={{ position: "relative", zIndex: 1 }}>
                    <span
                        className="eyebrow"
                        style={{ marginBottom: "1.25rem", display: "block" }}
                    >
                        Our Oath
                    </span>

                    {/* Motto — styled like a monumental inscription */}
                    <blockquote
                        style={{
                            fontFamily: "var(--font-heading)",
                            fontWeight: 700,
                            fontSize: "clamp(1.1rem, 3vw, 1.6rem)",
                            color: "var(--color-primary)",
                            letterSpacing: "0.08em",
                            lineHeight: 1.6,
                            margin: "0 auto",
                            maxWidth: 680,
                            textTransform: "uppercase",
                        }}
                    >
                        "We do not ship bugs to production.
                        <br />
                        We ship <em style={{ fontStyle: "italic", color: "rgba(201,168,76,0.75)" }}>legends</em>."
                    </blockquote>

                    <div style={{ marginTop: "1.5rem" }}>
                        <OrnamentalDivider />
                    </div>

                    {/* Sub-caption in mono font — programmer flavor */}
                    <p
                        style={{
                            marginTop: "1.25rem",
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.75rem",
                            color: "rgba(247,244,239,0.3)",
                            letterSpacing: "0.08em",
                        }}
                    >
                        // Augusta v1.0.0 — est. 2026
                    </p>
                </div>
            </section>

        </MainLayout>
    );
}
import { useState } from "react";
import { usePage } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";

/**
 * Admin Dashboard Page
 *
 * Central control panel for site administrators.
 * Three tabbed sections:
 *   - Accounts: all registered users with role, status, join date
 *   - Login Logs: 50 most recent login attempts (success/fail, IP, time)
 *   - Session Logs: 50 most recent sessions (login/logout times, status)
 *
 * Role and status displayed as colored badges for quick scanning.
 * Tables scrollable — max height enforced to prevent page overflow.
 *
 * Mobile: dropdown tab selector.
 * Desktop: horizontal tab bar.
 *
 * Design tokens from app.css control all colors/fonts.
 */

// Role badge styles
const roleBadgeStyle = {
    admin: { backgroundColor: "#EEF2FF", color: "#3730A3" },
    business: { backgroundColor: "#EFF6FF", color: "#1D4ED8" },
    public: { backgroundColor: "#F1F5F9", color: "#475569" },
};

// Status badge styles
const statusBadgeStyle = {
    active: { backgroundColor: "#DCFCE7", color: "#15803D" },
    pending: { backgroundColor: "#FEF3C7", color: "#92400E" },
    rejected: { backgroundColor: "#FEE2E2", color: "#B91C1C" },
};

// Table header cell style
const th = {
    padding: "0.875rem 1rem",
    textAlign: "left",
    fontSize: "0.7rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontFamily: "var(--font-body)",
    fontWeight: 700,
    color: "var(--color-text-muted)",
    borderBottom: "2px solid var(--color-border)",
    backgroundColor: "var(--color-bg)",
    position: "sticky",
    top: 0,
    zIndex: 10,
};

// Table data cell style
const td = {
    padding: "0.875rem 1rem",
    fontFamily: "var(--font-body)",
    fontSize: "0.875rem",
    color: "var(--color-text)",
    borderBottom: "1px solid var(--color-border)",
};

export default function Dashboard({ accounts, loginLogs, sessionLogs }) {
    const { flash } = usePage().props;
    const [tab, setTab] = useState("accounts");
    const [open, setOpen] = useState(false);

    const tabs = [
        { value: "accounts", label: "Accounts" },
        { value: "loginLogs", label: "Login Logs" },
        { value: "sessions", label: "Session Logs" },
    ];

    return (
        <MainLayout>
            <div
                style={{
                    minHeight: "calc(100vh - 4rem)",
                    backgroundColor: "var(--color-bg-alt)",
                    padding: "3rem 1rem",
                }}
            >
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    {/* Page heading */}
                    <div style={{ marginBottom: "2rem" }}>
                        <p
                            style={{
                                fontFamily: "var(--font-body)",
                                fontWeight: 700,
                                fontSize: "0.7rem",
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                                color: "var(--color-primary-dark)",
                                marginBottom: "0.5rem",
                            }}
                        >
                            Administration
                        </p>
                        <h1
                            style={{
                                fontFamily: "var(--font-heading)",
                                fontWeight: 700,
                                fontSize: "2rem",
                                color: "var(--color-secondary)",
                                marginBottom: "0.25rem",
                            }}
                        >
                            Site Dashboard
                        </h1>
                        <p
                            style={{
                                fontFamily: "var(--font-body)",
                                color: "var(--color-text-muted)",
                                fontSize: "0.95rem",
                            }}
                        >
                            Manage accounts, monitor login activity and
                            sessions.
                        </p>
                    </div>

                    {/* Flash message */}
                    {flash.message && (
                        <div
                            className="alert-success"
                            style={{ marginBottom: "1.5rem" }}
                        >
                            {flash.message}
                        </div>
                    )}

                    {/* Stats row */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(180px, 1fr))",
                            gap: "1rem",
                            marginBottom: "2rem",
                        }}
                    >
                        {[
                            { label: "Total Accounts", value: accounts.length },
                            {
                                label: "Active",
                                value: accounts.filter(
                                    (a) => a.status === "active",
                                ).length,
                            },
                            {
                                label: "Pending",
                                value: accounts.filter(
                                    (a) => a.status === "pending",
                                ).length,
                            },
                            {
                                label: "Login Attempts",
                                value: loginLogs.length,
                            },
                        ].map((s) => (
                            <div
                                key={s.label}
                                className="card"
                                style={{ textAlign: "center" }}
                            >
                                <p
                                    style={{
                                        fontFamily: "var(--font-heading)",
                                        fontWeight: 700,
                                        fontSize: "2rem",
                                        color: "var(--color-secondary)",
                                        lineHeight: 1,
                                        marginBottom: "0.375rem",
                                    }}
                                >
                                    {s.value}
                                </p>
                                <p
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: "0.75rem",
                                        fontWeight: 700,
                                        letterSpacing: "0.08em",
                                        textTransform: "uppercase",
                                        color: "var(--color-text-muted)",
                                    }}
                                >
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Card with tabs */}
                    <div
                        className="card"
                        style={{ padding: 0, overflow: "hidden" }}
                    >
                        {/* Desktop tab bar */}
                        <div
                            className="hidden md:flex"
                            style={{
                                borderBottom: "2px solid var(--color-border)",
                                backgroundColor: "var(--color-bg)",
                            }}
                        >
                            {tabs.map((t) => (
                                <button
                                    key={t.value}
                                    onClick={() => setTab(t.value)}
                                    style={{
                                        padding: "1rem 1.5rem",
                                        fontFamily: "var(--font-body)",
                                        fontWeight: 700,
                                        fontSize: "0.8rem",
                                        letterSpacing: "0.05em",
                                        textTransform: "uppercase",
                                        color:
                                            tab === t.value
                                                ? "var(--color-secondary)"
                                                : "var(--color-text-muted)",
                                        borderBottom:
                                            tab === t.value
                                                ? "2px solid var(--color-primary)"
                                                : "2px solid transparent",
                                        marginBottom: "-2px",
                                        background: "none",
                                        border: "none",
                                        borderBottom:
                                            tab === t.value
                                                ? `2px solid var(--color-primary)`
                                                : "2px solid transparent",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                    }}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Mobile dropdown */}
                        <div
                            className="md:hidden"
                            style={{
                                borderBottom: "2px solid var(--color-border)",
                                position: "relative",
                            }}
                        >
                            <button
                                onClick={() => setOpen(!open)}
                                style={{
                                    width: "100%",
                                    padding: "1rem 1.5rem",
                                    fontFamily: "var(--font-body)",
                                    fontWeight: 700,
                                    fontSize: "0.8rem",
                                    letterSpacing: "0.05em",
                                    textTransform: "uppercase",
                                    color: "var(--color-text)",
                                    backgroundColor: "var(--color-bg)",
                                    border: "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <span>
                                    {tabs.find((t) => t.value === tab)?.label}
                                </span>
                                <span
                                    style={{
                                        transform: open
                                            ? "rotate(180deg)"
                                            : "none",
                                        transition: "transform 0.2s",
                                    }}
                                >
                                    ▼
                                </span>
                            </button>
                            {open && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: 0,
                                        right: 0,
                                        backgroundColor: "var(--color-bg)",
                                        border: "1.5px solid var(--color-border)",
                                        borderTop: "none",
                                        zIndex: 20,
                                        boxShadow: "var(--shadow-lg)",
                                    }}
                                >
                                    {tabs.map((t) => (
                                        <button
                                            key={t.value}
                                            onClick={() => {
                                                setTab(t.value);
                                                setOpen(false);
                                            }}
                                            style={{
                                                display: "block",
                                                width: "100%",
                                                padding: "0.875rem 1.5rem",
                                                fontFamily: "var(--font-body)",
                                                fontWeight: 700,
                                                fontSize: "0.8rem",
                                                letterSpacing: "0.05em",
                                                textTransform: "uppercase",
                                                color:
                                                    tab === t.value
                                                        ? "var(--color-secondary)"
                                                        : "var(--color-text-muted)",
                                                backgroundColor:
                                                    tab === t.value
                                                        ? "var(--color-bg-alt)"
                                                        : "transparent",
                                                border: "none",
                                                borderBottom:
                                                    "1px solid var(--color-border)",
                                                cursor: "pointer",
                                                textAlign: "left",
                                            }}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Table container */}
                        <div
                            style={{
                                overflowX: "auto",
                                maxHeight: "60vh",
                                overflowY: "auto",
                            }}
                        >
                            {/* Accounts Table */}
                            {tab === "accounts" && (
                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            <th style={th}>ID</th>
                                            <th style={th}>Email</th>
                                            <th style={th}>Role</th>
                                            <th style={th}>Status</th>
                                            <th style={th}>Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {accounts.map((u) => (
                                            <tr
                                                key={u.id}
                                                style={{
                                                    transition:
                                                        "background 0.15s",
                                                }}
                                                onMouseEnter={(e) =>
                                                    (e.currentTarget.style.backgroundColor =
                                                        "var(--color-bg-alt)")
                                                }
                                                onMouseLeave={(e) =>
                                                    (e.currentTarget.style.backgroundColor =
                                                        "transparent")
                                                }
                                            >
                                                <td style={td}>{u.id}</td>
                                                <td
                                                    style={{
                                                        ...td,
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {u.email}
                                                </td>
                                                <td style={td}>
                                                    <span
                                                        className="badge"
                                                        style={
                                                            roleBadgeStyle[
                                                                u.role
                                                            ]
                                                        }
                                                    >
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td style={td}>
                                                    <span
                                                        className="badge"
                                                        style={
                                                            statusBadgeStyle[
                                                                u.status
                                                            ]
                                                        }
                                                    >
                                                        {u.status}
                                                    </span>
                                                </td>
                                                <td
                                                    style={{
                                                        ...td,
                                                        color: "var(--color-text-muted)",
                                                    }}
                                                >
                                                    {new Date(
                                                        u.created_at,
                                                    ).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                        {accounts.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    style={{
                                                        ...td,
                                                        textAlign: "center",
                                                        color: "var(--color-text-muted)",
                                                        padding: "3rem",
                                                    }}
                                                >
                                                    No accounts found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}

                            {/* Login Logs Table */}
                            {tab === "loginLogs" && (
                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            <th style={th}>Email Attempted</th>
                                            <th style={th}>Status</th>
                                            <th style={th}>IP Address</th>
                                            <th style={th}>Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loginLogs.map((l) => (
                                            <tr
                                                key={l.id}
                                                onMouseEnter={(e) =>
                                                    (e.currentTarget.style.backgroundColor =
                                                        "var(--color-bg-alt)")
                                                }
                                                onMouseLeave={(e) =>
                                                    (e.currentTarget.style.backgroundColor =
                                                        "transparent")
                                                }
                                            >
                                                <td
                                                    style={{
                                                        ...td,
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {l.email_attempted}
                                                </td>
                                                <td style={td}>
                                                    <span
                                                        className="badge"
                                                        style={
                                                            l.success
                                                                ? {
                                                                      backgroundColor:
                                                                          "#DCFCE7",
                                                                      color: "#15803D",
                                                                  }
                                                                : {
                                                                      backgroundColor:
                                                                          "#FEE2E2",
                                                                      color: "#B91C1C",
                                                                  }
                                                        }
                                                    >
                                                        {l.success
                                                            ? "Success"
                                                            : "Failed"}
                                                    </span>
                                                </td>
                                                <td
                                                    style={{
                                                        ...td,
                                                        color: "var(--color-text-muted)",
                                                        fontFamily: "monospace",
                                                    }}
                                                >
                                                    {l.ip_address}
                                                </td>
                                                <td
                                                    style={{
                                                        ...td,
                                                        color: "var(--color-text-muted)",
                                                    }}
                                                >
                                                    {new Date(
                                                        l.created_at,
                                                    ).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                        {loginLogs.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    style={{
                                                        ...td,
                                                        textAlign: "center",
                                                        color: "var(--color-text-muted)",
                                                        padding: "3rem",
                                                    }}
                                                >
                                                    No login logs found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}

                            {/* Session Logs Table */}
                            {tab === "sessions" && (
                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                    }}
                                >
                                    <thead>
                                        <tr>
                                            <th style={th}>Email</th>
                                            <th style={th}>Session ID</th>
                                            <th style={th}>Login</th>
                                            <th style={th}>Logout</th>
                                            <th style={th}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sessionLogs.map((s) => (
                                            <tr
                                                key={s.id}
                                                onMouseEnter={(e) =>
                                                    (e.currentTarget.style.backgroundColor =
                                                        "var(--color-bg-alt)")
                                                }
                                                onMouseLeave={(e) =>
                                                    (e.currentTarget.style.backgroundColor =
                                                        "transparent")
                                                }
                                            >
                                                <td
                                                    style={{
                                                        ...td,
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {s.user?.email ?? "—"}
                                                </td>
                                                <td
                                                    style={{
                                                        ...td,
                                                        fontFamily: "monospace",
                                                        fontSize: "0.75rem",
                                                        color: "var(--color-text-muted)",
                                                    }}
                                                >
                                                    {s.session_id.substring(
                                                        0,
                                                        16,
                                                    )}
                                                    ...
                                                </td>
                                                <td
                                                    style={{
                                                        ...td,
                                                        color: "var(--color-text-muted)",
                                                    }}
                                                >
                                                    {new Date(
                                                        s.login_time,
                                                    ).toLocaleString()}
                                                </td>
                                                <td
                                                    style={{
                                                        ...td,
                                                        color: "var(--color-text-muted)",
                                                    }}
                                                >
                                                    {s.logout_time
                                                        ? new Date(
                                                              s.logout_time,
                                                          ).toLocaleString()
                                                        : "—"}
                                                </td>
                                                <td style={td}>
                                                    <span
                                                        className="badge"
                                                        style={
                                                            s.logout_time
                                                                ? {
                                                                      backgroundColor:
                                                                          "#F1F5F9",
                                                                      color: "#475569",
                                                                  }
                                                                : {
                                                                      backgroundColor:
                                                                          "#DCFCE7",
                                                                      color: "#15803D",
                                                                  }
                                                        }
                                                    >
                                                        {s.logout_time
                                                            ? "Ended"
                                                            : "Active"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {sessionLogs.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    style={{
                                                        ...td,
                                                        textAlign: "center",
                                                        color: "var(--color-text-muted)",
                                                        padding: "3rem",
                                                    }}
                                                >
                                                    No session logs found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
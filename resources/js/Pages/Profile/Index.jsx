import { useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import MainLayout from "../../Layouts/MainLayout";

/**
 * Profile Page
 *
 * Shared profile page for all authenticated roles (admin, business, public).
 * Displays current user info and provides forms to update:
 *   - Security question, answer, and hint
 *   - Password (requires current password verification)
 *
 * Sections:
 *   - Identity card: email, role, status badges
 *   - Security question: update 2FA security question
 *   - Password: change password with strength meter
 *
 * Flash message displayed on successful update.
 * Each section independently expandable — collapsed by default.
 * Design tokens from app.css control all colors/fonts.
 */

// Password strength rules — mirrors backend validation
function getPasswordStrength(pw) {
    return [
        { pass: pw.length >= 8, label: "8+ chars" },
        { pass: /[A-Z]/.test(pw), label: "Uppercase" },
        { pass: /[a-z]/.test(pw), label: "Lowercase" },
        { pass: /[0-9]/.test(pw), label: "Number" },
        { pass: /[\W_]/.test(pw), label: "Special char" },
    ];
}

const strengthLabel = ["", "Feeble", "Weak", "Decent", "Strong", "Formidable"];
const strengthColor = [
    "",
    "#DC2626",
    "#EA580C",
    "#CA8A04",
    "#16A34A",
    "#D4A017",
];

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

export default function Profile({ user }) {
    const { flash } = usePage().props;

    const [editingSecurity, setEditingSecurity] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);

    // Security question form
    const securityForm = useForm({
        security_question: user.security_question,
        security_answer: "",
        security_hint: user.security_hint ?? "",
    });

    // Password change form
    const passwordForm = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const pwRules = getPasswordStrength(passwordForm.data.password);
    const pwScore = pwRules.filter((r) => r.pass).length;

    const handleSecuritySubmit = (e) => {
        e.preventDefault();
        securityForm.post("/profile/security", {
            onSuccess: () => setEditingSecurity(false),
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        passwordForm.post("/profile/password", {
            onSuccess: () => {
                setEditingPassword(false);
                passwordForm.reset();
            },
        });
    };

    // Reusable section card style
    const sectionCard = {
        ...{},
        marginBottom: "1.5rem",
    };

    return (
        <MainLayout>
            <div
                style={{
                    minHeight: "calc(100vh - 4rem)",
                    backgroundColor: "var(--color-bg-alt)",
                    padding: "3rem 1rem",
                }}
            >
                <div style={{ maxWidth: 560, margin: "0 auto" }}>
                    {/* Page heading */}
                    <div style={{ marginBottom: "2rem" }}>
                        <h1
                            style={{
                                fontFamily: "var(--font-heading)",
                                fontWeight: 700,
                                fontSize: "2rem",
                                color: "var(--color-secondary)",
                                marginBottom: "0.25rem",
                            }}
                        >
                            My Profile
                        </h1>
                        <p
                            style={{
                                fontFamily: "var(--font-body)",
                                color: "var(--color-text-muted)",
                                fontSize: "0.95rem",
                            }}
                        >
                            Manage your Golden Sky account
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

                    {/* Identity Card */}
                    <div className="card" style={sectionCard}>
                        <p
                            style={{
                                fontFamily: "var(--font-body)",
                                fontWeight: 700,
                                fontSize: "0.7rem",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                color: "var(--color-text-muted)",
                                marginBottom: "1rem",
                            }}
                        >
                            Account Identity
                        </p>

                        <p
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "1.05rem",
                                color: "var(--color-text)",
                                fontWeight: 600,
                                marginBottom: "0.75rem",
                            }}
                        >
                            {user.email}
                        </p>

                        <div
                            style={{
                                display: "flex",
                                gap: "0.5rem",
                                flexWrap: "wrap",
                            }}
                        >
                            {/* Role badge */}
                            <span
                                className="badge"
                                style={roleBadgeStyle[user.role]}
                            >
                                {user.role}
                            </span>
                            {/* Status badge */}
                            <span
                                className="badge"
                                style={statusBadgeStyle[user.status]}
                            >
                                {user.status}
                            </span>
                        </div>
                    </div>

                    {/* Security Question Section */}
                    <div className="card" style={sectionCard}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: editingSecurity ? "1.25rem" : 0,
                            }}
                        >
                            <p
                                style={{
                                    fontFamily: "var(--font-body)",
                                    fontWeight: 700,
                                    fontSize: "0.7rem",
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    color: "var(--color-text-muted)",
                                }}
                            >
                                Security Question
                            </p>
                            {!editingSecurity && (
                                <button
                                    onClick={() => setEditingSecurity(true)}
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: "0.8rem",
                                        fontWeight: 700,
                                        color: "var(--color-secondary)",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: "0.25rem 0.5rem",
                                        borderRadius: "var(--radius)",
                                        transition: "background 0.2s",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.target.style.backgroundColor =
                                            "var(--color-bg-alt)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.target.style.backgroundColor =
                                            "transparent")
                                    }
                                >
                                    Update
                                </button>
                            )}
                        </div>

                        {!editingSecurity ? (
                            <div style={{ marginTop: "0.75rem" }}>
                                <p
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: "0.95rem",
                                        color: "var(--color-text)",
                                        lineHeight: 1.6,
                                        marginBottom: user.security_hint
                                            ? "0.75rem"
                                            : 0,
                                    }}
                                >
                                    {user.security_question}
                                </p>
                                {user.security_hint && (
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                            paddingTop: "0.75rem",
                                            borderTop:
                                                "1px solid var(--color-border)",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontFamily: "var(--font-body)",
                                                fontWeight: 700,
                                                fontSize: "0.7rem",
                                                letterSpacing: "0.1em",
                                                textTransform: "uppercase",
                                                color: "var(--color-text-muted)",
                                                flexShrink: 0,
                                            }}
                                        >
                                            Hint
                                        </span>
                                        <span
                                            style={{
                                                fontFamily: "var(--font-body)",
                                                fontSize: "0.875rem",
                                                color: "var(--color-text-muted)",
                                                filter: "blur(4px)",
                                                transition: "filter 0.3s",
                                                cursor: "default",
                                                userSelect: "none",
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.target.style.filter = "none")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.target.style.filter =
                                                    "blur(4px)")
                                            }
                                        >
                                            {user.security_hint}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSecuritySubmit}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "1.25rem",
                                }}
                            >
                                <div>
                                    <label className="input-label">
                                        New Question
                                    </label>
                                    <input
                                        type="text"
                                        value={
                                            securityForm.data.security_question
                                        }
                                        onChange={(e) =>
                                            securityForm.setData(
                                                "security_question",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Your security question"
                                        className="input-field"
                                    />
                                    {securityForm.errors.security_question && (
                                        <p className="error-text">
                                            {
                                                securityForm.errors
                                                    .security_question
                                            }
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="input-label">
                                        New Answer
                                    </label>
                                    <input
                                        type="password"
                                        value={
                                            securityForm.data.security_answer
                                        }
                                        onChange={(e) =>
                                            securityForm.setData(
                                                "security_answer",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="············"
                                        className="input-field"
                                    />
                                    {securityForm.errors.security_answer && (
                                        <p className="error-text">
                                            {
                                                securityForm.errors
                                                    .security_answer
                                            }
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="input-label">
                                        Hint{" "}
                                        <span
                                            style={{
                                                fontWeight: 400,
                                                textTransform: "none",
                                                letterSpacing: 0,
                                                color: "var(--color-text-muted)",
                                            }}
                                        >
                                            (optional)
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        value={securityForm.data.security_hint}
                                        onChange={(e) =>
                                            securityForm.setData(
                                                "security_hint",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="A subtle clue to help you remember"
                                        className="input-field"
                                    />
                                </div>

                                <div
                                    style={{ display: "flex", gap: "0.75rem" }}
                                >
                                    <button
                                        type="submit"
                                        disabled={securityForm.processing}
                                        className="btn-primary"
                                        style={{ flex: 1, padding: "0.625rem" }}
                                    >
                                        {securityForm.processing
                                            ? "Saving..."
                                            : "Save"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingSecurity(false);
                                            securityForm.clearErrors();
                                        }}
                                        className="btn-secondary"
                                        style={{ flex: 1, padding: "0.625rem" }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Password Section */}
                    <div className="card" style={sectionCard}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: editingPassword ? "1.25rem" : 0,
                            }}
                        >
                            <p
                                style={{
                                    fontFamily: "var(--font-body)",
                                    fontWeight: 700,
                                    fontSize: "0.7rem",
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    color: "var(--color-text-muted)",
                                }}
                            >
                                Password
                            </p>
                            {!editingPassword && (
                                <button
                                    onClick={() => setEditingPassword(true)}
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: "0.8rem",
                                        fontWeight: 700,
                                        color: "var(--color-secondary)",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: "0.25rem 0.5rem",
                                        borderRadius: "var(--radius)",
                                        transition: "background 0.2s",
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.target.style.backgroundColor =
                                            "var(--color-bg-alt)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.target.style.backgroundColor =
                                            "transparent")
                                    }
                                >
                                    Change
                                </button>
                            )}
                        </div>

                        {!editingPassword ? (
                            <p
                                style={{
                                    marginTop: "0.75rem",
                                    fontFamily: "var(--font-body)",
                                    color: "var(--color-text-muted)",
                                    fontSize: "1rem",
                                    letterSpacing: "0.15em",
                                }}
                            >
                                ············
                            </p>
                        ) : (
                            <form
                                onSubmit={handlePasswordSubmit}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "1.25rem",
                                }}
                            >
                                <div>
                                    <label className="input-label">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={
                                            passwordForm.data.current_password
                                        }
                                        onChange={(e) =>
                                            passwordForm.setData(
                                                "current_password",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="············"
                                        className="input-field"
                                        autoComplete="current-password"
                                    />
                                    {passwordForm.errors.current_password && (
                                        <p className="error-text">
                                            {
                                                passwordForm.errors
                                                    .current_password
                                            }
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="input-label">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.data.password}
                                        onChange={(e) =>
                                            passwordForm.setData(
                                                "password",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="············"
                                        className="input-field"
                                        autoComplete="new-password"
                                    />

                                    {/* Strength meter */}
                                    {passwordForm.data.password.length > 0 && (
                                        <div style={{ marginTop: "0.75rem" }}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.75rem",
                                                    marginBottom: "0.5rem",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        flex: 1,
                                                        height: 6,
                                                        backgroundColor:
                                                            "var(--color-border)",
                                                        borderRadius: 9999,
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            height: "100%",
                                                            width: `${(pwScore / 5) * 100}%`,
                                                            backgroundColor:
                                                                strengthColor[
                                                                    pwScore
                                                                ],
                                                            borderRadius: 9999,
                                                            transition:
                                                                "all 0.3s",
                                                        }}
                                                    />
                                                </div>
                                                <span
                                                    style={{
                                                        fontFamily:
                                                            "var(--font-body)",
                                                        fontSize: "0.75rem",
                                                        fontWeight: 700,
                                                        color:
                                                            strengthColor[
                                                                pwScore
                                                            ] ||
                                                            "var(--color-text-muted)",
                                                        minWidth: 70,
                                                    }}
                                                >
                                                    {strengthLabel[pwScore]}
                                                </span>
                                            </div>
                                            <div
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns:
                                                        "1fr 1fr",
                                                    gap: "0.25rem 1rem",
                                                }}
                                            >
                                                {pwRules.map((r) => (
                                                    <span
                                                        key={r.label}
                                                        style={{
                                                            fontFamily:
                                                                "var(--font-body)",
                                                            fontSize: "0.75rem",
                                                            color: r.pass
                                                                ? "var(--color-success)"
                                                                : "var(--color-text-muted)",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: "0.25rem",
                                                        }}
                                                    >
                                                        {r.pass ? "✓" : "○"}{" "}
                                                        {r.label}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {passwordForm.errors.password && (
                                        <p className="error-text">
                                            {passwordForm.errors.password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="input-label">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={
                                            passwordForm.data
                                                .password_confirmation
                                        }
                                        onChange={(e) =>
                                            passwordForm.setData(
                                                "password_confirmation",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="············"
                                        className="input-field"
                                        autoComplete="new-password"
                                    />
                                </div>

                                <div
                                    style={{ display: "flex", gap: "0.75rem" }}
                                >
                                    <button
                                        type="submit"
                                        disabled={passwordForm.processing}
                                        className="btn-primary"
                                        style={{ flex: 1, padding: "0.625rem" }}
                                    >
                                        {passwordForm.processing
                                            ? "Saving..."
                                            : "Save"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingPassword(false);
                                            passwordForm.reset();
                                            passwordForm.clearErrors();
                                        }}
                                        className="btn-secondary"
                                        style={{ flex: 1, padding: "0.625rem" }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

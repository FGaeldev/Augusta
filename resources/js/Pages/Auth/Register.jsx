import { useForm, Link } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";

/**
 * Register Page
 *
 * Handles new user registration for public and business roles.
 * Role selection determines account flow:
 *   public   → instant access after registration
 *   business → pending admin approval before login access
 *
 * Password strength meter mirrors backend validation rules.
 * Security question + answer collected at registration.
 * Answer hashed server-side — never stored plain text.
 *
 * Design tokens from app.css control all colors/fonts.
 */

// Password strength rules — mirrors backend Password::min(8)->mixedCase()->numbers()->symbols()
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

export default function Register({ errors }) {
    const { data, setData, post, processing } = useForm({
        email: "",
        password: "",
        password_confirmation: "",
        role: "public",
        security_question: "",
        security_answer: "",
        security_hint: "",
    });

    const pwRules = getPasswordStrength(data.password);
    const pwScore = pwRules.filter((r) => r.pass).length;

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/register");
    };

    return (
        <MainLayout>
            <div
                style={{
                    minHeight: "calc(100vh - 4rem)",
                    backgroundColor: "var(--color-bg-alt)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2rem 1rem",
                }}
            >
                <div style={{ width: "100%", maxWidth: 480 }}>
                    {/* Header */}
                    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                        <h1
                            style={{
                                fontFamily: "var(--font-heading)",
                                fontWeight: 700,
                                fontSize: "2rem",
                                color: "var(--color-secondary)",
                                marginBottom: "0.5rem",
                            }}
                        >
                            Create Account
                        </h1>
                        <p
                            style={{
                                fontFamily: "var(--font-body)",
                                color: "var(--color-text-muted)",
                                fontSize: "0.95rem",
                            }}
                        >
                            Join Golden Sky Travel & Tours
                        </p>
                    </div>

                    {/* Card */}
                    <div className="card">
                        <form
                            onSubmit={handleSubmit}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1.25rem",
                            }}
                        >
                            {/* Role Selection */}
                            <div>
                                <label className="input-label">
                                    Account Type
                                </label>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: "0.75rem",
                                    }}
                                >
                                    {[
                                        {
                                            value: "public",
                                            label: "🌍 Public",
                                            desc: "Instant access",
                                        },
                                        {
                                            value: "business",
                                            label: "🏢 Business",
                                            desc: "Requires approval",
                                        },
                                    ].map((r) => (
                                        <button
                                            key={r.value}
                                            type="button"
                                            onClick={() =>
                                                setData("role", r.value)
                                            }
                                            style={{
                                                padding: "0.875rem",
                                                border: `2px solid ${data.role === r.value ? "var(--color-primary)" : "var(--color-border)"}`,
                                                borderRadius: "var(--radius)",
                                                backgroundColor:
                                                    data.role === r.value
                                                        ? "var(--color-primary-light)"
                                                        : "var(--color-bg)",
                                                cursor: "pointer",
                                                textAlign: "center",
                                                transition: "all 0.2s",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontFamily:
                                                        "var(--font-body)",
                                                    fontWeight: 700,
                                                    fontSize: "0.875rem",
                                                    color:
                                                        data.role === r.value
                                                            ? "var(--color-primary-dark)"
                                                            : "var(--color-text)",
                                                    marginBottom: "0.25rem",
                                                }}
                                            >
                                                {r.label}
                                            </div>
                                            <div
                                                style={{
                                                    fontFamily:
                                                        "var(--font-body)",
                                                    fontSize: "0.75rem",
                                                    color: "var(--color-text-muted)",
                                                }}
                                            >
                                                {r.desc}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Business pending notice */}
                                {data.role === "business" && (
                                    <div
                                        className="alert-warning"
                                        style={{ marginTop: "0.75rem" }}
                                    >
                                        Business accounts require admin approval
                                        before you can log in.
                                    </div>
                                )}
                                {errors.role && (
                                    <p className="error-text">{errors.role}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="input-label">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    placeholder="your@email.com"
                                    className="input-field"
                                    autoComplete="email"
                                />
                                {errors.email && (
                                    <p className="error-text">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="input-label">Password</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    placeholder="············"
                                    className="input-field"
                                    autoComplete="new-password"
                                />

                                {/* Strength meter */}
                                {data.password.length > 0 && (
                                    <div style={{ marginTop: "0.75rem" }}>
                                        {/* Bar */}
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
                                                        transition: "all 0.3s",
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
                                        {/* Rules */}
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1fr",
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
                                                        alignItems: "center",
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
                                {errors.password && (
                                    <p className="error-text">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="input-label">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="············"
                                    className="input-field"
                                    autoComplete="new-password"
                                />
                            </div>

                            {/* Section divider */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                    margin: "0.25rem 0",
                                }}
                            >
                                <div
                                    style={{
                                        flex: 1,
                                        height: 1,
                                        backgroundColor: "var(--color-border)",
                                    }}
                                />
                                <span
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: "0.75rem",
                                        color: "var(--color-text-muted)",
                                        fontWeight: 700,
                                        letterSpacing: "0.05em",
                                        textTransform: "uppercase",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    Security Question
                                </span>
                                <div
                                    style={{
                                        flex: 1,
                                        height: 1,
                                        backgroundColor: "var(--color-border)",
                                    }}
                                />
                            </div>

                            {/* Security Question */}
                            <div>
                                <label className="input-label">
                                    Your Question
                                </label>
                                <input
                                    type="text"
                                    value={data.security_question}
                                    onChange={(e) =>
                                        setData(
                                            "security_question",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="e.g. Name of your first pet"
                                    className="input-field"
                                />
                                {errors.security_question && (
                                    <p className="error-text">
                                        {errors.security_question}
                                    </p>
                                )}
                            </div>

                            {/* Security Answer */}
                            <div>
                                <label className="input-label">Answer</label>
                                <input
                                    type="password"
                                    value={data.security_answer}
                                    onChange={(e) =>
                                        setData(
                                            "security_answer",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="············"
                                    className="input-field"
                                />
                                {errors.security_answer && (
                                    <p className="error-text">
                                        {errors.security_answer}
                                    </p>
                                )}
                            </div>

                            {/* Security Hint */}
                            <div>
                                <label className="input-label">
                                    Hint{" "}
                                    <span
                                        style={{
                                            fontWeight: 400,
                                            textTransform: "none",
                                            letterSpacing: 0,
                                            color: "var(--color-text-muted)",
                                            fontSize: "0.75rem",
                                        }}
                                    >
                                        (optional)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={data.security_hint}
                                    onChange={(e) =>
                                        setData("security_hint", e.target.value)
                                    }
                                    placeholder="A subtle clue to help you remember"
                                    className="input-field"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-primary"
                                style={{ width: "100%", marginTop: "0.5rem" }}
                            >
                                {processing
                                    ? "Creating account..."
                                    : "Create Account"}
                            </button>
                        </form>

                        {/* Divider */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                                margin: "1.5rem 0",
                            }}
                        >
                            <div
                                style={{
                                    flex: 1,
                                    height: 1,
                                    backgroundColor: "var(--color-border)",
                                }}
                            />
                            <span
                                style={{
                                    color: "var(--color-text-muted)",
                                    fontSize: "0.8rem",
                                }}
                            >
                                ✦
                            </span>
                            <div
                                style={{
                                    flex: 1,
                                    height: 1,
                                    backgroundColor: "var(--color-border)",
                                }}
                            />
                        </div>

                        {/* Login link */}
                        <p
                            style={{
                                textAlign: "center",
                                fontFamily: "var(--font-body)",
                                fontSize: "0.9rem",
                                color: "var(--color-text-muted)",
                            }}
                        >
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                style={{
                                    color: "var(--color-secondary)",
                                    fontWeight: 700,
                                    textDecoration: "none",
                                }}
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

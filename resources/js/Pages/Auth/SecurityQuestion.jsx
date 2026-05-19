import { useForm } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";

/**
 * SecurityQuestion Page — Step 2 of two-factor authentication.
 *
 * Displays the user's registered security question and optional hint.
 * Collects answer and submits for verification against bcrypt hash.
 *
 * Hint reveal — blurred by default, revealed on hover.
 * Prevents casual shoulder-surfing while keeping hint accessible.
 *
 * Only accessible after Step 1 (password) completes.
 * Backend redirects to login if pending_user_id session missing.
 *
 * On success — backend redirects based on role:
 *   admin    -> /admin
 *   business -> /profile
 *   public   -> /profile
 *
 * Design tokens from app.css control all colors/fonts.
 */
export default function SecurityQuestion({ question, hint, errors }) {
    const { data, setData, post, processing } = useForm({
        answer: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/security-question");
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
                <div style={{ width: "100%", maxWidth: 440 }}>
                    {/* Header */}
                    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                        {/* Eagle icon — SVG instead of emoji */}
                        <div
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: "50%",
                                backgroundColor: "var(--color-secondary)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 1rem",
                            }}
                        >
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="var(--color-primary)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <h1
                            style={{
                                fontFamily: "var(--font-heading)",
                                fontWeight: 700,
                                fontSize: "2rem",
                                color: "var(--color-secondary)",
                                marginBottom: "0.5rem",
                            }}
                        >
                            Verify Identity
                        </h1>
                        <p
                            style={{
                                fontFamily: "var(--font-body)",
                                color: "var(--color-text-muted)",
                                fontSize: "0.95rem",
                            }}
                        >
                            Answer your security question to continue
                        </p>
                    </div>

                    {/* Card */}
                    <div className="card">
                        {/* Question block */}
                        <div
                            style={{
                                backgroundColor: "var(--color-bg-alt)",
                                border: "1.5px solid var(--color-border)",
                                borderRadius: "var(--radius)",
                                padding: "1.25rem",
                                marginBottom: "1.5rem",
                            }}
                        >
                            <p
                                style={{
                                    fontFamily: "var(--font-body)",
                                    fontWeight: 700,
                                    fontSize: "0.7rem",
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    color: "var(--color-primary-dark)",
                                    marginBottom: "0.5rem",
                                }}
                            >
                                Your Security Question
                            </p>
                            <p
                                style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: "1rem",
                                    color: "var(--color-text)",
                                    lineHeight: 1.6,
                                    marginBottom: hint ? "0.75rem" : 0,
                                }}
                            >
                                {question}
                            </p>

                            {/* Hint — blurred until hover */}
                            {hint && (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        paddingTop: "0.5rem",
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
                                        title={hint}
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
                                        {hint}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1.25rem",
                            }}
                        >
                            <div>
                                <label className="input-label">
                                    Your Answer
                                </label>
                                <input
                                    type="text"
                                    value={data.answer}
                                    onChange={(e) =>
                                        setData("answer", e.target.value)
                                    }
                                    placeholder="Enter your answer"
                                    className="input-field"
                                    autoComplete="off"
                                    autoFocus
                                />
                                {errors.answer && (
                                    <p className="error-text">
                                        {errors.answer}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-primary"
                                style={{ width: "100%" }}
                            >
                                {processing
                                    ? "Verifying..."
                                    : "Confirm Identity"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

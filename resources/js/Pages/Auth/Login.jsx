import { useForm, Link } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";

/**
 * Login Page — Step 1 of two-factor authentication.
 *
 * Collects email and password only.
 * On success, backend sets pending_user_id in session
 * and redirects to /security-question (Step 2).
 *
 * Security features reflected in UI:
 *   - Generic error message (prevents user enumeration)
 *   - Lockout message with remaining seconds
 *   - Pending/rejected account messages
 *
 * Flash message from registration shown at top.
 * Design tokens from app.css control all colors/fonts.
 */
export default function Login({ message, errors }) {
    const { data, setData, post, processing } = useForm({
        email: "",
        password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/login");
    };

    return (
        <MainLayout>
            {/* Page wrapper — light bg, centered card */}
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
                        <h1
                            style={{
                                fontFamily: "var(--font-heading)",
                                fontWeight: 700,
                                fontSize: "2rem",
                                color: "var(--color-secondary)",
                                marginBottom: "0.5rem",
                            }}
                        >
                            Welcome Back
                        </h1>
                        <p
                            style={{
                                fontFamily: "var(--font-body)",
                                color: "var(--color-text-muted)",
                                fontSize: "0.95rem",
                            }}
                        >
                            Sign in to your Golden Sky account
                        </p>
                    </div>

                    {/* Card */}
                    <div className="card">
                        {/* Flash message from registration */}
                        {message && (
                            <div
                                className="alert-info"
                                style={{ marginBottom: "1.5rem" }}
                            >
                                {message}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1.25rem",
                            }}
                        >
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
                                    autoComplete="current-password"
                                />
                                {errors.password && (
                                    <p className="error-text">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-primary"
                                style={{ width: "100%", marginTop: "0.5rem" }}
                            >
                                {processing ? "Signing in..." : "Sign In"}
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
                                    fontFamily: "var(--font-body)",
                                    fontSize: "0.8rem",
                                    color: "var(--color-text-muted)",
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

                        {/* Register link */}
                        <p
                            style={{
                                textAlign: "center",
                                fontFamily: "var(--font-body)",
                                fontSize: "0.9rem",
                                color: "var(--color-text-muted)",
                            }}
                        >
                            No account yet?{" "}
                            <Link
                                href="/register"
                                style={{
                                    color: "var(--color-secondary)",
                                    fontWeight: 700,
                                    textDecoration: "none",
                                }}
                            >
                                Create one here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

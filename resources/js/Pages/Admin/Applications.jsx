import { useState } from "react";
import { useForm, usePage, router } from "@inertiajs/react";
import MainLayout from "../../Layouts/MainLayout";

/**
 * Admin Applications Page
 *
 * Displays all business account applications for admin review.
 * Admins can approve or reject pending applications.
 *
 * Application status flow:
 *   pending  -> admin reviews -> approved or rejected
 *   approved -> user status set to active -> account accessible
 *   rejected -> user status set to rejected -> account blocked
 *
 * Rejection requires notes field — reason must be recorded.
 * Approval notes optional.
 *
 * Approved/rejected applications remain visible for audit trail.
 * Design tokens from app.css control all colors/fonts.
 */

// Application status badge styles
const statusBadgeStyle = {
    pending: { backgroundColor: "#FEF3C7", color: "#92400E" },
    approved: { backgroundColor: "#DCFCE7", color: "#15803D" },
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

/**
 * RejectModal
 *
 * Inline modal for collecting rejection notes.
 * Notes required — backend validates presence before rejecting.
 * Renders outside table to avoid z-index issues.
 */
function RejectModal({ application, onClose }) {
    const { data, setData, post, processing, errors } = useForm({
        notes: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/admin/applications/${application.id}/reject`, {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
            }}
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(15,30,69,0.5)",
                    backdropFilter: "blur(4px)",
                }}
            />

            {/* Modal card */}
            <div
                className="card"
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: 460,
                    zIndex: 10,
                }}
            >
                {/* Header */}
                <div style={{ marginBottom: "1.5rem" }}>
                    <h2
                        style={{
                            fontFamily: "var(--font-heading)",
                            fontWeight: 700,
                            fontSize: "1.5rem",
                            color: "var(--color-secondary)",
                            marginBottom: "0.25rem",
                        }}
                    >
                        Reject Application
                    </h2>
                    <p
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.9rem",
                            color: "var(--color-text-muted)",
                        }}
                    >
                        {application.user?.email}
                    </p>
                </div>

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
                            Reason for Rejection
                        </label>
                        <textarea
                            value={data.notes}
                            onChange={(e) => setData("notes", e.target.value)}
                            placeholder="Provide reason for rejection..."
                            rows={4}
                            className="input-field"
                            style={{ resize: "vertical" }}
                        />
                        {errors.notes && (
                            <p className="error-text">{errors.notes}</p>
                        )}
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button
                            type="submit"
                            disabled={processing}
                            className="btn-danger"
                            style={{ flex: 1, padding: "0.625rem" }}
                        >
                            {processing ? "Rejecting..." : "Confirm Reject"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary"
                            style={{ flex: 1, padding: "0.625rem" }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function Applications({ applications }) {
    const { flash } = usePage().props;
    const [rejectTarget, setRejectTarget] = useState(null);

    const handleApprove = (application) => {
        if (!confirm(`Approve application for ${application.user?.email}?`))
            return;
        router.post(`/admin/applications/${application.id}/approve`);
    };

    const pendingCount = applications.filter(
        (a) => a.status === "pending",
    ).length;
    const approvedCount = applications.filter(
        (a) => a.status === "approved",
    ).length;
    const rejectedCount = applications.filter(
        (a) => a.status === "rejected",
    ).length;

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
                            Business Applications
                        </h1>
                        <p
                            style={{
                                fontFamily: "var(--font-body)",
                                color: "var(--color-text-muted)",
                                fontSize: "0.95rem",
                            }}
                        >
                            Review and manage business account applications.
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
                                "repeat(auto-fit, minmax(150px, 1fr))",
                            gap: "1rem",
                            marginBottom: "2rem",
                        }}
                    >
                        {[
                            {
                                label: "Total",
                                value: applications.length,
                                style: {
                                    backgroundColor: "#EFF6FF",
                                    color: "#1D4ED8",
                                },
                            },
                            {
                                label: "Pending",
                                value: pendingCount,
                                style: {
                                    backgroundColor: "#FEF3C7",
                                    color: "#92400E",
                                },
                            },
                            {
                                label: "Approved",
                                value: approvedCount,
                                style: {
                                    backgroundColor: "#DCFCE7",
                                    color: "#15803D",
                                },
                            },
                            {
                                label: "Rejected",
                                value: rejectedCount,
                                style: {
                                    backgroundColor: "#FEE2E2",
                                    color: "#B91C1C",
                                },
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
                                <span className="badge" style={s.style}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Table card */}
                    <div
                        className="card"
                        style={{ padding: 0, overflow: "hidden" }}
                    >
                        <div
                            style={{
                                overflowX: "auto",
                                maxHeight: "65vh",
                                overflowY: "auto",
                            }}
                        >
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
                                        <th style={th}>Status</th>
                                        <th style={th}>Applied</th>
                                        <th style={th}>Notes</th>
                                        <th style={th}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                style={{
                                                    ...td,
                                                    textAlign: "center",
                                                    color: "var(--color-text-muted)",
                                                    padding: "3rem",
                                                }}
                                            >
                                                No applications found.
                                            </td>
                                        </tr>
                                    )}
                                    {applications.map((a) => (
                                        <tr
                                            key={a.id}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.backgroundColor =
                                                    "var(--color-bg-alt)")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.backgroundColor =
                                                    "transparent")
                                            }
                                        >
                                            <td style={td}>{a.id}</td>
                                            <td
                                                style={{
                                                    ...td,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {a.user?.email ?? "—"}
                                            </td>
                                            <td style={td}>
                                                <span
                                                    className="badge"
                                                    style={
                                                        statusBadgeStyle[
                                                            a.status
                                                        ]
                                                    }
                                                >
                                                    {a.status}
                                                </span>
                                            </td>
                                            <td
                                                style={{
                                                    ...td,
                                                    color: "var(--color-text-muted)",
                                                }}
                                            >
                                                {new Date(
                                                    a.created_at,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td
                                                style={{
                                                    ...td,
                                                    color: "var(--color-text-muted)",
                                                    maxWidth: 200,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {a.notes ?? "—"}
                                            </td>
                                            <td style={td}>
                                                {a.status === "pending" ? (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "0.5rem",
                                                        }}
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                handleApprove(a)
                                                            }
                                                            style={{
                                                                padding:
                                                                    "0.375rem 0.875rem",
                                                                backgroundColor:
                                                                    "#15803D",
                                                                color: "white",
                                                                border: "none",
                                                                borderRadius:
                                                                    "var(--radius)",
                                                                fontFamily:
                                                                    "var(--font-body)",
                                                                fontWeight: 700,
                                                                fontSize:
                                                                    "0.75rem",
                                                                letterSpacing:
                                                                    "0.05em",
                                                                textTransform:
                                                                    "uppercase",
                                                                cursor: "pointer",
                                                                transition:
                                                                    "background 0.2s",
                                                            }}
                                                            onMouseEnter={(e) =>
                                                                (e.target.style.backgroundColor =
                                                                    "#166534")
                                                            }
                                                            onMouseLeave={(e) =>
                                                                (e.target.style.backgroundColor =
                                                                    "#15803D")
                                                            }
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                setRejectTarget(
                                                                    a,
                                                                )
                                                            }
                                                            style={{
                                                                padding:
                                                                    "0.375rem 0.875rem",
                                                                backgroundColor:
                                                                    "transparent",
                                                                color: "#B91C1C",
                                                                border: "1.5px solid #B91C1C",
                                                                borderRadius:
                                                                    "var(--radius)",
                                                                fontFamily:
                                                                    "var(--font-body)",
                                                                fontWeight: 700,
                                                                fontSize:
                                                                    "0.75rem",
                                                                letterSpacing:
                                                                    "0.05em",
                                                                textTransform:
                                                                    "uppercase",
                                                                cursor: "pointer",
                                                                transition:
                                                                    "all 0.2s",
                                                            }}
                                                            onMouseEnter={(
                                                                e,
                                                            ) => {
                                                                e.target.style.backgroundColor =
                                                                    "#FEE2E2";
                                                            }}
                                                            onMouseLeave={(
                                                                e,
                                                            ) => {
                                                                e.target.style.backgroundColor =
                                                                    "transparent";
                                                            }}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span
                                                        style={{
                                                            fontFamily:
                                                                "var(--font-body)",
                                                            fontSize: "0.8rem",
                                                            color: "var(--color-text-muted)",
                                                            fontStyle: "italic",
                                                        }}
                                                    >
                                                        Reviewed
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reject modal — outside table to avoid z-index issues */}
            {rejectTarget && (
                <RejectModal
                    application={rejectTarget}
                    onClose={() => setRejectTarget(null)}
                />
            )}
        </MainLayout>
    );
}

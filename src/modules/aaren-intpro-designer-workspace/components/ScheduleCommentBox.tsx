"use client";

import React, { useState } from "react";
import { ScheduleCommentData } from "../types/workspace";
import { MessageSquare, Send } from "lucide-react";

interface ScheduleCommentBoxProps {
  scheduleItemId: string;
  comments: ScheduleCommentData[];
  onAddComment: (itemId: string, text: string) => Promise<void>;
}

export default function ScheduleCommentBox({
  scheduleItemId,
  comments,
  onAddComment,
}: ScheduleCommentBoxProps) {
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      await onAddComment(scheduleItemId, commentText.trim());
      setCommentText("");
      setError(null);
    } catch (err) {
      console.error("Failed to post comment:", err);
      setError("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        background: "#F4EFE6",
        borderRadius: "1rem",
        padding: "1.6rem",
        border: "1px solid rgba(129, 102, 63, 0.2)",
        display: "flex",
        flexDirection: "column",
        gap: "1.4rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "1.2rem", fontWeight: 800, color: "#81663F", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        <MessageSquare size={15} /> Threaded Specification Notes ({comments.length})
      </div>

      {/* Discussion List */}
      <div style={{ maxHeight: "240px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem", paddingRight: "0.4rem" }}>
        {comments.length === 0 ? (
          <p style={{ fontSize: "1.2rem", color: "#5E5852", fontStyle: "italic", margin: "0.4rem 0" }}>
            No comments or revision notes yet. Post a question or feedback below.
          </p>
        ) : (
          comments.map((c) => {
            const isClient = c.authorRole === "CLIENT";
            return (
              <div
                key={c.id}
                style={{
                  background: isClient ? "#FFFFFF" : "#FAF9F6",
                  border: isClient ? "1px solid rgba(129, 102, 63, 0.2)" : "1px solid rgba(129, 102, 63, 0.35)",
                  borderRadius: "0.8rem",
                  padding: "1rem 1.2rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1C1917" }}>{c.authorName}</span>
                    <span
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 800,
                        padding: "0.2rem 0.6rem",
                        borderRadius: "999px",
                        background: isClient ? "rgba(129, 102, 63, 0.12)" : "rgba(30, 27, 22, 0.12)",
                        color: isClient ? "#81663F" : "#1E1B16",
                        textTransform: "uppercase",
                      }}
                    >
                      {c.authorRole}
                    </span>
                  </div>
                  <span style={{ fontSize: "1rem", color: "rgba(0,0,0,0.4)" }}>
                    {new Date(c.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p style={{ fontSize: "1.25rem", color: "#2E2A25", margin: 0, lineHeight: 1.45, whiteSpace: "pre-wrap" }}>
                  {c.content}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.8rem" }}>
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Ask a question or request finish sample..."
          style={{
            flex: 1,
            padding: "0.8rem 1.2rem",
            borderRadius: "0.6rem",
            border: "1px solid rgba(129, 102, 63, 0.3)",
            background: "#FFFFFF",
            fontSize: "1.25rem",
            color: "#1C1917",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={submitting || !commentText.trim()}
          style={{
            background: "#81663F",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "0.6rem",
            padding: "0.8rem 1.4rem",
            fontSize: "1.2rem",
            fontWeight: 700,
            cursor: submitting || !commentText.trim() ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <Send size={13} />
          <span>{submitting ? "..." : "Send"}</span>
        </button>
      </form>
      {error && (
        <div style={{ color: "#DC2626", fontSize: "1.1rem", marginTop: "0.4rem" }}>
          {error}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ScheduleItemData, ScheduleStatus } from "../types/workspace";
import ScheduleCommentBox from "./ScheduleCommentBox";
import { CheckCircle2, XCircle, AlertCircle, Clock, Eye, Filter } from "lucide-react";

interface ScheduleApprovalManagerProps {
  items: ScheduleItemData[];
  onUpdateStatus: (itemId: string, status: ScheduleStatus, comment?: string) => Promise<void>;
  onAddComment: (itemId: string, text: string) => Promise<void>;
}

export default function ScheduleApprovalManager({
  items,
  onUpdateStatus,
  onAddComment,
}: ScheduleApprovalManagerProps) {
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>("ALL");
  const [activeRoomFilter, setActiveRoomFilter] = useState<string>("ALL");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const selectedItemForModal = selectedItemId ? items.find(i => i.id === selectedItemId) || null : null;
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Close modal on Escape key (M6 fix)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedItemId) {
        setSelectedItemId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItemId]);

  // Extract unique rooms
  const rooms = Array.from(new Set(items.map((i) => i.room || "General").filter(Boolean)));

  // Filtered items
  const filteredItems = items.filter((item) => {
    const statusMatch = activeStatusFilter === "ALL" || item.status === activeStatusFilter;
    const roomMatch = activeRoomFilter === "ALL" || (item.room || "General") === activeRoomFilter;
    return statusMatch && roomMatch;
  });

  const getStatusBadge = (status: ScheduleStatus) => {
    switch (status) {
      case "APPROVED":
        return { label: "Approved", bg: "rgba(16, 185, 129, 0.15)", color: "#059669", icon: CheckCircle2 };
      case "NEEDS_REVIEW":
        return { label: "Needs Review", bg: "rgba(245, 158, 11, 0.15)", color: "#D97706", icon: AlertCircle };
      case "REJECTED":
        return { label: "Rejected", bg: "rgba(220, 38, 38, 0.15)", color: "#DC2626", icon: XCircle };
      default:
        return { label: "Pending Approval", bg: "rgba(129, 102, 63, 0.15)", color: "#81663F", icon: Clock };
    }
  };

  const handleAction = async (itemId: string, status: ScheduleStatus) => {
    setProcessingId(itemId);
    try {
      await onUpdateStatus(itemId, status, undefined);
    } catch (err) {
      console.error("Action error:", err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.4rem" }}>
      {/* Filter Toolbar */}
      <div
        style={{
          background: "#FAF9F6",
          border: "1px solid rgba(129, 102, 63, 0.2)",
          borderRadius: "1.2rem",
          padding: "1.6rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1.6rem",
        }}
      >
        {/* Status tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem" }}>
          {["ALL", "PENDING", "APPROVED", "NEEDS_REVIEW", "REJECTED"].map((st) => {
            const count = st === "ALL" ? items.length : items.filter((i) => i.status === st).length;
            const isActive = activeStatusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setActiveStatusFilter(st)}
                style={{
                  background: isActive ? "#81663F" : "#FFFFFF",
                  color: isActive ? "#FFFFFF" : "#5E5852",
                  border: "1px solid",
                  borderColor: isActive ? "#81663F" : "rgba(129, 102, 63, 0.25)",
                  borderRadius: "999px",
                  padding: "0.6rem 1.4rem",
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  transition: "all 0.2s ease",
                }}
              >
                <span>{st.replace("_", " ")}</span>
                <span
                  style={{
                    background: isActive ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.06)",
                    borderRadius: "999px",
                    padding: "0.1rem 0.5rem",
                    fontSize: "1rem",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Room dropdown filter */}
        {rooms.length > 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            <span style={{ fontSize: "1.15rem", fontWeight: 700, color: "#81663F", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              <Filter size={14} /> Room:
            </span>
            <select
              value={activeRoomFilter}
              onChange={(e) => setActiveRoomFilter(e.target.value)}
              style={{
                padding: "0.6rem 1.2rem",
                borderRadius: "0.6rem",
                border: "1px solid rgba(129, 102, 63, 0.3)",
                background: "#FFFFFF",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "#1C1917",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="ALL">All Rooms</option>
              {rooms.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Schedule Items List */}
      {filteredItems.length === 0 ? (
        <div
          style={{
            background: "#FAF9F6",
            borderRadius: "1.2rem",
            border: "1px solid rgba(129, 102, 63, 0.2)",
            padding: "5rem 2rem",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "1.5rem", color: "#81663F", fontWeight: 700, margin: "0 0 0.6rem" }}>
            No Specification Items Match Selected Filter
          </p>
          <button
            onClick={() => {
              setActiveStatusFilter("ALL");
              setActiveRoomFilter("ALL");
            }}
            style={{
              background: "#81663F",
              color: "#FFFFFF",
              border: "none",
              padding: "0.8rem 1.6rem",
              borderRadius: "0.6rem",
              fontSize: "1.2rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "2rem" }}>
          {filteredItems.map((item) => {
            const badge = getStatusBadge(item.status);
            const BadgeIcon = badge.icon;
            const isProcessing = processingId === item.id;
            const img = item.imageUrl || "/brands/brand_1_1.png";

            return (
              <div
                key={item.id}
                style={{
                  background: "#FAF9F6",
                  borderRadius: "1.2rem",
                  border: "1px solid rgba(129, 102, 63, 0.25)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.03)",
                  transition: "all 0.25s ease",
                }}
              >
                {/* 1920x1080 Aspect Ratio Image Container */}
                <div style={{ position: "relative", width: "100%", aspectRatio: "1920 / 1080", background: "#d8d4c8" }}>
                  <Image src={img} alt={item.name} fill style={{ objectFit: "cover" }} unoptimized />
                  <div
                    style={{
                      position: "absolute",
                      top: "1.2rem",
                      right: "1.2rem",
                      background: badge.bg,
                      color: badge.color,
                      backdropFilter: "blur(8px)",
                      border: `1px solid ${badge.color}40`,
                      borderRadius: "999px",
                      padding: "0.4rem 1rem",
                      fontSize: "1.1rem",
                      fontWeight: 800,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <BadgeIcon size={13} />
                    <span>{badge.label}</span>
                  </div>

                  {item.room && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "1.2rem",
                        left: "1.2rem",
                        background: "rgba(0, 0, 0, 0.75)",
                        backdropFilter: "blur(6px)",
                        color: "#FFFFFF",
                        padding: "0.3rem 0.8rem",
                        borderRadius: "0.4rem",
                        fontSize: "1.05rem",
                        fontWeight: 700,
                      }}
                    >
                      {item.room}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div style={{ padding: "2rem", display: "flex", flexDirection: "column", flex: 1, gap: "1.4rem" }}>
                  <div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#81663F", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.3rem" }}>
                      {item.category || "Specification"}
                    </div>
                    <h3 style={{ fontSize: "1.7rem", fontWeight: 700, color: "#1C1917", margin: 0 }}>
                      {item.name}
                    </h3>
                  </div>

                  {item.specs && (
                    <p style={{ fontSize: "1.25rem", color: "#5E5852", margin: 0, lineHeight: 1.5 }}>
                      {item.specs}
                    </p>
                  )}

                  {typeof item.price === 'number' ? (
                    <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#81663F" }}>
                      ₹{item.price.toLocaleString("en-IN")}
                      {item.quantity > 1 && <span style={{ fontSize: "1.1rem", fontWeight: 500, color: "#5E5852" }}> ({item.quantity} {item.unit || "units"})</span>}
                    </div>
                  ) : null}

                  {/* Actions Bar */}
                  <div
                    style={{
                      marginTop: "auto",
                      paddingTop: "1.4rem",
                      borderTop: "1px solid rgba(129, 102, 63, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.8rem",
                    }}
                  >
                    <button
                      onClick={() => setSelectedItemId(item.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#81663F",
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        textDecoration: "underline",
                      }}
                    >
                      <Eye size={14} /> Full Details & Notes ({item.comments?.length || 0})
                    </button>

                    {/* Quick Approve / Review buttons */}
                    <div style={{ display: "flex", gap: "0.6rem" }}>
                      {item.status !== "APPROVED" && (
                        <button
                          disabled={isProcessing}
                          onClick={() => handleAction(item.id, "APPROVED")}
                          style={{
                            background: "#059669",
                            color: "#FFFFFF",
                            border: "none",
                            padding: "0.6rem 1.2rem",
                            borderRadius: "0.6rem",
                            fontSize: "1.15rem",
                            fontWeight: 700,
                            cursor: isProcessing ? "not-allowed" : "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                          }}
                        >
                          <CheckCircle2 size={13} /> Approve
                        </button>
                      )}

                      {item.status !== "NEEDS_REVIEW" && (
                        <button
                          disabled={isProcessing}
                          onClick={() => handleAction(item.id, "NEEDS_REVIEW")}
                          style={{
                            background: "#D97706",
                            color: "#FFFFFF",
                            border: "none",
                            padding: "0.6rem 1.2rem",
                            borderRadius: "0.6rem",
                            fontSize: "1.15rem",
                            fontWeight: 700,
                            cursor: isProcessing ? "not-allowed" : "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.4rem",
                          }}
                        >
                          <AlertCircle size={13} /> Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for In-Depth Spec View, Threaded Discussion & Status Update */}
      {selectedItemForModal && (
        <div
          onClick={() => setSelectedItemId(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem 1.6rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "760px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#FAF9F6",
              borderRadius: "1.4rem",
              border: "1px solid rgba(129, 102, 63, 0.3)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              padding: "2.8rem",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#81663F", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {selectedItemForModal.room} • {selectedItemForModal.category}
                </span>
                <h2 style={{ fontSize: "2.2rem", fontWeight: 700, color: "#1C1917", margin: "0.4rem 0 0" }}>
                  {selectedItemForModal.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedItemId(null)}
                style={{ background: "none", border: "none", fontSize: "1.8rem", color: "#5E5852", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {/* Spec Image */}
            <div style={{ position: "relative", width: "100%", aspectRatio: "1920 / 1080", borderRadius: "0.8rem", overflow: "hidden", background: "#d8d4c8" }}>
              <Image src={selectedItemForModal.imageUrl || "/brands/brand_1_1.png"} alt={selectedItemForModal.name} fill style={{ objectFit: "cover" }} unoptimized />
            </div>

            {/* Spec Details & Dimensions */}
            <div style={{ background: "#FFFFFF", padding: "1.6rem", borderRadius: "0.8rem", border: "1px solid rgba(129, 102, 63, 0.15)" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#81663F", textTransform: "uppercase", marginBottom: "0.8rem" }}>
                Technical Specification
              </div>
              <p style={{ fontSize: "1.35rem", color: "#1C1917", margin: "0 0 1rem", lineHeight: 1.5 }}>
                {selectedItemForModal.specs || "Standard luxury finish specification."}
              </p>
              {selectedItemForModal.dimensions && (
                <div style={{ fontSize: "1.2rem", color: "#5E5852" }}>
                  <strong>Dimensions:</strong> {selectedItemForModal.dimensions}
                </div>
              )}
            </div>

            {/* Status Change Action Buttons */}
            {(() => {
              const isProcessing = processingId === selectedItemForModal.id;
              return (
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <button
                    disabled={isProcessing}
                    onClick={() => handleAction(selectedItemForModal.id, "APPROVED")}
                    style={{
                      flex: 1,
                      background: selectedItemForModal.status === "APPROVED" ? "#059669" : "#FAF9F6",
                      color: selectedItemForModal.status === "APPROVED" ? "#FFFFFF" : "#059669",
                      border: "2px solid #059669",
                      padding: "1rem",
                      borderRadius: "0.8rem",
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.6rem",
                      opacity: isProcessing ? 0.5 : 1,
                    }}
                  >
                    <CheckCircle2 size={16} /> Mark Approved
                  </button>

                  <button
                    disabled={isProcessing}
                    onClick={() => handleAction(selectedItemForModal.id, "NEEDS_REVIEW")}
                    style={{
                      flex: 1,
                      background: selectedItemForModal.status === "NEEDS_REVIEW" ? "#D97706" : "#FAF9F6",
                      color: selectedItemForModal.status === "NEEDS_REVIEW" ? "#FFFFFF" : "#D97706",
                      border: "2px solid #D97706",
                      padding: "1rem",
                      borderRadius: "0.8rem",
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.6rem",
                      opacity: isProcessing ? 0.5 : 1,
                    }}
                  >
                    <AlertCircle size={16} /> Request Changes
                  </button>

                  <button
                    disabled={isProcessing}
                    onClick={() => handleAction(selectedItemForModal.id, "REJECTED")}
                    style={{
                      flex: 1,
                      background: selectedItemForModal.status === "REJECTED" ? "#DC2626" : "#FAF9F6",
                      color: selectedItemForModal.status === "REJECTED" ? "#FFFFFF" : "#DC2626",
                      border: "2px solid #DC2626",
                      padding: "1rem",
                      borderRadius: "0.8rem",
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.6rem",
                      opacity: isProcessing ? 0.5 : 1,
                    }}
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              );
            })()}

            {/* Threaded comments */}
            <ScheduleCommentBox
              scheduleItemId={selectedItemForModal.id}
              comments={selectedItemForModal.comments || []}
              onAddComment={async (itemId, text) => {
                await onAddComment(itemId, text);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

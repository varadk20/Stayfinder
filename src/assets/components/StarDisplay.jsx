// src/components/StarDisplay.jsx
import React from "react";

/**
 * value: number (0-5)
 * size: font size (optional)
 * showNumber: boolean to show numeric (optional)
 */
export default function StarDisplay({ value = 0, size = 16, showNumber = true }) {
  const rounded = Math.round((Number(value) + Number.EPSILON) * 10) / 10; // one decimal
  const fullStars = Math.floor(rounded);
  const half = rounded - fullStars >= 0.5;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) stars.push("★");
    else if (i === fullStars + 1 && half) stars.push("★"); // use full star for half for simplicity
    else stars.push("☆");
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ fontSize: size, lineHeight: 1 }}>
        {stars.map((s, idx) => (
          <span key={idx} style={{ color: s === "★" ? "#FFD700" : "#DDD", marginRight: 2 }}>
            {s}
          </span>
        ))}
      </div>
      {showNumber && (
        <div style={{ fontSize: Math.max(12, size - 2), color: "#333" }}>
          {value ? rounded.toFixed(1) : "No ratings"}
        </div>
      )}
    </div>
  );
}

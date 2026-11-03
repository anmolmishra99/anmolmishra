import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "Anmol Mishra — AI/ML Engineer & Technical Lead (3+ Years Production AI, 2 Acquired SaaS)";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const avatarBase64 = await readFile(
  join(process.cwd(), "public/anmol-avatar.jpg"),
  "base64"
);
const avatarSrc = `data:image/jpeg;base64,${avatarBase64}`;

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#21232e",
          backgroundImage:
            "radial-gradient(circle at 80% 10%, rgba(16, 91, 255, 0.28) 0%, rgba(33, 35, 46, 0) 55%), radial-gradient(circle at 12% 85%, rgba(16, 91, 255, 0.18) 0%, rgba(33, 35, 46, 0) 50%)",
          color: "#f1f3f9",
          padding: "52px 64px 48px 64px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top Royal Blue Accent Line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #105bff 0%, #3b82f6 50%, #fe8500 100%)",
          }}
        />

        {/* Decorative Pixel Sky (Moon + Clouds + Stars in Top Right) */}
        <div
          style={{
            position: "absolute",
            top: "38px",
            right: "64px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Pixel Stars */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 5 5"
            style={{ marginRight: "22px", marginTop: "-28px" }}
          >
            <rect x="2" y="0" width="1" height="5" fill="#fde047" />
            <rect x="0" y="2" width="5" height="1" fill="#fde047" />
            <rect x="1" y="1" width="3" height="3" fill="#ffffff" />
          </svg>
          <svg
            width="14"
            height="14"
            viewBox="0 0 5 5"
            style={{ marginRight: "18px", marginTop: "24px" }}
          >
            <rect x="2" y="0" width="1" height="5" fill="#38bdf8" />
            <rect x="0" y="2" width="5" height="1" fill="#38bdf8" />
            <rect x="1" y="1" width="3" height="3" fill="#ffffff" />
          </svg>

          {/* Pixel Moon */}
          <svg
            width="54"
            height="54"
            viewBox="0 0 20 20"
            style={{ marginRight: "-18px", marginTop: "-14px" }}
          >
            <rect x="6" y="1" width="8" height="1" fill="#18181b" />
            <rect x="4" y="2" width="2" height="1" fill="#18181b" />
            <rect x="14" y="2" width="2" height="1" fill="#18181b" />
            <rect x="2" y="4" width="2" height="2" fill="#18181b" />
            <rect x="16" y="4" width="2" height="2" fill="#18181b" />
            <rect x="1" y="6" width="1" height="8" fill="#18181b" />
            <rect x="18" y="6" width="1" height="8" fill="#18181b" />
            <rect x="2" y="14" width="2" height="2" fill="#18181b" />
            <rect x="16" y="14" width="2" height="2" fill="#18181b" />
            <rect x="4" y="17" width="2" height="1" fill="#18181b" />
            <rect x="14" y="17" width="2" height="1" fill="#18181b" />
            <rect x="6" y="18" width="8" height="1" fill="#18181b" />
            <rect x="6" y="2" width="8" height="2" fill="#fef9c3" />
            <rect x="4" y="4" width="12" height="2" fill="#fef9c3" />
            <rect x="2" y="6" width="16" height="8" fill="#fef9c3" />
            <rect x="4" y="14" width="12" height="3" fill="#fef08a" />
            <rect x="6" y="17" width="8" height="1" fill="#fde047" />
            <rect x="5" y="7" width="3" height="3" fill="#eab308" />
            <rect x="12" y="6" width="2" height="2" fill="#facc15" />
            <rect x="10" y="11" width="4" height="3" fill="#eab308" />
          </svg>

          {/* Pixel Cloud */}
          <svg width="126" height="58" viewBox="0 0 46 22" style={{ marginTop: "8px" }}>
            <rect x="16" y="1" width="12" height="1" fill="#0f172a" />
            <rect x="13" y="2" width="3" height="2" fill="#0f172a" />
            <rect x="28" y="2" width="4" height="2" fill="#0f172a" />
            <rect x="6" y="5" width="8" height="1" fill="#0f172a" />
            <rect x="3" y="6" width="3" height="2" fill="#0f172a" />
            <rect x="32" y="4" width="8" height="1" fill="#0f172a" />
            <rect x="40" y="5" width="3" height="2" fill="#0f172a" />
            <rect x="1" y="8" width="2" height="10" fill="#0f172a" />
            <rect x="43" y="7" width="2" height="11" fill="#0f172a" />
            <rect x="3" y="18" width="3" height="2" fill="#0f172a" />
            <rect x="40" y="18" width="3" height="2" fill="#0f172a" />
            <rect x="6" y="20" width="34" height="2" fill="#0f172a" />
            <rect x="16" y="2" width="12" height="3" fill="#ffffff" />
            <rect x="13" y="4" width="18" height="3" fill="#ffffff" />
            <rect x="6" y="6" width="34" height="4" fill="#ffffff" />
            <rect x="3" y="8" width="40" height="4" fill="#ffffff" />
            <rect x="3" y="12" width="40" height="4" fill="#e0f2fe" />
            <rect x="5" y="16" width="36" height="2" fill="#bae6fd" />
            <rect x="5" y="18" width="36" height="2" fill="#7dd3fc" />
            <rect x="10" y="18" width="16" height="1" fill="#38bdf8" />
            <rect x="30" y="18" width="8" height="1" fill="#38bdf8" />
          </svg>
        </div>

        {/* SECTION 1: HERO PROFILE ROW */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Avatar Box with Royal Blue Border & Glow */}
          <div
            style={{
              width: "148px",
              height: "148px",
              borderRadius: "28px",
              overflow: "hidden",
              border: "3px solid #105bff",
              backgroundColor: "#1b1d26",
              boxShadow: "0 0 36px rgba(16, 91, 255, 0.45)",
              display: "flex",
              marginRight: "32px",
              flexShrink: 0,
            }}
          >
            <img
              src={avatarSrc}
              alt="Anmol Mishra"
              width="148"
              height="148"
              style={{
                objectFit: "cover",
                width: "148px",
                height: "148px",
              }}
            />
          </div>

          {/* Name, Verified Badge, Role, Pills */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "52px",
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.1,
                }}
              >
                Anmol Mishra
              </span>
              {/* Verified Checkmark SVG */}
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                style={{ marginLeft: "14px", marginTop: "2px" }}
              >
                <path
                  d="M12 1L9.27 3.32L5.69 2.87L4.41 6.29L1.13 7.84L2.09 11.31L0.5 14.59L3.18 17.03L3.58 20.63L7.15 21.05L9.36 23.91L12 22.61L14.64 23.91L16.85 21.05L20.42 20.63L20.82 17.03L23.5 14.59L21.91 11.31L22.87 7.84L19.59 6.29L18.31 2.87L14.73 3.32L12 1Z"
                  fill="#1d9bf0"
                />
                <path
                  d="M9.5 16.2L5.8 12.5L7.2 11.1L9.5 13.4L16.8 6.1L18.2 7.5L9.5 16.2Z"
                  fill="#ffffff"
                />
              </svg>
            </div>

            <div
              style={{
                fontSize: "23px",
                color: "#d4d4d8",
                marginTop: "8px",
                fontWeight: 500,
              }}
            >
              AI/ML Engineer · Full-Stack Developer · Technical Lead
            </div>

            {/* Highlight Pills */}
            <div style={{ display: "flex", alignItems: "center", marginTop: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "7px 18px",
                  borderRadius: "9999px",
                  backgroundColor: "#131b31",
                  border: "1.5px solid #2d3d6b",
                  color: "#8ea8f7",
                  fontSize: "16px",
                  fontWeight: 600,
                  marginRight: "14px",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5e82ff"
                  strokeWidth="2.2"
                  style={{ marginRight: "8px" }}
                >
                  <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
                </svg>
                <span>3+ Years Production AI</span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "7px 18px",
                  borderRadius: "9999px",
                  backgroundColor: "#271a12",
                  border: "1.5px solid #693d1b",
                  color: "#ffa347",
                  fontSize: "16px",
                  fontWeight: 600,
                  marginRight: "14px",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fe8500"
                  strokeWidth="2.2"
                  style={{ marginRight: "8px" }}
                >
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
                <span>2 Acquired SaaS (2024)</span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "7px 16px",
                  borderRadius: "9999px",
                  backgroundColor: "#1b1d26",
                  border: "1.5px solid #2e3242",
                  color: "#a1a1aa",
                  fontSize: "15px",
                  fontWeight: 500,
                }}
              >
                <span style={{ color: "#fe8500", marginRight: "6px" }}>●</span>
                <span>India</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: EDITORIAL MANIFESTO CALLOUT CARD */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#161a29",
            border: "1.5px solid #343b59",
            borderRadius: "20px",
            padding: "22px 28px",
            boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "52px",
              borderRadius: "9999px",
              background: "linear-gradient(180deg, #4f67ff 0%, #105bff 100%)",
              marginRight: "22px",
              flexShrink: 0,
            }}
          />
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.38,
            }}
          >
            Real-world AI isn&apos;t demo-ware. It&apos;s high-uptime, fault-tolerant infrastructure delivering measurable human impact.
          </div>
        </div>

        {/* SECTION 3: PRODUCTION IMPACT METRICS GRID */}
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          {/* Metric 1: AI Mitra */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "252px",
              backgroundColor: "#191c28",
              border: "1.5px solid #2b3248",
              borderRadius: "16px",
              padding: "16px 20px",
            }}
          >
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#60a5fa" }}>
              21,596+
            </div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#e4e4e7", marginTop: "4px" }}>
              Citizen AI Chats
            </div>
            <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
              AI Mitra · Smart City Govt
            </div>
          </div>

          {/* Metric 2: eSulabh */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "252px",
              backgroundColor: "#191c28",
              border: "1.5px solid #2b3248",
              borderRadius: "16px",
              padding: "16px 20px",
            }}
          >
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#ffa852" }}>
              Rs. 7,531 Cr
            </div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#e4e4e7", marginTop: "4px" }}>
              Compensation Tracked
            </div>
            <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
              eSulabh · 16,375 Land Records
            </div>
          </div>

          {/* Metric 3: Acquired SaaS */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "252px",
              backgroundColor: "#191c28",
              border: "1.5px solid #2b3248",
              borderRadius: "16px",
              padding: "16px 20px",
            }}
          >
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#60a5fa" }}>
              2 Exits
            </div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#e4e4e7", marginTop: "4px" }}>
              Acquired SaaS in 2024
            </div>
            <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
              toasty.ai &amp; launchpage.me
            </div>
          </div>

          {/* Metric 4: Payge & Vela */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "252px",
              backgroundColor: "#191c28",
              border: "1.5px solid #2b3248",
              borderRadius: "16px",
              padding: "16px 20px",
            }}
          >
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#ffa852" }}>
              100+ Stores
            </div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#e4e4e7", marginTop: "4px" }}>
              Payge &amp; vela.video
            </div>
            <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "2px" }}>
              Co-founder · AI Motion Engine
            </div>
          </div>
        </div>

        {/* SECTION 4: TECH STACK BADGES & FOOTER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1.5px solid #2e3242",
            paddingTop: "20px",
          }}
        >
          {/* Tech Badges */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {[
              { label: "RAG Pipelines", orange: false },
              { label: "LangChain", orange: false },
              { label: "CrewAI", orange: false },
              { label: "Next.js", orange: false },
              { label: "FastAPI", orange: false },
              { label: "Pinecone", orange: false },
              { label: "Voice AI", orange: true },
              { label: "Flutter", orange: false },
            ].map((badge, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  padding: "6px 13px",
                  borderRadius: "8px",
                  backgroundColor: badge.orange ? "#281b12" : "#1d233a",
                  border: badge.orange
                    ? "1.5px solid #7a461b"
                    : "1.5px solid #3c4a75",
                  color: badge.orange ? "#ffa852" : "#f1f5f9",
                  fontSize: "14px",
                  fontWeight: 600,
                  marginRight: "10px",
                }}
              >
                {badge.label}
              </div>
            ))}
          </div>

          {/* Domain & Pixel Sailboat */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <svg
              width="34"
              height="28"
              viewBox="0 0 38 32"
              style={{ marginRight: "10px" }}
            >
              <rect x="17" y="1" width="2" height="3" fill="#0f172a" />
              <rect x="19" y="1" width="5" height="2" fill="#fe8500" />
              <rect x="19" y="3" width="3" height="1" fill="#105bff" />
              <rect x="17" y="4" width="2" height="18" fill="#78350f" />
              <rect x="6" y="7" width="10" height="1" fill="#ffffff" />
              <rect x="5" y="8" width="11" height="9" fill="#ffffff" />
              <rect x="5" y="10" width="3" height="7" fill="#e0f2fe" />
              <rect x="21" y="9" width="3" height="8" fill="#ffffff" />
              <rect x="24" y="11" width="3" height="6" fill="#ffffff" />
              <rect x="4" y="20" width="30" height="2" fill="#fe8500" />
              <rect x="4" y="22" width="30" height="4" fill="#105bff" />
              <rect x="6" y="26" width="26" height="2" fill="#0c3cb0" />
              <rect x="8" y="23" width="2" height="2" fill="#fef08a" />
              <rect x="15" y="23" width="2" height="2" fill="#fef08a" />
              <rect x="22" y="23" width="2" height="2" fill="#fef08a" />
              <rect x="29" y="23" width="2" height="2" fill="#fef08a" />
            </svg>
            <span
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#8ea8f7",
                letterSpacing: "0.01em",
              }}
            >
              anmolmishra.dev
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}


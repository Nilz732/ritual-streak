import { useState, useEffect, useRef } from "react";
import Head from "next/head";

const TASK_TYPES = [
  { day: 1, label: "Meme", emoji: "😂", color: "#FF6B35", desc: "Drop a dank meme on Ritual" },
  { day: 2, label: "Art", emoji: "🎨", color: "#9B59B6", desc: "Share original artwork or creative visual" },
  { day: 3, label: "Thread", emoji: "🧵", color: "#3498DB", desc: "Write a thread about anything Ritual-related" },
  { day: 4, label: "Infographic", emoji: "📊", color: "#2ECC71", desc: "Create an infographic or data visual" },
  { day: 5, label: "Meme", emoji: "😂", color: "#FF6B35", desc: "Drop a dank meme on Ritual" },
  { day: 6, label: "Art", emoji: "🎨", color: "#9B59B6", desc: "Share original artwork or creative visual" },
  { day: 7, label: "Thread", emoji: "🧵", color: "#3498DB", desc: "Write a thread — recap your week!" },
];

const LEADERBOARD_DATA = [
  { rank: 1, name: "0xFlame", wallet: "0x1a2...b3c", streak: 47, points: 940, badge: "🏆" },
  { rank: 2, name: "RitualMax", wallet: "0x4d5...e6f", streak: 41, points: 820, badge: "🥈" },
  { rank: 3, name: "CryptoMuse", wallet: "0x7g8...h9i", streak: 38, points: 760, badge: "🥉" },
  { rank: 4, name: "Web3Artist", wallet: "0xj0k...l1m", streak: 29, points: 580, badge: "🔥" },
  { rank: 5, name: "MemeKing", wallet: "0xn2o...p3q", streak: 24, points: 480, badge: "⚡" },
  { rank: 6, name: "ThreadLord", wallet: "0xr4s...t5u", streak: 19, points: 380, badge: "✨" },
  { rank: 7, name: "DataViz", wallet: "0xv6w...x7y", streak: 15, points: 300, badge: "💎" },
];

const S = {
  body: {
    margin: 0, padding: 0,
    background: "#08080f", minHeight: "100vh",
    fontFamily: "Georgia, serif", color: "#fff",
  },
  app: { maxWidth: 520, margin: "0 auto", paddingBottom: 80 },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "20px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)",
    position: "sticky", top: 0, background: "rgba(8,8,15,0.97)", zIndex: 10,
  },
  logo: { fontSize: 20, fontWeight: "bold" },
  streakPill: {
    background: "rgba(255,107,53,0.15)", border: "1px solid rgba(255,107,53,0.3)",
    borderRadius: 100, padding: "6px 14px", fontSize: 13, color: "#FF6B35",
  },
  tabs: { display: "flex", padding: "16px 20px 0", borderBottom: "1px solid rgba(255,255,255,0.07)" },
  tab: (active) => ({
    background: "none", border: "none",
    borderBottom: active ? "2px solid #FF6B35" : "2px solid transparent",
    color: active ? "#FF6B35" : "rgba(255,255,255,0.35)",
    fontSize: 13, padding: "8px 16px 12px", cursor: "pointer", fontFamily: "Georgia, serif",
  }),
  content: { padding: 20, display: "flex", flexDirection: "column", gap: 16 },
  taskCard: (color) => ({
    background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
    border: `1px solid ${color}`, borderRadius: 20, padding: "28px 24px", textAlign: "center",
  }),
  dayBadge: {
    display: "inline-block", background: "rgba(255,255,255,0.08)",
    borderRadius: 100, padding: "4px 12px", fontSize: 12,
    color: "rgba(255,255,255,0.5)", marginBottom: 16,
  },
  taskEmoji: { fontSize: 52, marginBottom: 10 },
  taskTitle: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 6, margin: "0 0 6px 0" },
  taskDesc: { fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 20, lineHeight: 1.5, margin: "0 0 20px 0" },
  uploadZone: (hasFile, color) => ({
    border: `2px dashed ${hasFile ? color : "rgba(255,255,255,0.15)"}`,
    borderRadius: 14, padding: "20px 16px", cursor: "pointer",
    background: hasFile ? `${color}11` : "rgba(255,255,255,0.02)",
    marginBottom: 14, transition: "all 0.2s",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
  }),
  previewImg: {
    width: "100%", maxHeight: 180, objectFit: "cover",
    borderRadius: 10, marginBottom: 8,
  },
  checkinBtn: (color, disabled) => ({
    background: disabled ? "rgba(255,255,255,0.1)" : color,
    color: disabled ? "rgba(255,255,255,0.3)" : "#fff",
    border: "none", borderRadius: 12,
    padding: "14px 32px", fontSize: 15, fontWeight: "bold",
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "Georgia, serif", width: "100%", display: "block",
  }),
  doneBadge: {
    background: "rgba(46,204,113,0.1)", border: "1px solid rgba(46,204,113,0.3)",
    color: "#2ECC71", borderRadius: 12, padding: "14px 24px", fontSize: 14,
  },
  streakSection: {
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16, padding: 20,
  },
  sectionTitle: {
    fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 14,
    letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 14px 0",
  },
  streakDisplay: { display: "flex", alignItems: "center", gap: 16, marginBottom: 16 },
  streakNum: { fontSize: 48, fontWeight: "bold", lineHeight: 1, color: "#FF6B35", display: "block" },
  streakLabel: { fontSize: 13, color: "rgba(255,255,255,0.4)" },
  nextUp: {
    display: "flex", alignItems: "center", gap: 10,
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 12, padding: "12px 16px", fontSize: 14,
  },
  weekGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginTop: 10 },
  weekItem: (active, color) => ({
    background: active ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${active ? color : "rgba(255,255,255,0.07)"}`,
    borderRadius: 10, padding: "8px 4px", textAlign: "center",
    display: "flex", flexDirection: "column", gap: 3,
  }),
  lbRow: (rank) => ({
    display: "flex", alignItems: "center", gap: 14,
    background: rank === 1 ? "rgba(255,215,0,0.04)" : "rgba(255,255,255,0.02)",
    border: `1px solid ${rank === 1 ? "rgba(255,215,0,0.25)" : rank === 2 ? "rgba(192,192,192,0.2)" : rank === 3 ? "rgba(205,127,50,0.2)" : "rgba(255,255,255,0.06)"}`,
    borderRadius: 14, padding: "14px 16px",
  }),
  historyItem: (color) => ({
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
    borderLeft: `3px solid ${color}`, borderRadius: 12, padding: "12px 16px",
    display: "flex", flexDirection: "column", gap: 8,
  }),
  historyProof: {
    width: "100%", maxHeight: 140, objectFit: "cover",
    borderRadius: 8, marginTop: 4,
  },
  loginContainer: {
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", padding: 20,
    background: "#0a0a0f", fontFamily: "Georgia, serif",
  },
  loginCard: {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,107,53,0.2)",
    borderRadius: 24, padding: "48px 40px", textAlign: "center", width: "100%", maxWidth: 440,
  },
  input: {
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,107,53,0.3)",
    borderRadius: 12, padding: "16px 20px", color: "#fff", fontSize: 16,
    outline: "none", width: "100%", fontFamily: "Georgia, serif", boxSizing: "border-box",
  },
  startBtn: {
    background: "#FF6B35", color: "#fff", border: "none", borderRadius: 12,
    padding: 16, fontSize: 16, fontWeight: "bold", cursor: "pointer",
    width: "100%", fontFamily: "Georgia, serif",
  },
};

export default function Home() {
  const [username, setUsername] = useState("");
  const [inputName, setInputName] = useState("");
  const [streak, setStreak] = useState(0);
  const [checkedToday, setCheckedToday] = useState(false);
  const [tab, setTab] = useState("checkin");
  const [checkinHistory, setCheckinHistory] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [proofImage, setProofImage] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("ritual_user");
    const savedStreak = localStorage.getItem("ritual_streak");
    const savedHistory = localStorage.getItem("ritual_history");
    const lastDate = localStorage.getItem("ritual_last_date");
    const savedChecked = localStorage.getItem("ritual_checked_today");

    if (saved) setUsername(saved);
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedHistory) setCheckinHistory(JSON.parse(savedHistory));

    const today = new Date().toDateString();
    if (savedChecked && lastDate === today) setCheckedToday(true);
    else if (lastDate && lastDate !== today) {
      localStorage.removeItem("ritual_checked_today");
      setProofImage(null);
    }
  }, []);

  const todayTask = TASK_TYPES[streak % 7];
  const nextTask = TASK_TYPES[(streak + 1) % 7];

  const handleStart = () => {
    if (!inputName.trim()) return;
    setUsername(inputName.trim());
    localStorage.setItem("ritual_user", inputName.trim());
  };

  const handleFileChange = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setProofImage(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleCheckin = () => {
    if (checkedToday) return;
    const newStreak = streak + 1;
    const today = new Date().toDateString();
    const newHistory = [
      {
        day: newStreak,
        task: todayTask.label,
        emoji: todayTask.emoji,
        date: today,
        color: todayTask.color,
        proof: proofImage || null,
      },
      ...checkinHistory,
    ];
    setStreak(newStreak);
    setCheckedToday(true);
    setCheckinHistory(newHistory);
    localStorage.setItem("ritual_streak", newStreak.toString());
    localStorage.setItem("ritual_checked_today", "true");
    localStorage.setItem("ritual_last_date", today);
    localStorage.setItem("ritual_history", JSON.stringify(newHistory));
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2500);
  };

  const renderFlame = (n) => n >= 30 ? "🔥🔥🔥" : n >= 14 ? "🔥🔥" : n >= 7 ? "🔥" : "🕯️";

  if (!username) {
    return (
      <div style={S.loginContainer}>
        <Head><title>Ritual Daily Builder 🔥</title></Head>
        <div style={S.loginCard}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔥</div>
          <h1 style={{ fontSize: 42, lineHeight: 1.1, marginBottom: 8, margin: "0 0 8px 0" }}>
            Ritual<br /><span style={{ color: "#FF6B35" }}>Daily Builder</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 40 }}>
            Build your streak. Earn your flame.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              style={S.input}
              type="text"
              placeholder="Enter your Ritual username"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
            />
            <button style={S.startBtn} onClick={handleStart}>
              Start My Streak →
            </button>
          </div>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, marginTop: 24 }}>
            No wallet needed · Pure vibes · Daily grind
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={S.body}>
      <Head><title>Ritual Daily Builder 🔥</title></Head>

      {/* CELEBRATION */}
      {showCelebration && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 999,
          background: "rgba(0,0,0,0.88)", display: "flex",
          alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12,
        }}>
          <div style={{ fontSize: 72 }}>🔥</div>
          <div style={{ fontSize: 30, fontWeight: "bold", color: "#FF6B35" }}>Day {streak} Complete!</div>
          {proofImage && <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Proof submitted ✅</div>}
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>Keep the flame alive!</div>
        </div>
      )}

      <div style={S.app}>
        {/* HEADER */}
        <div style={S.header}>
          <span style={S.logo}>🔥 Ritual</span>
          <span style={S.streakPill}>{renderFlame(streak)} <strong>{streak}</strong> day streak</span>
        </div>

        {/* TABS */}
        <div style={S.tabs}>
          {["checkin", "leaderboard", "history"].map((t) => (
            <button key={t} style={S.tab(tab === t)} onClick={() => setTab(t)}>
              {t === "checkin" ? "Daily Check-in" : t === "leaderboard" ? "Leaderboard" : "My History"}
            </button>
          ))}
        </div>

        {/* CHECK IN TAB */}
        {tab === "checkin" && (
          <div style={S.content}>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", padding: "8px 0", margin: 0 }}>
              gm, <strong style={{ color: "#fff" }}>{username}</strong> 👋
            </p>

            <div style={S.taskCard(todayTask.color)}>
              <div style={S.dayBadge}>Day {streak + 1}</div>
              <div style={S.taskEmoji}>{todayTask.emoji}</div>
              <h2 style={S.taskTitle}>Today: {todayTask.label}</h2>
              <p style={S.taskDesc}>{todayTask.desc}</p>

              {!checkedToday && (
                <>
                  {/* UPLOAD ZONE */}
                  <div
                    style={S.uploadZone(!!proofImage, todayTask.color)}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                  >
                    {proofImage ? (
                      <>
                        <img src={proofImage} alt="proof" style={S.previewImg} />
                        <span style={{ fontSize: 12, color: todayTask.color, fontWeight: "bold" }}>
                          ✅ Screenshot uploaded! Click to change.
                        </span>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: 32 }}>📸</span>
                        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontWeight: "bold" }}>
                          Upload Proof Screenshot
                        </span>
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
                          Tap to upload · Optional but encouraged
                        </span>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileChange(e.target.files[0])}
                  />

                  <button style={S.checkinBtn(todayTask.color, false)} onClick={handleCheckin}>
                    ✓ Mark Complete {proofImage ? "+ Submit Proof" : ""}
                  </button>
                </>
              )}

              {checkedToday && (
                <div style={S.doneBadge}>✅ Checked in today! Come back tomorrow.</div>
              )}
            </div>

            {/* STREAK */}
            <div style={S.streakSection}>
              <div style={S.sectionTitle}>Your Streak</div>
              <div style={S.streakDisplay}>
                <span style={{ fontSize: 36 }}>{renderFlame(streak)}</span>
                <div>
                  <span style={S.streakNum}>{streak}</span>
                  <span style={S.streakLabel}>days strong</span>
                </div>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, marginBottom: 8 }}>
                <div style={{ height: "100%", width: `${Math.min((streak / 30) * 100, 100)}%`, background: "#FF6B35", borderRadius: 2 }} />
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: 0 }}>
                {streak < 7 ? `${7 - streak} more days to unlock 🔥 flame`
                  : streak < 14 ? `${14 - streak} more days to unlock 🔥🔥`
                  : streak < 30 ? `${30 - streak} more days to 🔥🔥🔥 legendary`
                  : "🏆 30 days! Absolute legend!"}
              </p>
            </div>

            {/* NEXT UP */}
            <div style={S.nextUp}>
              <span style={{ color: "rgba(255,255,255,0.35)" }}>Next up:</span>
              <strong>{nextTask.emoji} {nextTask.label}</strong>
            </div>

            {/* WEEKLY CYCLE */}
            <div>
              <div style={S.sectionTitle}>The Weekly Cycle</div>
              <div style={S.weekGrid}>
                {TASK_TYPES.map((t) => (
                  <div key={t.day} style={S.weekItem((streak % 7) + 1 === t.day, t.color)}>
                    <span style={{ fontSize: 16 }}>{t.emoji}</span>
                    <span style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>{t.label}</span>
                    <span style={{ fontSize: 8, color: "rgba(255,255,255,0.2)" }}>Day {t.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LEADERBOARD TAB */}
        {tab === "leaderboard" && (
          <div style={S.content}>
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <h2 style={{ fontSize: 22, margin: "0 0 4px 0" }}>🏆 Top Ritual Contributors</h2>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0 }}>Most consistent builders this season</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {LEADERBOARD_DATA.map((user) => (
                <div key={user.rank} style={S.lbRow(user.rank)}>
                  <span style={{ fontSize: 22, width: 30, textAlign: "center" }}>{user.badge}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: "bold" }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>{user.wallet}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, color: "#FF6B35" }}>🔥 {user.streak} days</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{user.points} pts</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)",
              borderRadius: 14, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Your streak:</span>
              <strong style={{ color: "#FF6B35", fontSize: 18 }}>{streak} days 🔥</strong>
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {tab === "history" && (
          <div style={S.content}>
            <h2 style={{ fontSize: 20, margin: 0 }}>Your Journey</h2>
            {checkinHistory.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "rgba(255,255,255,0.3)" }}>
                <div style={{ fontSize: 48 }}>📭</div>
                <p style={{ marginTop: 12 }}>No check-ins yet. Start your streak today!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {checkinHistory.map((item, i) => {
                  const taskInfo = TASK_TYPES.find((t) => t.label === item.task);
                  return (
                    <div key={i} style={S.historyItem(taskInfo?.color || "#FF6B35")}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>Day {item.day}</span>
                          <span style={{ fontSize: 14 }}>{item.emoji} {item.task}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {item.proof && (
                            <span style={{
                              fontSize: 10, color: taskInfo?.color || "#FF6B35",
                              background: `${taskInfo?.color || "#FF6B35"}22`,
                              borderRadius: 100, padding: "2px 8px", border: `1px solid ${taskInfo?.color || "#FF6B35"}44`
                            }}>📸 proof</span>
                          )}
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{item.date}</span>
                        </div>
                      </div>
                      {item.proof && (
                        <img src={item.proof} alt="proof" style={S.historyProof} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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

export default function Home() {
  const [username, setUsername] = useState("");
  const [inputName, setInputName] = useState("");
  const [streak, setStreak] = useState(0);
  const [checkedToday, setCheckedToday] = useState(false);
  const [tab, setTab] = useState("checkin");
  const [checkinHistory, setCheckinHistory] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [proofImage, setProofImage] = useState(null);
  const [proofError, setProofError] = useState(false);
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
    }
  }, []);

  const todayTask = TASK_TYPES[streak % 7];
  const nextTask = TASK_TYPES[(streak + 1) % 7];

  const handleStart = () => {
    if (!inputName.trim()) return;
    setUsername(inputName.trim());
    localStorage.setItem("ritual_user", inputName.trim());
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProofImage(ev.target.result);
      setProofError(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCheckin = () => {
    if (checkedToday) return;
    if (!proofImage) {
      setProofError(true);
      setTimeout(() => setProofError(false), 1500);
      return;
    }
    const newStreak = streak + 1;
    const today = new Date().toDateString();
    const newHistory = [
      { day: newStreak, task: todayTask.label, emoji: todayTask.emoji, date: today, color: todayTask.color },
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
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:20, background:"#0a0a0f", fontFamily:"Georgia,serif", color:"#fff" }}>
        <Head><title>Ritual Daily Builder 🔥</title></Head>
        <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,107,53,0.2)", borderRadius:24, padding:"48px 40px", textAlign:"center", width:"100%", maxWidth:440 }}>
          <div style={{ fontSize:64, marginBottom:16 }}>🔥</div>
          <h1 style={{ fontSize:42, lineHeight:1.1, marginBottom:8, color:"#fff", marginTop:0 }}>
            Ritual<br /><span style={{ color:"#FF6B35" }}>Daily Builder</span>
          </h1>
          <p style={{ color:"rgba(255,255,255,0.4)", fontSize:14, marginBottom:40 }}>Build your streak. Earn your flame.</p>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <input
              style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,107,53,0.3)", borderRadius:12, padding:"16px 20px", color:"#fff", fontSize:16, outline:"none", width:"100%", fontFamily:"Georgia,serif", boxSizing:"border-box" }}
              type="text" placeholder="Enter your Ritual username"
              value={inputName} onChange={(e) => setInputName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
            />
            <button onClick={handleStart} style={{ background:"#FF6B35", color:"#fff", border:"none", borderRadius:12, padding:16, fontSize:16, fontWeight:"bold", cursor:"pointer", width:"100%", fontFamily:"Georgia,serif" }}>
              Start My Streak →
            </button>
          </div>
          <p style={{ color:"rgba(255,255,255,0.2)", fontSize:12, marginTop:24 }}>No wallet needed · Pure vibes · Daily grind</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ margin:0, padding:0, background:"#08080f", minHeight:"100vh", fontFamily:"Georgia,serif", color:"#fff" }}>
      <Head><title>Ritual Daily Builder 🔥</title></Head>

      {showCelebration && (
        <div style={{ position:"fixed", inset:0, zIndex:999, background:"rgba(0,0,0,0.88)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
          <div style={{ fontSize:72 }}>🔥</div>
          <div style={{ fontSize:32, fontWeight:"bold", color:"#FF6B35" }}>Day {streak} Complete!</div>
          <div style={{ fontSize:18, color:"rgba(255,255,255,0.6)" }}>Proof submitted ✅</div>
          <div style={{ fontSize:16, color:"rgba(255,255,255,0.4)" }}>Keep the flame alive 🔥</div>
        </div>
      )}

      <div style={{ maxWidth:520, margin:"0 auto", paddingBottom:80 }}>

        {/* HEADER */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 20px 12px", borderBottom:"1px solid rgba(255,255,255,0.05)", position:"sticky", top:0, background:"rgba(8,8,15,0.97)", zIndex:10 }}>
          <span style={{ fontSize:20, fontWeight:"bold" }}>🔥 Ritual</span>
          <span style={{ background:"rgba(255,107,53,0.15)", border:"1px solid rgba(255,107,53,0.3)", borderRadius:100, padding:"6px 14px", fontSize:13, color:"#FF6B35" }}>
            {renderFlame(streak)} <strong>{streak}</strong> day streak
          </span>
        </div>

        {/* TABS */}
        <div style={{ display:"flex", padding:"16px 20px 0", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          {["checkin","leaderboard","history"].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ background:"none", border:"none", borderBottom: tab===t ? "2px solid #FF6B35" : "2px solid transparent", color: tab===t ? "#FF6B35" : "rgba(255,255,255,0.35)", fontSize:13, padding:"8px 16px 12px", cursor:"pointer", fontFamily:"Georgia,serif" }}>
              {t === "checkin" ? "Daily Check-in" : t === "leaderboard" ? "Leaderboard" : "My History"}
            </button>
          ))}
        </div>

        {/* CHECK IN TAB */}
        {tab === "checkin" && (
          <div style={{ padding:20, display:"flex", flexDirection:"column", gap:16 }}>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", padding:"10px 0", margin:0 }}>
              gm, <strong style={{ color:"#fff" }}>{username}</strong> 👋
            </p>

            <div style={{ background:"linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))", border:`1px solid ${todayTask.color}`, borderRadius:20, padding:"28px 24px", textAlign:"center" }}>
              <div style={{ display:"inline-block", background:"rgba(255,255,255,0.08)", borderRadius:100, padding:"4px 12px", fontSize:12, color:"rgba(255,255,255,0.5)", marginBottom:16 }}>Day {streak + 1}</div>
              <div style={{ fontSize:56, marginBottom:12 }}>{todayTask.emoji}</div>
              <h2 style={{ fontSize:26, fontWeight:"bold", color:"#fff", marginBottom:8, marginTop:0 }}>Today: {todayTask.label}</h2>
              <p style={{ fontSize:14, color:"rgba(255,255,255,0.45)", marginBottom:24, lineHeight:1.5 }}>{todayTask.desc}</p>

              {checkedToday ? (
                <div style={{ background:"rgba(46,204,113,0.1)", border:"1px solid rgba(46,204,113,0.3)", color:"#2ECC71", borderRadius:12, padding:"14px 24px", fontSize:14 }}>
                  ✅ Checked in today! Come back tomorrow.
                </div>
              ) : (
                <div>
                  {/* HIDDEN FILE INPUT */}
                  <input ref={fileInputRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleImageUpload} />

                  {/* UPLOAD BOX */}
                  {!proofImage ? (
                    <div
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      style={{
                        border: proofError ? "2px dashed #FF4444" : "2px dashed rgba(255,255,255,0.2)",
                        borderRadius:12, padding:"24px 16px", cursor:"pointer", marginBottom:12,
                        background: proofError ? "rgba(255,68,68,0.06)" : "rgba(255,255,255,0.02)",
                      }}
                    >
                      <div style={{ fontSize:36, marginBottom:8 }}>📸</div>
                      <div style={{ fontSize:14, color: proofError ? "#FF4444" : "rgba(255,255,255,0.5)", marginBottom:4 }}>
                        {proofError ? "⚠️ Upload proof first to unlock!" : "Upload your proof screenshot"}
                      </div>
                      <div style={{ fontSize:12, color:"rgba(255,255,255,0.25)" }}>Tap to choose image · Required to check in</div>
                    </div>
                  ) : (
                    <div style={{ marginBottom:12, position:"relative" }}>
                      <img src={proofImage} alt="proof" style={{ width:"100%", borderRadius:12, border:"2px solid rgba(46,204,113,0.5)", maxHeight:200, objectFit:"cover", display:"block" }} />
                      <div style={{ position:"absolute", top:8, right:8, background:"rgba(46,204,113,0.9)", borderRadius:100, padding:"4px 10px", fontSize:12, color:"#fff", fontWeight:"bold" }}>
                        ✅ Proof ready
                      </div>
                      <button onClick={() => setProofImage(null)} style={{ position:"absolute", top:8, left:8, background:"rgba(0,0,0,0.7)", border:"none", borderRadius:100, padding:"4px 10px", fontSize:12, color:"#fff", cursor:"pointer" }}>
                        ✕ Remove
                      </button>
                    </div>
                  )}

                  {/* MARK COMPLETE BUTTON */}
                  <button
                    onClick={handleCheckin}
                    style={{
                      background: proofImage ? todayTask.color : "rgba(255,255,255,0.08)",
                      color: proofImage ? "#fff" : "rgba(255,255,255,0.25)",
                      border: "none", borderRadius:12, padding:"14px 32px", fontSize:15,
                      fontWeight:"bold", cursor: proofImage ? "pointer" : "not-allowed",
                      fontFamily:"Georgia,serif", width:"100%",
                    }}
                  >
                    {proofImage ? "✓ Mark Complete" : "🔒 Upload proof to unlock"}
                  </button>
                </div>
              )}
            </div>

            {/* STREAK */}
            <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, padding:20 }}>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginBottom:16, textTransform:"uppercase", letterSpacing:"0.08em" }}>Your Streak</div>
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
                <span style={{ fontSize:36 }}>{renderFlame(streak)}</span>
                <div>
                  <span style={{ fontSize:48, fontWeight:"bold", lineHeight:1, color:"#FF6B35", display:"block" }}>{streak}</span>
                  <span style={{ fontSize:13, color:"rgba(255,255,255,0.4)" }}>days strong</span>
                </div>
              </div>
              <div style={{ height:4, background:"rgba(255,255,255,0.08)", borderRadius:2, marginBottom:8 }}>
                <div style={{ height:"100%", width:`${Math.min((streak/30)*100,100)}%`, background:"#FF6B35", borderRadius:2 }} />
              </div>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.35)", margin:0 }}>
                {streak < 7 ? `${7-streak} more days to unlock 🔥 flame` : streak < 14 ? `${14-streak} more days to unlock 🔥🔥` : streak < 30 ? `${30-streak} more days to unlock 🔥🔥🔥` : "🏆 30 days! Absolute legend!"}
              </p>
            </div>

            {/* NEXT UP */}
            <div style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"12px 16px", fontSize:14 }}>
              <span style={{ color:"rgba(255,255,255,0.35)" }}>Next up:</span>
              <strong>{nextTask.emoji} {nextTask.label}</strong>
            </div>

            {/* WEEKLY */}
            <div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginBottom:12, textTransform:"uppercase", letterSpacing:"0.08em" }}>The Weekly Cycle</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:6 }}>
                {TASK_TYPES.map((t) => {
                  const active = (streak % 7)+1 === t.day;
                  return (
                    <div key={t.day} style={{ background: active ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)", border:`1px solid ${active ? t.color : "rgba(255,255,255,0.07)"}`, borderRadius:10, padding:"8px 4px", textAlign:"center", display:"flex", flexDirection:"column", gap:3 }}>
                      <span style={{ fontSize:16 }}>{t.emoji}</span>
                      <span style={{ fontSize:8, color:"rgba(255,255,255,0.4)" }}>{t.label}</span>
                      <span style={{ fontSize:8, color:"rgba(255,255,255,0.2)" }}>D{t.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* LEADERBOARD TAB */}
        {tab === "leaderboard" && (
          <div style={{ padding:20, display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ textAlign:"center" }}>
              <h2 style={{ fontSize:22, marginBottom:4, marginTop:0 }}>🏆 Top Ritual Contributors</h2>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.35)", margin:0 }}>Most consistent builders this season</p>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {LEADERBOARD_DATA.map((user) => (
                <div key={user.rank} style={{ display:"flex", alignItems:"center", gap:14, background: user.rank===1 ? "rgba(255,215,0,0.04)" : "rgba(255,255,255,0.02)", border:`1px solid ${user.rank===1 ? "rgba(255,215,0,0.25)" : user.rank===2 ? "rgba(192,192,192,0.2)" : user.rank===3 ? "rgba(205,127,50,0.2)" : "rgba(255,255,255,0.06)"}`, borderRadius:14, padding:"14px 16px" }}>
                  <span style={{ fontSize:22, width:30, textAlign:"center" }}>{user.badge}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:"bold" }}>{user.name}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.3)", fontFamily:"monospace" }}>{user.wallet}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:13, color:"#FF6B35" }}>🔥 {user.streak} days</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{user.points} pts</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background:"rgba(255,107,53,0.08)", border:"1px solid rgba(255,107,53,0.2)", borderRadius:14, padding:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:14, color:"rgba(255,255,255,0.5)" }}>Your streak:</span>
              <strong style={{ color:"#FF6B35", fontSize:18 }}>{streak} days</strong>
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {tab === "history" && (
          <div style={{ padding:20, display:"flex", flexDirection:"column", gap:16 }}>
            <h2 style={{ fontSize:20, margin:0 }}>Your Journey</h2>
            {checkinHistory.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px", color:"rgba(255,255,255,0.3)" }}>
                <div style={{ fontSize:48 }}>📭</div>
                <p style={{ marginTop:12 }}>No check-ins yet. Start your streak today!</p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {checkinHistory.map((item, i) => {
                  const taskInfo = TASK_TYPES.find((t) => t.label === item.task);
                  return (
                    <div key={i} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderLeft:`3px solid ${taskInfo?.color || "#FF6B35"}`, borderRadius:12, padding:"12px 16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <span style={{ fontSize:12, color:"rgba(255,255,255,0.3)", width:45 }}>Day {item.day}</span>
                        <span style={{ flex:1, fontSize:14 }}>{item.emoji} {item.task}</span>
                        <span style={{ fontSize:11, color:"rgba(255,255,255,0.25)" }}>{item.date}</span>
                      </div>
                      <div style={{ marginTop:6, fontSize:11, color:"rgba(46,204,113,0.7)" }}>📸 Proof submitted ✅</div>
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

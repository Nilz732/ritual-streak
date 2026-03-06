import { useState, useEffect } from "react";
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
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("ritual_user");
    const savedStreak = localStorage.getItem("ritual_streak");
    const savedChecked = localStorage.getItem("ritual_checked_today");
    const savedHistory = localStorage.getItem("ritual_history");
    const lastDate = localStorage.getItem("ritual_last_date");

    if (saved) setUsername(saved);
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedHistory) setCheckinHistory(JSON.parse(savedHistory));

    const today = new Date().toDateString();
    if (savedChecked && lastDate === today) {
      setCheckedToday(true);
    } else if (lastDate && lastDate !== today) {
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

  const handleCheckin = () => {
    if (checkedToday) return;
    const newStreak = streak + 1;
    const today = new Date().toDateString();
    const newHistory = [
      { day: newStreak, task: todayTask.label, emoji: todayTask.emoji, date: today },
      ...checkinHistory,
    ];
    setStreak(newStreak);
    setCheckedToday(true);
    setCheckinHistory(newHistory);
    localStorage.setItem("ritual_streak", newStreak.toString());
    localStorage.setItem("ritual_checked_today", "true");
    localStorage.setItem("ritual_last_date", today);
    localStorage.setItem("ritual_history", JSON.stringify(newHistory));
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      emoji: ["🔥", "⚡", "✨", "💎", "🎯"][Math.floor(Math.random() * 5)],
    }));
    setParticles(newParticles);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const renderFlame = (streakCount) => {
    if (streakCount >= 30) return "🔥🔥🔥";
    if (streakCount >= 14) return "🔥🔥";
    if (streakCount >= 7) return "🔥";
    return "🕯️";
  };

  if (!username) {
    return (
      <>
        <Head>
          <title>Ritual Daily Builder 🔥</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className="container">
          <div className="login-card">
            <div className="logo-area">
              <div className="flame-icon">🔥</div>
              <h1>Ritual<br /><span>Daily Builder</span></h1>
              <p className="tagline">Build your streak. Earn your flame.</p>
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter your Ritual username"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStart()}
                className="name-input"
              />
              <button className="start-btn" onClick={handleStart}>
                Start My Streak →
              </button>
            </div>
            <p className="disclaimer">No wallet needed · Pure vibes · Daily grind</p>
          </div>
        </div>
        <style jsx global>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            background: #0a0a0f;
            min-height: 100vh;
            font-family: 'Georgia', serif;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            background-image: radial-gradient(ellipse at 20% 50%, rgba(255,107,53,0.08) 0%, transparent 60%),
                              radial-gradient(ellipse at 80% 20%, rgba(155,89,182,0.06) 0%, transparent 50%);
          }
        `}</style>
        <style jsx>{`
          .container { padding: 20px; width: 100%; max-width: 480px; }
          .login-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,107,53,0.2);
            border-radius: 24px;
            padding: 48px 40px;
            text-align: center;
            backdrop-filter: blur(20px);
          }
          .flame-icon { font-size: 64px; margin-bottom: 16px; animation: pulse 2s ease-in-out infinite; }
          @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
          h1 { font-size: 42px; line-height: 1.1; color: #fff; margin-bottom: 8px; }
          h1 span { color: #FF6B35; }
          .tagline { color: rgba(255,255,255,0.4); font-size: 14px; margin-bottom: 40px; letter-spacing: 0.05em; }
          .input-group { display: flex; flex-direction: column; gap: 12px; }
          .name-input {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,107,53,0.3);
            border-radius: 12px;
            padding: 16px 20px;
            color: #fff;
            font-size: 16px;
            outline: none;
            transition: border-color 0.2s;
          }
          .name-input:focus { border-color: #FF6B35; }
          .name-input::placeholder { color: rgba(255,255,255,0.3); }
          .start-btn {
            background: #FF6B35;
            color: #fff;
            border: none;
            border-radius: 12px;
            padding: 16px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            letter-spacing: 0.05em;
            transition: all 0.2s;
          }
          .start-btn:hover { background: #ff8a60; transform: translateY(-1px); }
          .disclaimer { color: rgba(255,255,255,0.2); font-size: 12px; margin-top: 24px; }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Ritual Daily Builder 🔥</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {showCelebration && (
        <div className="celebration">
          {particles.map((p) => (
            <div key={p.id} className="particle" style={{ left: `${p.x}%`, animationDelay: `${p.delay}s` }}>
              {p.emoji}
            </div>
          ))}
          <div className="celebration-text">
            <span>Day {streak} Complete!</span>
            <span className="sub">Keep the flame alive 🔥</span>
          </div>
        </div>
      )}

      <div className="app">
        <header>
          <div className="header-left">
            <span className="logo">🔥 Ritual</span>
          </div>
          <div className="header-right">
            <div className="streak-pill">
              {renderFlame(streak)} <strong>{streak}</strong> day streak
            </div>
          </div>
        </header>

        <div className="tabs">
          <button className={tab === "checkin" ? "tab active" : "tab"} onClick={() => setTab("checkin")}>Daily Check-in</button>
          <button className={tab === "leaderboard" ? "tab active" : "tab"} onClick={() => setTab("leaderboard")}>Leaderboard</button>
          <button className={tab === "history" ? "tab active" : "tab"} onClick={() => setTab("history")}>My History</button>
        </div>

        {tab === "checkin" && (
          <div className="content">
            <div className="welcome-bar">
              <span>gm, <strong>{username}</strong> 👋</span>
            </div>
            <div className="task-card" style={{ "--task-color": todayTask.color }}>
              <div className="task-day-badge">Day {streak + 1}</div>
              <div className="task-emoji">{todayTask.emoji}</div>
              <h2 className="task-title">Today: {todayTask.label}</h2>
              <p className="task-desc">{todayTask.desc}</p>
              {checkedToday ? (
                <div className="done-badge">✅ Checked in today! Come back tomorrow.</div>
              ) : (
                <button className="checkin-btn" onClick={handleCheckin}>✓ Mark Complete</button>
              )}
            </div>

            <div className="streak-section">
              <h3>Your Streak</h3>
              <div className="streak-display">
                <span className="big-flame">{renderFlame(streak)}</span>
                <div className="streak-info">
                  <span className="streak-num">{streak}</span>
                  <span className="streak-label">days strong</span>
                </div>
              </div>
              <div className="milestone-bar">
                <div className="milestone-fill" style={{ width: `${Math.min((streak / 30) * 100, 100)}%` }} />
                <div className="milestones">
                  {[7, 14, 21, 30].map((m) => (
                    <div key={m} className={`milestone-dot ${streak >= m ? "reached" : ""}`} style={{ left: `${(m / 30) * 100}%` }}>
                      <span>{m}d</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="milestone-hint">
                {streak < 7 ? `${7 - streak} more days to unlock 🔥 flame`
                  : streak < 14 ? `${14 - streak} more days to unlock 🔥🔥 double flame`
                  : streak < 30 ? `${30 - streak} more days to unlock 🔥🔥🔥 legendary flame`
                  : "🏆 You've hit 30 days! Absolute legend!"}
              </p>
            </div>

            <div className="next-up">
              <span className="next-label">Next up:</span>
              <span className="next-task">{nextTask.emoji} {nextTask.label}</span>
            </div>

            <div className="weekly">
              <h3>The Weekly Cycle</h3>
              <div className="week-grid">
                {TASK_TYPES.map((t) => (
                  <div key={t.day} className={`week-item ${(streak % 7) + 1 === t.day ? "current" : ""}`} style={{ "--c": t.color }}>
                    <span className="week-emoji">{t.emoji}</span>
                    <span className="week-label">{t.label}</span>
                    <span className="week-day">Day {t.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "leaderboard" && (
          <div className="content">
            <div className="lb-header">
              <h2>🏆 Top Ritual Contributors</h2>
              <p>Most consistent builders this season</p>
            </div>
            <div className="leaderboard">
              {LEADERBOARD_DATA.map((user) => (
                <div key={user.rank} className={`lb-row rank-${user.rank}`}>
                  <div className="lb-rank">{user.badge}</div>
                  <div className="lb-info">
                    <span className="lb-name">{user.name}</span>
                    <span className="lb-wallet">{user.wallet}</span>
                  </div>
                  <div className="lb-stats">
                    <span className="lb-streak">🔥 {user.streak} days</span>
                    <span className="lb-points">{user.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="your-rank">
              <span>Your current streak:</span>
              <strong>{streak} days</strong>
              <span className="rank-hint">Keep going to climb the board!</span>
            </div>
          </div>
        )}

        {tab === "history" && (
          <div className="content">
            <h2 className="history-title">Your Journey</h2>
            {checkinHistory.length === 0 ? (
              <div className="empty-state">
                <span>📭</span>
                <p>No check-ins yet.</p>
                <p>Start your streak today!</p>
              </div>
            ) : (
              <div className="history-list">
                {checkinHistory.map((item, i) => {
                  const taskInfo = TASK_TYPES.find((t) => t.label === item.task);
                  return (
                    <div key={i} className="history-item" style={{ "--hc": taskInfo?.color || "#FF6B35" }}>
                      <div className="history-day">Day {item.day}</div>
                      <div className="history-task"><span>{item.emoji}</span><span>{item.task}</span></div>
                      <div className="history-date">{item.date}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          background: #08080f;
          min-height: 100vh;
          font-family: 'Georgia', serif;
          color: #fff;
          background-image:
            radial-gradient(ellipse at 10% 0%, rgba(255,107,53,0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 90% 100%, rgba(155,89,182,0.08) 0%, transparent 50%);
        }
      `}</style>

      <style jsx>{`
        .app { max-width: 520px; margin: 0 auto; padding: 0 0 80px 0; }
        .celebration {
          position: fixed; inset: 0; z-index: 999;
          background: rgba(0,0,0,0.85);
          display: flex; align-items: center; justify-content: center;
          pointer-events: none;
          animation: fadeOut 3s forwards;
        }
        @keyframes fadeOut { 0%,60%{opacity:1} 100%{opacity:0} }
        .particle { position: absolute; top: -20px; font-size: 24px; animation: fall 2s ease-in forwards; }
        @keyframes fall { to { transform: translateY(110vh) rotate(360deg); opacity: 0; } }
        .celebration-text { display: flex; flex-direction: column; align-items: center; gap: 8px; animation: popIn 0.4s ease-out; }
        @keyframes popIn { from{transform:scale(0.5);opacity:0} to{transform:scale(1);opacity:1} }
        .celebration-text span { font-size: 36px; font-weight: bold; color: #FF6B35; }
        .celebration-text .sub { font-size: 18px; color: rgba(255,255,255,0.7); }
        header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 20px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          position: sticky; top: 0;
          background: rgba(8,8,15,0.95);
          backdrop-filter: blur(20px);
          z-index: 10;
        }
        .logo { font-size: 20px; font-weight: bold; }
        .streak-pill {
          background: rgba(255,107,53,0.15);
          border: 1px solid rgba(255,107,53,0.3);
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 13px;
          color: #FF6B35;
        }
        .tabs { display: flex; padding: 16px 20px 0; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .tab {
          background: none; border: none; color: rgba(255,255,255,0.35);
          font-size: 13px; padding: 8px 16px 12px;
          cursor: pointer; border-bottom: 2px solid transparent;
          transition: all 0.2s; font-family: inherit;
        }
        .tab.active { color: #FF6B35; border-bottom-color: #FF6B35; }
        .content { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
        .welcome-bar { font-size: 14px; color: rgba(255,255,255,0.5); padding: 10px 0; }
        .welcome-bar strong { color: #fff; }
        .task-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid var(--task-color, #FF6B35);
          border-radius: 20px; padding: 32px 28px; text-align: center;
          position: relative; overflow: hidden;
        }
        .task-card::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle at 50% 0%, var(--task-color, #FF6B35) 0%, transparent 60%);
          opacity: 0.08;
        }
        .task-day-badge {
          display: inline-block; background: rgba(255,255,255,0.08);
          border-radius: 100px; padding: 4px 12px; font-size: 12px;
          color: rgba(255,255,255,0.5); margin-bottom: 16px;
        }
        .task-emoji { font-size: 56px; margin-bottom: 12px; }
        .task-title { font-size: 26px; font-weight: bold; color: #fff; margin-bottom: 8px; }
        .task-desc { font-size: 14px; color: rgba(255,255,255,0.45); margin-bottom: 24px; line-height: 1.5; }
        .checkin-btn {
          background: var(--task-color, #FF6B35); color: #fff; border: none;
          border-radius: 12px; padding: 14px 32px; font-size: 15px; font-weight: bold;
          cursor: pointer; font-family: inherit; transition: all 0.2s; width: 100%;
        }
        .checkin-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .done-badge {
          background: rgba(46,204,113,0.1); border: 1px solid rgba(46,204,113,0.3);
          color: #2ECC71; border-radius: 12px; padding: 14px 24px; font-size: 14px;
        }
        .streak-section {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 20px;
        }
        .streak-section h3 { font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.08em; }
        .streak-display { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
        .big-flame { font-size: 36px; }
        .streak-num { font-size: 48px; font-weight: bold; line-height: 1; color: #FF6B35; display: block; }
        .streak-label { font-size: 13px; color: rgba(255,255,255,0.4); }
        .milestone-bar { height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; position: relative; margin-bottom: 24px; }
        .milestone-fill { height: 100%; background: #FF6B35; border-radius: 2px; transition: width 0.5s ease; }
        .milestones { position: absolute; inset: 0; }
        .milestone-dot {
          position: absolute; top: 50%; transform: translate(-50%, -50%);
          width: 10px; height: 10px; background: rgba(255,255,255,0.15);
          border-radius: 50%; border: 2px solid rgba(255,255,255,0.2);
        }
        .milestone-dot.reached { background: #FF6B35; border-color: #FF6B35; }
        .milestone-dot span { position: absolute; top: 14px; left: 50%; transform: translateX(-50%); font-size: 10px; color: rgba(255,255,255,0.3); white-space: nowrap; }
        .milestone-hint { font-size: 12px; color: rgba(255,255,255,0.35); }
        .next-up {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px; padding: 12px 16px; font-size: 14px;
        }
        .next-label { color: rgba(255,255,255,0.35); }
        .next-task { color: #fff; font-weight: bold; }
        .weekly h3 { font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.08em; }
        .week-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
        .week-item {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; padding: 8px 4px; text-align: center;
          display: flex; flex-direction: column; gap: 3px;
        }
        .week-item.current { border-color: var(--c, #FF6B35); background: rgba(255,255,255,0.06); box-shadow: 0 0 12px rgba(255,107,53,0.15); }
        .week-emoji { font-size: 16px; }
        .week-label { font-size: 8px; color: rgba(255,255,255,0.4); }
        .week-day { font-size: 8px; color: rgba(255,255,255,0.2); }
        .lb-header { text-align: center; padding: 8px 0 4px; }
        .lb-header h2 { font-size: 22px; margin-bottom: 4px; }
        .lb-header p { font-size: 13px; color: rgba(255,255,255,0.35); }
        .leaderboard { display: flex; flex-direction: column; gap: 8px; }
        .lb-row {
          display: flex; align-items: center; gap: 14px;
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px; padding: 14px 16px;
        }
        .lb-row.rank-1 { border-color: rgba(255,215,0,0.25); background: rgba(255,215,0,0.04); }
        .lb-row.rank-2 { border-color: rgba(192,192,192,0.2); }
        .lb-row.rank-3 { border-color: rgba(205,127,50,0.2); }
        .lb-rank { font-size: 22px; width: 30px; text-align: center; }
        .lb-info { flex: 1; }
        .lb-name { display: block; font-size: 15px; font-weight: bold; margin-bottom: 2px; }
        .lb-wallet { font-size: 11px; color: rgba(255,255,255,0.3); font-family: monospace; }
        .lb-stats { text-align: right; }
        .lb-streak { display: block; font-size: 13px; color: #FF6B35; margin-bottom: 2px; }
        .lb-points { font-size: 11px; color: rgba(255,255,255,0.4); }
        .your-rank {
          background: rgba(255,107,53,0.08); border: 1px solid rgba(255,107,53,0.2);
          border-radius: 14px; padding: 16px;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 8px; font-size: 14px; color: rgba(255,255,255,0.5);
        }
        .your-rank strong { color: #FF6B35; font-size: 18px; }
        .rank-hint { font-size: 12px; color: rgba(255,255,255,0.3); width: 100%; }
        .history-title { font-size: 20px; padding: 4px 0; }
        .empty-state {
          text-align: center; padding: 60px 20px; color: rgba(255,255,255,0.3);
          display: flex; flex-direction: column; align-items: center; gap: 8px;
        }
        .empty-state span { font-size: 48px; }
        .history-list { display: flex; flex-direction: column; gap: 8px; }
        .history-item {
          display: flex; align-items: center; gap: 12px;
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
          border-left: 3px solid var(--hc, #FF6B35);
          border-radius: 12px; padding: 12px 16px;
        }
        .history-day { font-size: 12px; color: rgba(255,255,255,0.3); width: 45px; }
        .history-task { flex: 1; display: flex; align-items: center; gap: 8px; font-size: 14px; }
        .history-date { font-size: 11px; color: rgba(255,255,255,0.25); }
      `}</style>
    </>
  );
}

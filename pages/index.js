import { useState, useEffect, useRef } from "react";
import Head from "next/head";

const BADGES = [
  { id:1, emoji:"🐾", name:"Ritty Bitty", desc:"10 Day Streak", req:10, color:"#7C5CFF" },
  { id:2, emoji:"🐱", name:"Ritty", desc:"15 Day Streak", req:15, color:"#00E5FF" },
  { id:3, emoji:"⚡", name:"Ritualist", desc:"30 Day Streak", req:30, color:"#FFD166" },
  { id:4, emoji:"👑", name:"Radiant", desc:"60 Day Streak", req:60, color:"#FF6B6B" },
  { id:5, emoji:"🔒", name:"Dev Master", desc:"100 Day Streak", req:100, color:"#888" },
];

const LEADERBOARD = [
  { rank:1, name:"Alice", streak:45, badge:"🔥", xp:900 },
  { rank:2, name:"DevX", streak:30, badge:"⚡", xp:600 },
  { rank:3, name:"Dolex", streak:21, badge:"🎨", xp:420 },
  { rank:4, name:"CryptoSam", streak:18, badge:"🧠", xp:360 },
  { rank:5, name:"RitualMax", streak:14, badge:"🐱", xp:280 },
];

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const CAT_MSGS = [
  "😺 Don't break your streak builder. Proof > trust.",
  "😸 Every day counts. Show up!",
  "🐱 Your consistency is your superpower.",
  "😼 Legendary builders check in daily. Are you one?",
];

const BG = "#0B0F1A";
const PURPLE = "#7C5CFF";
const CYAN = "#00E5FF";
const GOLD = "#FFD166";
const MUTED = "rgba(255,255,255,0.4)";
const BORDER = "rgba(124,92,255,0.25)";

const glass = (extra={}) => ({
  background:"rgba(255,255,255,0.04)",
  border:`1px solid ${BORDER}`,
  borderRadius:20,
  ...extra,
});

const gbtn = (color=PURPLE, disabled=false) => ({
  background: disabled ? "rgba(255,255,255,0.07)" : `linear-gradient(135deg,${color},${color}cc)`,
  border:"none", borderRadius:14, color: disabled ? "rgba(255,255,255,0.25)" : "#fff",
  fontSize:15, fontWeight:700, cursor: disabled ? "not-allowed" : "pointer",
  fontFamily:"Georgia,serif",
  boxShadow: disabled ? "none" : `0 0 20px ${color}44`,
  transition:"all 0.2s",
});

const pageBg = {
  margin:0, padding:0, background:BG, minHeight:"100vh",
  fontFamily:"Georgia,serif", color:"#fff",
  backgroundImage:`
    radial-gradient(ellipse at 15% 10%, rgba(124,92,255,0.13) 0%, transparent 50%),
    radial-gradient(ellipse at 85% 85%, rgba(0,229,255,0.07) 0%, transparent 50%),
    linear-gradient(rgba(124,92,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(124,92,255,0.025) 1px, transparent 1px)
  `,
  backgroundSize:"100% 100%,100% 100%,36px 36px,36px 36px",
};

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [username, setUsername] = useState("");
  const [inputName, setInputName] = useState("");
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [checkedToday, setCheckedToday] = useState(false);
  const [proofImage, setProofImage] = useState(null);
  const [proofError, setProofError] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [weekDays] = useState([true,true,true,true,false,false,false]);
  const [contributions, setContributions] = useState([]);
  const [newLink, setNewLink] = useState("");
  const [newLinkDay, setNewLinkDay] = useState("");
  const [newLinkNote, setNewLinkNote] = useState("");
  const [gallery, setGallery] = useState([]);
  const [catMsg] = useState(CAT_MSGS[Math.floor(Math.random()*CAT_MSGS.length)]);
  const fileRef = useRef(null);
  const artRef = useRef(null);

  useEffect(() => {
    const u = localStorage.getItem("ru_user");
    const s = localStorage.getItem("ru_streak");
    const xpS = localStorage.getItem("ru_xp");
    const chk = localStorage.getItem("ru_checked");
    const last = localStorage.getItem("ru_last");
    const cont = localStorage.getItem("ru_contrib");
    const gal = localStorage.getItem("ru_gallery");
    if (u) { setUsername(u); setScreen("home"); }
    if (s) setStreak(parseInt(s));
    if (xpS) setXp(parseInt(xpS));
    if (cont) setContributions(JSON.parse(cont));
    if (gal) setGallery(JSON.parse(gal));
    const today = new Date().toDateString();
    if (chk && last === today) setCheckedToday(true);
    else if (last && last !== today) localStorage.removeItem("ru_checked");
  }, []);

  const handleStart = () => {
    if (!inputName.trim()) return;
    setUsername(inputName.trim());
    localStorage.setItem("ru_user", inputName.trim());
    setScreen("home");
  };

  const handleProofUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => { setProofImage(ev.target.result); setProofError(false); };
    r.readAsDataURL(file);
  };

  const handleArtUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => {
      const art = { id:Date.now(), src:ev.target.result, name:file.name, date:new Date().toLocaleDateString() };
      const updated = [art, ...gallery];
      setGallery(updated);
      localStorage.setItem("ru_gallery", JSON.stringify(updated));
    };
    r.readAsDataURL(file);
  };

  const handleCheckin = () => {
    if (checkedToday) return;
    if (!proofImage) { setProofError(true); setTimeout(()=>setProofError(false),1500); return; }
    const ns = streak+1; const nx = xp+35; const today = new Date().toDateString();
    setStreak(ns); setXp(nx); setCheckedToday(true);
    localStorage.setItem("ru_streak", ns.toString());
    localStorage.setItem("ru_xp", nx.toString());
    localStorage.setItem("ru_checked","true");
    localStorage.setItem("ru_last",today);
    setShowCelebration(true);
    setTimeout(()=>setShowCelebration(false),3000);
  };

  const handleAddLink = () => {
    if (!newLink.trim() || !newLinkDay.trim()) return;
    const entry = { id:Date.now(), day:newLinkDay, link:newLink, note:newLinkNote, date:new Date().toLocaleDateString() };
    const updated = [entry, ...contributions];
    setContributions(updated);
    localStorage.setItem("ru_contrib", JSON.stringify(updated));
    setNewLink(""); setNewLinkDay(""); setNewLinkNote("");
  };

  const earnedBadges = BADGES.filter(b => streak >= b.req);
  const nextBadge = BADGES.find(b => streak < b.req);

  // ─── NAVIGATION BAR ───
  const Nav = () => (
    <div style={{ display:"flex", justifyContent:"space-around", padding:"10px 4px 14px", borderTop:`1px solid ${BORDER}`, background:"rgba(11,15,26,0.98)", position:"fixed", bottom:0, left:0, right:0, zIndex:30 }}>
      {[
        {id:"home",icon:"🏠",label:"Home"},
        {id:"weekly",icon:"📅",label:"Week"},
        {id:"badges",icon:"🏆",label:"Badges"},
        {id:"leaderboard",icon:"⚡",label:"Ranks"},
        {id:"contributions",icon:"🔗",label:"Links"},
        {id:"gallery",icon:"🎨",label:"Gallery"},
      ].map(n => (
        <button key={n.id} onClick={()=>setScreen(n.id)} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, padding:"4px 8px" }}>
          <span style={{ fontSize:22 }}>{n.icon}</span>
          <span style={{ fontSize:9, color:screen===n.id?PURPLE:MUTED, fontFamily:"Georgia,serif" }}>{n.label}</span>
          {screen===n.id && <div style={{ width:4,height:4,borderRadius:"50%",background:PURPLE,marginTop:1 }} />}
        </button>
      ))}
    </div>
  );

  // ─── INPUT STYLE ───
  const inp = { background:"rgba(255,255,255,0.05)", border:`1px solid ${BORDER}`, borderRadius:12, padding:"13px 16px", color:"#fff", fontSize:14, outline:"none", fontFamily:"Georgia,serif", boxSizing:"border-box", width:"100%" };

  // ══════════════════════════════
  // LANDING
  // ══════════════════════════════
  if (screen === "landing") return (
    <div style={{ ...pageBg, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <Head><title>Ritual Daily Streak 🔥</title></Head>
      <div style={{ width:"100%", maxWidth:420 }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ fontSize:64, marginBottom:10 }}>🔥</div>
          <div style={{ fontSize:11, color:PURPLE, letterSpacing:"0.35em", textTransform:"uppercase", marginBottom:10 }}>Ritual Network</div>
          <h1 style={{ fontSize:40, margin:0, lineHeight:1.1, color:"#fff" }}>
            Daily <span style={{ color:PURPLE }}>Streak</span>
          </h1>
        </div>

        <div style={{ ...glass({padding:"32px 28px",marginBottom:20}), textAlign:"center" }}>
          <p style={{ fontSize:17, lineHeight:1.8, color:"rgba(255,255,255,0.8)", margin:"0 0 20px" }}>
            Build consistency.<br/>
            <span style={{ color:CYAN }}>Earn Ritual energy.</span><br/>
            Stay active in the community.
          </p>
          <div style={{ width:50, height:2, background:`linear-gradient(90deg,${PURPLE},${CYAN})`, margin:"0 auto 20px" }} />
          <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
            {["📸 Proof required","🔥 Daily streaks","🏆 Leaderboard","🎨 Art Gallery"].map(f=>(
              <span key={f} style={{ background:"rgba(124,92,255,0.1)", border:`1px solid ${BORDER}`, borderRadius:100, padding:"4px 11px", fontSize:11, color:MUTED }}>{f}</span>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
          <input type="text" placeholder="Enter your Ritual username" value={inputName}
            onChange={e=>setInputName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleStart()}
            style={{ ...inp, fontSize:16, padding:"16px 20px" }} />
          <button onClick={handleStart} style={{ ...gbtn(PURPLE), padding:16, fontSize:16, width:"100%" }}>
            Start Building →
          </button>
        </div>
        <p style={{ textAlign:"center", color:"rgba(255,255,255,0.18)", fontSize:12, margin:0 }}>
          Track your daily Ritual contributions
        </p>
      </div>
    </div>
  );

  // ══════════════════════════════
  // HOME
  // ══════════════════════════════
  if (screen === "home") return (
    <div style={{ ...pageBg, paddingBottom:90 }}>
      <Head><title>Ritual Daily Streak 🔥</title></Head>

      {showCelebration && (
        <div style={{ position:"fixed",inset:0,zIndex:999,background:"rgba(11,15,26,0.95)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:14 }}>
          <div style={{ fontSize:80 }}>🔥</div>
          <div style={{ fontSize:30,fontWeight:"bold",color:PURPLE }}>Streak Extended!</div>
          <div style={{ fontSize:22,color:GOLD }}>+35 XP Earned ⚡</div>
          <div style={{ fontSize:16,color:MUTED }}>Day {streak} complete. Keep going!</div>
        </div>
      )}

      <div style={{ padding:"24px 20px 0" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
          <div>
            <div style={{ fontSize:11,color:MUTED,letterSpacing:"0.12em",textTransform:"uppercase" }}>Welcome back</div>
            <div style={{ fontSize:22,fontWeight:"bold" }}>{username} <span style={{ color:PURPLE }}>✦</span></div>
          </div>
          <div style={{ ...glass({padding:"8px 16px",borderRadius:100}), fontSize:13,color:GOLD }}>⚡ {xp} XP</div>
        </div>

        {/* STREAK HERO */}
        <div style={{ ...glass({padding:28,textAlign:"center",marginBottom:16,position:"relative",overflow:"hidden"}) }}>
          <div style={{ position:"absolute",top:-10,right:-10,fontSize:110,opacity:0.04,pointerEvents:"none" }}>🔥</div>
          <div style={{ fontSize:11,color:MUTED,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8 }}>Current Streak</div>
          <div style={{ fontSize:76,fontWeight:"bold",color:PURPLE,lineHeight:1 }}>{streak}</div>
          <div style={{ fontSize:18,color:MUTED,marginBottom:16 }}>Days 🔥</div>
          {earnedBadges.length > 0 && (
            <div style={{ display:"flex",gap:8,justifyContent:"center",marginBottom:16 }}>
              {earnedBadges.slice(-3).map(b=><span key={b.id} title={b.name} style={{ fontSize:26 }}>{b.emoji}</span>)}
            </div>
          )}
          {nextBadge && (
            <div style={{ background:"rgba(124,92,255,0.1)",border:`1px solid ${BORDER}`,borderRadius:12,padding:"10px 16px",fontSize:13,color:MUTED }}>
              Next → <span style={{ color:GOLD }}>{nextBadge.emoji} {nextBadge.name}</span> at {nextBadge.req} days
            </div>
          )}
        </div>

        {/* CHECK IN CARD */}
        <div style={{ ...glass({padding:22,marginBottom:16}) }}>
          <div style={{ fontSize:12,color:MUTED,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:14 }}>Today's Check-in</div>

          {checkedToday ? (
            <div style={{ textAlign:"center",padding:"16px 0" }}>
              <div style={{ fontSize:48,marginBottom:8 }}>✅</div>
              <div style={{ fontSize:16,color:"#2ECC71",marginBottom:4 }}>All done for today!</div>
              <div style={{ fontSize:13,color:MUTED }}>Come back tomorrow to keep your streak.</div>
            </div>
          ) : (
            <div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleProofUpload} />

              {!proofImage ? (
                <div onClick={()=>fileRef.current?.click()} style={{ border: proofError?"2px dashed #FF6B6B":`2px dashed rgba(124,92,255,0.4)`, borderRadius:14,padding:"26px 16px",cursor:"pointer",textAlign:"center",marginBottom:12,background:proofError?"rgba(255,107,107,0.05)":"rgba(124,92,255,0.04)" }}>
                  <div style={{ fontSize:38,marginBottom:10 }}>📸</div>
                  <div style={{ fontSize:15,color:proofError?"#FF6B6B":"rgba(255,255,255,0.6)",marginBottom:4 }}>
                    {proofError?"⚠️ Proof required to check in!":"Upload today's proof screenshot"}
                  </div>
                  <div style={{ fontSize:12,color:MUTED }}>Tap to choose image · Required to unlock check-in</div>
                </div>
              ) : (
                <div style={{ position:"relative",marginBottom:12 }}>
                  <img src={proofImage} alt="proof" style={{ width:"100%",borderRadius:14,border:"2px solid rgba(0,229,255,0.4)",maxHeight:180,objectFit:"cover",display:"block" }} />
                  <div style={{ position:"absolute",top:8,right:8,background:"rgba(0,229,255,0.9)",borderRadius:100,padding:"4px 10px",fontSize:11,color:"#000",fontWeight:"bold" }}>✅ Ready</div>
                  <button onClick={()=>setProofImage(null)} style={{ position:"absolute",top:8,left:8,background:"rgba(0,0,0,0.75)",border:"none",borderRadius:100,padding:"4px 10px",fontSize:11,color:"#fff",cursor:"pointer" }}>✕ Remove</button>
                </div>
              )}

              <button onClick={handleCheckin} style={{ ...gbtn(PURPLE,!proofImage), padding:"15px",width:"100%",fontSize:16 }}>
                {proofImage ? "⚡ Check In Today" : "🔒 Upload proof to unlock"}
              </button>
            </div>
          )}
        </div>

        {/* RITUAL ENERGY */}
        <div style={{ ...glass({padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}) }}>
          <div>
            <div style={{ fontSize:12,color:MUTED,marginBottom:2 }}>Ritual Energy</div>
            <div style={{ fontSize:20,fontWeight:"bold",color:GOLD }}>+35 XP per check-in</div>
          </div>
          <div style={{ fontSize:36 }}>⚡</div>
        </div>
      </div>

      {/* CAT MASCOT */}
      <div style={{ position:"fixed",bottom:82,right:14,zIndex:15,maxWidth:190 }}>
        <div style={{ background:"rgba(124,92,255,0.14)",border:`1px solid ${BORDER}`,borderRadius:"14px 14px 14px 4px",padding:"10px 14px",fontSize:11,color:"rgba(255,255,255,0.8)",lineHeight:1.5,marginBottom:4 }}>
          {catMsg}
        </div>
        <div style={{ fontSize:30,textAlign:"right",paddingRight:4 }}>😺</div>
      </div>

      <Nav />
    </div>
  );

  // ══════════════════════════════
  // WEEKLY
  // ══════════════════════════════
  if (screen === "weekly") return (
    <div style={{ ...pageBg,paddingBottom:90 }}>
      <Head><title>Weekly Activity</title></Head>
      <div style={{ padding:"24px 20px" }}>
        <div style={{ fontSize:11,color:MUTED,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:4 }}>Progress</div>
        <h2 style={{ margin:"0 0 22px",fontSize:26 }}>Weekly Activity</h2>

        <div style={{ ...glass({padding:24,marginBottom:16}) }}>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6,marginBottom:20 }}>
            {DAYS.map((d,i)=>(
              <div key={d} style={{ textAlign:"center" }}>
                <div style={{ fontSize:10,color:MUTED,marginBottom:6 }}>{d}</div>
                <div style={{ width:34,height:34,borderRadius:"50%",margin:"0 auto",background:weekDays[i]?`linear-gradient(135deg,${PURPLE},${CYAN})`:"rgba(255,255,255,0.05)",border:weekDays[i]?"none":"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,boxShadow:weekDays[i]?`0 0 12px ${PURPLE}66`:"none" }}>
                  {weekDays[i]?"✔":"○"}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:12,color:MUTED,display:"flex",justifyContent:"space-between",marginBottom:6 }}>
            <span>Week Progress</span><span>{weekDays.filter(Boolean).length}/7 days</span>
          </div>
          <div style={{ height:8,background:"rgba(255,255,255,0.06)",borderRadius:4,marginBottom:10 }}>
            <div style={{ height:"100%",width:`${(weekDays.filter(Boolean).length/7)*100}%`,background:`linear-gradient(90deg,${PURPLE},${CYAN})`,borderRadius:4,boxShadow:`0 0 10px ${PURPLE}77` }} />
          </div>
          <div style={{ fontSize:12,color:CYAN }}>Next check-in unlocks +5 XP ⚡</div>
        </div>

        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          {[
            {label:"Current Streak",value:`${streak} days`,icon:"🔥",c:PURPLE},
            {label:"Total XP",value:`${xp} XP`,icon:"⚡",c:GOLD},
            {label:"This Week",value:`${weekDays.filter(Boolean).length} days`,icon:"📅",c:CYAN},
            {label:"Top Badge",value:earnedBadges.length?earnedBadges[earnedBadges.length-1].name:"None yet",icon:"🏆",c:PURPLE},
          ].map(s=>(
            <div key={s.label} style={{ ...glass({padding:"18px 16px"}) }}>
              <div style={{ fontSize:26,marginBottom:8 }}>{s.icon}</div>
              <div style={{ fontSize:17,fontWeight:"bold",color:s.c,marginBottom:2 }}>{s.value}</div>
              <div style={{ fontSize:11,color:MUTED }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <Nav />
    </div>
  );

  // ══════════════════════════════
  // BADGES
  // ══════════════════════════════
  if (screen === "badges") return (
    <div style={{ ...pageBg,paddingBottom:90 }}>
      <Head><title>Achievements</title></Head>
      <div style={{ padding:"24px 20px" }}>
        <div style={{ fontSize:11,color:MUTED,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:4 }}>Gamified Progress</div>
        <h2 style={{ margin:"0 0 22px",fontSize:26 }}>Achievements</h2>
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          {BADGES.map(b=>{
            const earned = streak >= b.req;
            const pct = Math.min((streak/b.req)*100,100);
            return (
              <div key={b.id} style={{ ...glass({padding:"20px 22px",border:`1px solid ${earned?b.color+"55":BORDER}`,opacity:earned?1:0.65}) }}>
                <div style={{ display:"flex",alignItems:"center",gap:16 }}>
                  <div style={{ fontSize:46,filter:earned?"none":"grayscale(1)",width:54,textAlign:"center",flexShrink:0 }}>{b.emoji}</div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap" }}>
                      <span style={{ fontSize:17,fontWeight:"bold",color:earned?b.color:"#fff" }}>{b.name}</span>
                      {earned && <span style={{ background:`${b.color}22`,border:`1px solid ${b.color}55`,borderRadius:100,padding:"2px 8px",fontSize:9,color:b.color,letterSpacing:"0.05em" }}>EARNED ✓</span>}
                    </div>
                    <div style={{ fontSize:12,color:MUTED,marginBottom:10 }}>{b.desc}</div>
                    <div style={{ height:5,background:"rgba(255,255,255,0.07)",borderRadius:3 }}>
                      <div style={{ height:"100%",width:`${pct}%`,background:earned?`linear-gradient(90deg,${b.color},${b.color}aa)`:`linear-gradient(90deg,${PURPLE}66,${PURPLE}33)`,borderRadius:3,boxShadow:earned?`0 0 8px ${b.color}77`:"none" }} />
                    </div>
                    <div style={{ fontSize:11,color:MUTED,marginTop:5 }}>{streak}/{b.req} days</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Nav />
    </div>
  );

  // ══════════════════════════════
  // LEADERBOARD
  // ══════════════════════════════
  if (screen === "leaderboard") return (
    <div style={{ ...pageBg,paddingBottom:90 }}>
      <Head><title>Leaderboard</title></Head>
      <div style={{ padding:"24px 20px" }}>
        <div style={{ fontSize:11,color:MUTED,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:4 }}>Rankings</div>
        <h2 style={{ margin:"0 0 6px",fontSize:26 }}>Top Ritual Builders</h2>
        <p style={{ color:MUTED,fontSize:13,margin:"0 0 22px" }}>Climb the leaderboard by staying active daily</p>
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {LEADERBOARD.map(u=>(
            <div key={u.rank} style={{ ...glass({padding:"16px 18px",border:`1px solid ${u.rank===1?GOLD+"44":u.rank===2?"rgba(192,192,192,0.2)":u.rank===3?"rgba(205,127,50,0.2)":BORDER}`}),display:"flex",alignItems:"center",gap:14 }}>
              <div style={{ fontSize:26,width:34,textAlign:"center",flexShrink:0 }}>{u.rank===1?"🥇":u.rank===2?"🥈":u.rank===3?"🥉":`#${u.rank}`}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:16,fontWeight:"bold" }}>{u.name}</div>
                <div style={{ fontSize:12,color:MUTED }}>{u.xp} XP total</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:15,color:u.rank===1?GOLD:PURPLE }}>{u.badge} {u.streak} days</div>
              </div>
            </div>
          ))}
          <div style={{ ...glass({padding:"16px 18px",border:`1px solid ${PURPLE}55`,background:"rgba(124,92,255,0.07)"}),display:"flex",alignItems:"center",gap:14 }}>
            <div style={{ fontSize:26,width:34,textAlign:"center",flexShrink:0 }}>👤</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:16,fontWeight:"bold",color:PURPLE }}>{username} (You)</div>
              <div style={{ fontSize:12,color:MUTED }}>{xp} XP total</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:15,color:PURPLE }}>🔥 {streak} days</div>
            </div>
          </div>
        </div>
      </div>
      <Nav />
    </div>
  );

  // ══════════════════════════════
  // CONTRIBUTIONS
  // ══════════════════════════════
  if (screen === "contributions") return (
    <div style={{ ...pageBg,paddingBottom:90 }}>
      <Head><title>My Contributions</title></Head>
      <div style={{ padding:"24px 20px" }}>
        <div style={{ fontSize:11,color:MUTED,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:4 }}>Activity Log</div>
        <h2 style={{ margin:"0 0 6px",fontSize:26 }}>My Daily Contributions</h2>
        <p style={{ color:MUTED,fontSize:13,margin:"0 0 20px" }}>Add your Twitter/X post links day by day</p>

        <div style={{ ...glass({padding:20,marginBottom:20}) }}>
          <div style={{ fontSize:12,color:CYAN,marginBottom:14,textTransform:"uppercase",letterSpacing:"0.08em" }}>+ Add New Link</div>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            <input type="text" placeholder="Day label (e.g. Day 3 – Thread)" value={newLinkDay} onChange={e=>setNewLinkDay(e.target.value)} style={inp} />
            <input type="url" placeholder="Paste your Twitter/X post URL" value={newLink} onChange={e=>setNewLink(e.target.value)} style={inp} />
            <input type="text" placeholder="Note (optional)" value={newLinkNote} onChange={e=>setNewLinkNote(e.target.value)} style={inp} />
            <button onClick={handleAddLink} style={{ ...gbtn(PURPLE),padding:"13px",width:"100%",fontSize:15 }}>Save Contribution →</button>
          </div>
        </div>

        {contributions.length===0 ? (
          <div style={{ textAlign:"center",padding:"40px 20px",color:MUTED }}>
            <div style={{ fontSize:52,marginBottom:12 }}>🔗</div>
            <p style={{ margin:0 }}>No contributions yet. Add your first link above!</p>
          </div>
        ) : (
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {contributions.map(c=>(
              <div key={c.id} style={{ ...glass({padding:"16px 18px",borderLeft:`3px solid ${PURPLE}`}) }}>
                <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10 }}>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:13,color:PURPLE,fontWeight:"bold",marginBottom:5 }}>{c.day}</div>
                    <a href={c.link} target="_blank" rel="noreferrer" style={{ fontSize:12,color:CYAN,wordBreak:"break-all",display:"block",marginBottom:4,textDecoration:"none" }}>🔗 {c.link}</a>
                    {c.note && <div style={{ fontSize:12,color:MUTED,marginBottom:4 }}>{c.note}</div>}
                    <div style={{ fontSize:11,color:"rgba(255,255,255,0.2)" }}>{c.date}</div>
                  </div>
                  <button onClick={()=>{ const u=contributions.filter(x=>x.id!==c.id); setContributions(u); localStorage.setItem("ru_contrib",JSON.stringify(u)); }} style={{ background:"rgba(255,107,107,0.1)",border:"1px solid rgba(255,107,107,0.3)",borderRadius:8,padding:"5px 10px",color:"#FF6B6B",cursor:"pointer",fontSize:12,flexShrink:0,fontFamily:"Georgia,serif" }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Nav />
    </div>
  );

  // ══════════════════════════════
  // GALLERY
  // ══════════════════════════════
  if (screen === "gallery") return (
    <div style={{ ...pageBg,paddingBottom:90 }}>
      <Head><title>My Art Gallery</title></Head>
      <div style={{ padding:"24px 20px" }}>
        <div style={{ fontSize:11,color:MUTED,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:4 }}>Creative Work</div>
        <h2 style={{ margin:"0 0 6px",fontSize:26 }}>My Art Gallery</h2>
        <p style={{ color:MUTED,fontSize:13,margin:"0 0 20px" }}>Save and showcase your Ritual artwork</p>

        <input ref={artRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleArtUpload} />
        <button onClick={()=>artRef.current?.click()} style={{ ...gbtn(CYAN),padding:"14px",width:"100%",color:"#000",fontWeight:"bold",marginBottom:20,fontSize:15,display:"block" }}>
          🎨 Upload New Artwork
        </button>

        {gallery.length===0 ? (
          <div style={{ textAlign:"center",padding:"40px 20px",color:MUTED }}>
            <div style={{ fontSize:64,marginBottom:12 }}>🖼️</div>
            <p style={{ margin:0 }}>Your gallery is empty.<br/>Upload your first artwork!</p>
          </div>
        ) : (
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
            {gallery.map(art=>(
              <div key={art.id} style={{ ...glass({padding:0,overflow:"hidden"}),position:"relative" }}>
                <img src={art.src} alt={art.name} style={{ width:"100%",aspectRatio:"1",objectFit:"cover",display:"block" }} />
                <div style={{ padding:"10px 12px",background:"rgba(11,15,26,0.85)" }}>
                  <div style={{ fontSize:11,color:"rgba(255,255,255,0.75)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{art.name}</div>
                  <div style={{ fontSize:10,color:MUTED }}>{art.date}</div>
                </div>
                <button onClick={()=>{ const u=gallery.filter(a=>a.id!==art.id); setGallery(u); localStorage.setItem("ru_gallery",JSON.stringify(u)); }} style={{ position:"absolute",top:8,right:8,background:"rgba(0,0,0,0.75)",border:"none",borderRadius:100,width:26,height:26,color:"#fff",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif" }}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Nav />
    </div>
  );

  return null;
}

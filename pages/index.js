import { useState, useEffect, useRef } from "react";
import Head from "next/head";

const BADGES = [
  { id:1, emoji:"🐾", name:"Ritty Bitty", desc:"10 Day Streak", req:10, color:"#7C5CFF" },
  { id:2, emoji:"🐱", name:"Ritty",       desc:"15 Day Streak", req:15, color:"#00E5FF" },
  { id:3, emoji:"⚡", name:"Ritualist",   desc:"30 Day Streak", req:30, color:"#FFD166" },
  { id:4, emoji:"👑", name:"Radiant",     desc:"60 Day Streak", req:60, color:"#FF6B6B" },
  { id:5, emoji:"🔒", name:"Dev Master",  desc:"100 Day Streak",req:100,color:"#888" },
];

const LEADERBOARD_DEFAULT = [
  { rank:1, name:"Alice",     code:"4521", streak:45, badge:"🔥", xp:900 },
  { rank:2, name:"DevX",      code:"8832", streak:30, badge:"⚡", xp:600 },
  { rank:3, name:"Dolex",     code:"1194", streak:21, badge:"🎨", xp:420 },
  { rank:4, name:"CryptoSam", code:"3307", streak:18, badge:"🧠", xp:360 },
  { rank:5, name:"RitualMax", code:"7760", streak:14, badge:"🐱", xp:280 },
];

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const CAT_MSGS = [
  "Don't break your streak builder. Proof > trust.",
  "Every day counts. Show up!",
  "Your consistency is your superpower.",
  "Legendary builders check in daily. Are you one?",
  "Upload that proof. The chain won't break itself!",
];

const BG    = "#0B0F1A";
const PUR   = "#7C5CFF";
const CYAN  = "#00E5FF";
const GOLD  = "#FFD166";
const MUTED = "rgba(255,255,255,0.4)";
const BORD  = "rgba(124,92,255,0.25)";

const glass = (x={}) => ({ background:"rgba(255,255,255,0.04)", border:`1px solid ${BORD}`, borderRadius:20, ...x });
const gbtn  = (c=PUR,dis=false) => ({ background:dis?"rgba(255,255,255,0.07)":`linear-gradient(135deg,${c},${c}cc)`, border:"none", borderRadius:14, color:dis?"rgba(255,255,255,0.25)":"#fff", fontSize:15, fontWeight:700, cursor:dis?"not-allowed":"pointer", fontFamily:"Georgia,serif", boxShadow:dis?"none":`0 0 20px ${c}44`, transition:"all 0.2s" });
const inp   = { background:"rgba(255,255,255,0.05)", border:`1px solid ${BORD}`, borderRadius:12, padding:"13px 16px", color:"#fff", fontSize:14, outline:"none", fontFamily:"Georgia,serif", boxSizing:"border-box", width:"100%" };
const pageBg = { margin:0, padding:0, background:BG, minHeight:"100vh", fontFamily:"Georgia,serif", color:"#fff", backgroundImage:`radial-gradient(ellipse at 15% 10%,rgba(124,92,255,0.13) 0%,transparent 50%),radial-gradient(ellipse at 85% 85%,rgba(0,229,255,0.07) 0%,transparent 50%),linear-gradient(rgba(124,92,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(124,92,255,0.025) 1px,transparent 1px)`, backgroundSize:"100% 100%,100% 100%,36px 36px,36px 36px" };

const fmtTime = (ms) => {
  if (ms <= 0) return "now";
  const h = Math.floor(ms/3600000);
  const m = Math.floor((ms%3600000)/60000);
  const s = Math.floor((ms%60000)/1000);
  return `${h}h ${m}m ${s}s`;
};

export default function App() {
  const [screen,         setScreen]         = useState("landing");
  const [username,       setUsername]       = useState("");
  const [userCode,       setUserCode]       = useState("");
  const [inputName,      setInputName]      = useState("");
  const [inputCode,      setInputCode]      = useState("");
  const [codeError,      setCodeError]      = useState("");
  const [streak,         setStreak]         = useState(0);
  const [bestStreak,     setBestStreak]     = useState(0);
  const [xp,             setXp]             = useState(0);
  const [checkedToday,   setCheckedToday]   = useState(false);
  const [lastCheckin,    setLastCheckin]    = useState(null);
  const [nextReset,      setNextReset]      = useState(null);
  const [proofImage,     setProofImage]     = useState(null);
  const [proofError,     setProofError]     = useState(false);
  const [showCelebration,setShowCelebration]= useState(false);
  const [contributions,  setContributions]  = useState([]);
  const [newLink,        setNewLink]        = useState("");
  const [newLinkDay,     setNewLinkDay]     = useState("");
  const [newLinkNote,    setNewLinkNote]    = useState("");
  const [gallery,        setGallery]        = useState([]);
  const [weekDays,       setWeekDays]       = useState([false,false,false,false,false,false,false]);
  const [timeLeft,       setTimeLeft]       = useState(0);
  const [viewProfile,    setViewProfile]    = useState(null);
  const [copied,         setCopied]         = useState(false); // ← MOVED HERE (was inside if block — that caused the error!)
  const [catIdx]                            = useState(Math.floor(Math.random()*CAT_MSGS.length));
  const fileRef = useRef(null);
  const artRef  = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash.startsWith("#profile/")) {
      const key = hash.replace("#profile/","");
      const data = localStorage.getItem(`ritual_profile_${key}`);
      if (data) { setViewProfile(JSON.parse(data)); setScreen("viewProfile"); return; }
    }
    const u    = localStorage.getItem("ru_user");
    const code = localStorage.getItem("ru_code");
    const s    = localStorage.getItem("ru_streak");
    const bs   = localStorage.getItem("ru_best");
    const xpS  = localStorage.getItem("ru_xp");
    const last = localStorage.getItem("ru_last_ts");
    const cont = localStorage.getItem("ru_contrib");
    const gal  = localStorage.getItem("ru_gallery");
    const wd   = localStorage.getItem("ru_weekdays");
    if (u && code) { setUsername(u); setUserCode(code); setScreen("home"); }
    if (s)    setStreak(parseInt(s));
    if (bs)   setBestStreak(parseInt(bs));
    if (xpS)  setXp(parseInt(xpS));
    if (cont) setContributions(JSON.parse(cont));
    if (gal)  setGallery(JSON.parse(gal));
    if (wd)   setWeekDays(JSON.parse(wd));
    if (last) {
      const ts = parseInt(last);
      setLastCheckin(ts);
      const elapsed = Date.now() - ts;
      if (elapsed < 86400000) {
        setCheckedToday(true);
        setNextReset(ts + 86400000);
        setTimeLeft(ts + 86400000 - Date.now());
      }
    }
  }, []);

  useEffect(() => {
    if (!nextReset) return;
    const tick = setInterval(() => {
      const left = nextReset - Date.now();
      if (left <= 0) {
        setCheckedToday(false); setNextReset(null); setProofImage(null); setTimeLeft(0);
        clearInterval(tick);
      } else {
        setTimeLeft(left);
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [nextReset]);

  const syncProfile = (name, code, s, bs, xpV, cont, gal) => {
    const key = `${name.toLowerCase()}_${code}`;
    const data = { username:name, code, streak:s, bestStreak:bs, xp:xpV, contributions:cont, gallery:gal, earnedBadges:BADGES.filter(b=>s>=b.req), updatedAt:new Date().toLocaleDateString() };
    localStorage.setItem(`ritual_profile_${key}`, JSON.stringify(data));
  };

  const handleStart = () => {
    if (!inputName.trim()) { setCodeError("Enter a username"); return; }
    if (!/^\d{4}$/.test(inputCode)) { setCodeError("Code must be exactly 4 digits"); return; }
    const name = inputName.trim(); const code = inputCode.trim();
    setUsername(name); setUserCode(code);
    localStorage.setItem("ru_user", name);
    localStorage.setItem("ru_code", code);
    setCodeError("");
    setScreen("home");
  };

  const handleProofUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = ev => { setProofImage(ev.target.result); setProofError(false); };
    r.readAsDataURL(file);
  };

  const handleArtUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = ev => {
      const art = { id:Date.now(), src:ev.target.result, name:file.name, date:new Date().toLocaleDateString() };
      const updated = [art,...gallery];
      setGallery(updated);
      localStorage.setItem("ru_gallery", JSON.stringify(updated));
      syncProfile(username, userCode, streak, bestStreak, xp, contributions, updated);
    };
    r.readAsDataURL(file);
  };

  const handleCheckin = () => {
    if (checkedToday) return;
    if (!proofImage) { setProofError(true); setTimeout(()=>setProofError(false),1500); return; }
    const ns=streak+1, nx=xp+35, nbs=Math.max(bestStreak,ns), now=Date.now(), resetAt=now+86400000;
    const dayIdx = new Date().getDay();
    const mi = dayIdx===0?6:dayIdx-1;
    const newWd = [...weekDays]; newWd[mi]=true;
    setWeekDays(newWd); setStreak(ns); setXp(nx); setBestStreak(nbs);
    setCheckedToday(true); setLastCheckin(now); setNextReset(resetAt); setTimeLeft(86400000);
    localStorage.setItem("ru_streak",ns.toString());
    localStorage.setItem("ru_xp",nx.toString());
    localStorage.setItem("ru_best",nbs.toString());
    localStorage.setItem("ru_last_ts",now.toString());
    localStorage.setItem("ru_weekdays",JSON.stringify(newWd));
    syncProfile(username,userCode,ns,nbs,nx,contributions,gallery);
    setShowCelebration(true);
    setTimeout(()=>setShowCelebration(false),3000);
  };

  const handleAddLink = () => {
    if (!newLink.trim()||!newLinkDay.trim()) return;
    const entry = { id:Date.now(), day:newLinkDay, link:newLink, note:newLinkNote, date:new Date().toLocaleDateString() };
    const updated = [entry,...contributions];
    setContributions(updated);
    localStorage.setItem("ru_contrib",JSON.stringify(updated));
    syncProfile(username,userCode,streak,bestStreak,xp,updated,gallery);
    setNewLink(""); setNewLinkDay(""); setNewLinkNote("");
  };

  const profileLink = typeof window!=="undefined"
    ? `${window.location.origin}${window.location.pathname}#profile/${username.toLowerCase()}_${userCode}`
    : "";

  const copyLink = () => {
    navigator.clipboard.writeText(profileLink).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); });
  };

  const earnedBadges = BADGES.filter(b=>streak>=b.req);
  const nextBadge    = BADGES.find(b=>streak<b.req);

  const Nav = () => (
    <div style={{ display:"flex",justifyContent:"space-around",padding:"10px 4px 14px",borderTop:`1px solid ${BORD}`,background:"rgba(11,15,26,0.98)",position:"fixed",bottom:0,left:0,right:0,zIndex:30 }}>
      {[
        {id:"home",icon:"🏠",label:"Home"},
        {id:"weekly",icon:"📅",label:"Week"},
        {id:"badges",icon:"🏆",label:"Badges"},
        {id:"leaderboard",icon:"⚡",label:"Ranks"},
        {id:"contributions",icon:"🔗",label:"Links"},
        {id:"gallery",icon:"🎨",label:"Gallery"},
        {id:"profile",icon:"👤",label:"Profile"},
      ].map(n=>(
        <button key={n.id} onClick={()=>setScreen(n.id)} style={{ background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"4px 4px" }}>
          <span style={{ fontSize:19 }}>{n.icon}</span>
          <span style={{ fontSize:8,color:screen===n.id?PUR:MUTED,fontFamily:"Georgia,serif" }}>{n.label}</span>
          {screen===n.id&&<div style={{ width:4,height:4,borderRadius:"50%",background:PUR,marginTop:1 }}/>}
        </button>
      ))}
    </div>
  );

  // ══════════════════════════════
  // LANDING
  // ══════════════════════════════
  if (screen==="landing") return (
    <div style={{ ...pageBg,display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
      <Head><title>Ritual Daily Streak 🔥</title></Head>
      <div style={{ width:"100%",maxWidth:420 }}>
        <div style={{ textAlign:"center",marginBottom:30 }}>
          <img src="/ritual-logo.jpg" alt="Ritual" style={{ width:70,height:70,borderRadius:14,marginBottom:12,border:`2px solid ${BORD}` }} />
          <div style={{ fontSize:11,color:PUR,letterSpacing:"0.3em",textTransform:"uppercase",marginBottom:6 }}>Ritual Network</div>
          <h1 style={{ fontSize:36,margin:0,lineHeight:1.1 }}>Daily <span style={{ color:PUR }}>Streak</span></h1>
        </div>

        <div style={{ ...glass({padding:"24px 22px",marginBottom:18}),textAlign:"center" }}>
          <p style={{ fontSize:15,lineHeight:1.8,color:"rgba(255,255,255,0.8)",margin:"0 0 14px" }}>
            Build consistency.<br/><span style={{ color:CYAN }}>Earn Ritual energy.</span><br/>Stay active in the community.
          </p>
          <div style={{ width:48,height:2,background:`linear-gradient(90deg,${PUR},${CYAN})`,margin:"0 auto 14px" }}/>
          <div style={{ display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap" }}>
            {["📸 Proof required","🔥 Daily streaks","🏆 Badges","🎨 Gallery","🔗 Share Profile"].map(f=>(
              <span key={f} style={{ background:"rgba(124,92,255,0.1)",border:`1px solid ${BORD}`,borderRadius:100,padding:"3px 9px",fontSize:10,color:MUTED }}>{f}</span>
            ))}
          </div>
        </div>

        <div style={{ ...glass({padding:"20px 18px",marginBottom:12}) }}>
          <div style={{ fontSize:11,color:CYAN,marginBottom:10,letterSpacing:"0.08em",textTransform:"uppercase" }}>Create Your Profile</div>
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            <input type="text" placeholder="Your Ritual username" value={inputName} onChange={e=>setInputName(e.target.value)} style={inp}/>
            <input type="text" placeholder="Choose a 4-digit code (e.g. 4269)" value={inputCode} onChange={e=>setInputCode(e.target.value.replace(/\D/g,"").slice(0,4))} onKeyDown={e=>e.key==="Enter"&&handleStart()} style={inp} maxLength={4}/>
            {codeError && <div style={{ fontSize:12,color:"#FF6B6B" }}>⚠️ {codeError}</div>}
            <div style={{ fontSize:11,color:MUTED }}>Profile ID: <span style={{ color:PUR,fontWeight:"bold" }}>{inputName||"username"}#{inputCode||"0000"}</span></div>
          </div>
        </div>

        <button onClick={handleStart} style={{ ...gbtn(PUR),padding:15,fontSize:15,width:"100%",marginBottom:10 }}>Start Building →</button>
        <p style={{ textAlign:"center",color:"rgba(255,255,255,0.18)",fontSize:11,margin:0 }}>Track your daily Ritual contributions</p>
      </div>
    </div>
  );

  // ══════════════════════════════
  // HOME
  // ══════════════════════════════
  if (screen==="home") return (
    <div style={{ ...pageBg,paddingBottom:90 }}>
      <Head><title>Ritual Daily Streak 🔥</title></Head>

      {showCelebration && (
        <div style={{ position:"fixed",inset:0,zIndex:999,background:"rgba(11,15,26,0.96)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:14 }}>
          <img src="/ritual-cat.png" alt="cat" style={{ width:130,filter:"drop-shadow(0 0 20px rgba(124,92,255,0.8))" }}/>
          <div style={{ fontSize:28,fontWeight:"bold",color:PUR }}>Streak Extended! 🔥</div>
          <div style={{ fontSize:20,color:GOLD }}>+35 XP Earned ⚡</div>
          <div style={{ fontSize:14,color:MUTED }}>Day {streak} complete. Keep going!</div>
        </div>
      )}

      <div style={{ padding:"20px 20px 0",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <img src="/ritual-logo.jpg" alt="Ritual" style={{ width:34,height:34,borderRadius:8,border:`1px solid ${BORD}` }}/>
          <div>
            <div style={{ fontSize:10,color:MUTED,letterSpacing:"0.08em" }}>WELCOME BACK</div>
            <div style={{ fontSize:17,fontWeight:"bold" }}>{username}<span style={{ color:MUTED,fontSize:12 }}>#{userCode}</span></div>
          </div>
        </div>
        <div style={{ ...glass({padding:"7px 13px",borderRadius:100}),fontSize:13,color:GOLD }}>⚡ {xp} XP</div>
      </div>

      <div style={{ padding:"14px 20px",display:"flex",flexDirection:"column",gap:14 }}>
        <div style={{ ...glass({padding:22,textAlign:"center",position:"relative",overflow:"hidden"}) }}>
          <div style={{ position:"absolute",top:-8,right:-8,fontSize:90,opacity:0.04 }}>🔥</div>
          <div style={{ fontSize:10,color:MUTED,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:6 }}>Current Streak</div>
          <div style={{ fontSize:68,fontWeight:"bold",color:PUR,lineHeight:1 }}>{streak}</div>
          <div style={{ fontSize:16,color:MUTED,marginBottom:12 }}>Days 🔥</div>
          {earnedBadges.length>0 && <div style={{ display:"flex",gap:8,justifyContent:"center",marginBottom:12 }}>{earnedBadges.slice(-3).map(b=><span key={b.id} style={{ fontSize:24 }}>{b.emoji}</span>)}</div>}
          {nextBadge && <div style={{ background:"rgba(124,92,255,0.1)",border:`1px solid ${BORD}`,borderRadius:12,padding:"9px 13px",fontSize:12,color:MUTED }}>Next → <span style={{ color:GOLD }}>{nextBadge.emoji} {nextBadge.name}</span> at {nextBadge.req} days</div>}
        </div>

        <div style={{ ...glass({padding:20}) }}>
          <div style={{ fontSize:10,color:MUTED,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12 }}>Today's Check-in</div>
          {checkedToday ? (
            <div style={{ textAlign:"center",padding:"12px 0" }}>
              <div style={{ fontSize:42,marginBottom:8 }}>✅</div>
              <div style={{ fontSize:14,color:"#2ECC71",marginBottom:10 }}>Checked in! Streak secured.</div>
              <div style={{ ...glass({padding:"10px 14px",borderRadius:12,display:"inline-block"}) }}>
                <div style={{ fontSize:10,color:MUTED,marginBottom:2 }}>Next check-in unlocks in</div>
                <div style={{ fontSize:20,fontWeight:"bold",color:CYAN }}>⏱ {fmtTime(timeLeft)}</div>
              </div>
            </div>
          ) : (
            <div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleProofUpload}/>
              {!proofImage ? (
                <div onClick={()=>fileRef.current?.click()} style={{ border:proofError?"2px dashed #FF6B6B":`2px dashed rgba(124,92,255,0.4)`,borderRadius:14,padding:"22px 14px",cursor:"pointer",textAlign:"center",marginBottom:12,background:proofError?"rgba(255,107,107,0.05)":"rgba(124,92,255,0.04)" }}>
                  <div style={{ fontSize:34,marginBottom:8 }}>📸</div>
                  <div style={{ fontSize:13,color:proofError?"#FF6B6B":"rgba(255,255,255,0.6)",marginBottom:4 }}>{proofError?"⚠️ Proof required!":"Upload today's proof screenshot"}</div>
                  <div style={{ fontSize:11,color:MUTED }}>Tap to choose · Required to check in</div>
                </div>
              ) : (
                <div style={{ position:"relative",marginBottom:12 }}>
                  <img src={proofImage} alt="proof" style={{ width:"100%",borderRadius:14,border:"2px solid rgba(0,229,255,0.4)",maxHeight:170,objectFit:"cover",display:"block" }}/>
                  <div style={{ position:"absolute",top:8,right:8,background:"rgba(0,229,255,0.9)",borderRadius:100,padding:"4px 10px",fontSize:11,color:"#000",fontWeight:"bold" }}>✅ Ready</div>
                  <button onClick={()=>setProofImage(null)} style={{ position:"absolute",top:8,left:8,background:"rgba(0,0,0,0.75)",border:"none",borderRadius:100,padding:"4px 10px",fontSize:11,color:"#fff",cursor:"pointer" }}>✕</button>
                </div>
              )}
              <button onClick={handleCheckin} style={{ ...gbtn(PUR,!proofImage),padding:"14px",width:"100%",fontSize:15 }}>
                {proofImage?"⚡ Check In Today":"🔒 Upload proof to unlock"}
              </button>
            </div>
          )}
        </div>

        <div style={{ ...glass({padding:"13px 17px",display:"flex",alignItems:"center",justifyContent:"space-between"}) }}>
          <div>
            <div style={{ fontSize:10,color:MUTED,marginBottom:2 }}>Ritual Energy</div>
            <div style={{ fontSize:17,fontWeight:"bold",color:GOLD }}>+35 XP per check-in</div>
          </div>
          <div style={{ fontSize:32 }}>⚡</div>
        </div>
      </div>

      <div style={{ position:"fixed",bottom:84,right:12,zIndex:15,maxWidth:175 }}>
        <div style={{ background:"rgba(124,92,255,0.14)",border:`1px solid ${BORD}`,borderRadius:"13px 13px 13px 4px",padding:"8px 11px",fontSize:11,color:"rgba(255,255,255,0.8)",lineHeight:1.5,marginBottom:2 }}>
          {CAT_MSGS[catIdx]}
        </div>
        <img src="/ritual-cat.png" alt="cat" style={{ width:66,float:"right",filter:"drop-shadow(0 0 8px rgba(124,92,255,0.5))" }}/>
        <div style={{ clear:"both" }}/>
      </div>

      <Nav/>
    </div>
  );

  // ══════════════════════════════
  // WEEKLY
  // ══════════════════════════════
  if (screen==="weekly") return (
    <div style={{ ...pageBg,paddingBottom:90 }}>
      <Head><title>Weekly Activity</title></Head>
      <div style={{ padding:"24px 20px" }}>
        <div style={{ fontSize:11,color:MUTED,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:4 }}>Progress</div>
        <h2 style={{ margin:"0 0 20px",fontSize:26 }}>Weekly Activity</h2>
        <div style={{ ...glass({padding:22,marginBottom:14}) }}>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6,marginBottom:16 }}>
            {DAYS.map((d,i)=>(
              <div key={d} style={{ textAlign:"center" }}>
                <div style={{ fontSize:9,color:MUTED,marginBottom:5 }}>{d}</div>
                <div style={{ width:32,height:32,borderRadius:"50%",margin:"0 auto",background:weekDays[i]?`linear-gradient(135deg,${PUR},${CYAN})`:"rgba(255,255,255,0.05)",border:weekDays[i]?"none":"1px solid rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,boxShadow:weekDays[i]?`0 0 10px ${PUR}66`:"none" }}>
                  {weekDays[i]?"✔":"○"}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:MUTED,marginBottom:5 }}>
            <span>Week Progress</span><span>{weekDays.filter(Boolean).length}/7 days</span>
          </div>
          <div style={{ height:7,background:"rgba(255,255,255,0.06)",borderRadius:4,marginBottom:8 }}>
            <div style={{ height:"100%",width:`${(weekDays.filter(Boolean).length/7)*100}%`,background:`linear-gradient(90deg,${PUR},${CYAN})`,borderRadius:4 }}/>
          </div>
          <div style={{ fontSize:11,color:CYAN }}>Next check-in unlocks +5 XP ⚡</div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          {[
            {label:"Current Streak",value:`${streak} days`,icon:"🔥",c:PUR},
            {label:"Best Streak",   value:`${bestStreak} days`,icon:"🏅",c:GOLD},
            {label:"Total XP",      value:`${xp} XP`,icon:"⚡",c:GOLD},
            {label:"Top Badge",     value:earnedBadges.length?earnedBadges[earnedBadges.length-1].name:"None yet",icon:"🏆",c:CYAN},
          ].map(s=>(
            <div key={s.label} style={{ ...glass({padding:"15px 13px"}) }}>
              <div style={{ fontSize:22,marginBottom:5 }}>{s.icon}</div>
              <div style={{ fontSize:15,fontWeight:"bold",color:s.c,marginBottom:2 }}>{s.value}</div>
              <div style={{ fontSize:10,color:MUTED }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <Nav/>
    </div>
  );

  // ══════════════════════════════
  // BADGES
  // ══════════════════════════════
  if (screen==="badges") return (
    <div style={{ ...pageBg,paddingBottom:90 }}>
      <Head><title>Achievements</title></Head>
      <div style={{ padding:"24px 20px" }}>
        <div style={{ fontSize:11,color:MUTED,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:4 }}>Gamified Progress</div>
        <h2 style={{ margin:"0 0 20px",fontSize:26 }}>Achievements</h2>
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          {BADGES.map(b=>{
            const earned=streak>=b.req; const pct=Math.min((streak/b.req)*100,100);
            return (
              <div key={b.id} style={{ ...glass({padding:"17px 19px",border:`1px solid ${earned?b.color+"55":BORD}`,opacity:earned?1:0.65}) }}>
                <div style={{ display:"flex",alignItems:"center",gap:13 }}>
                  <div style={{ fontSize:42,filter:earned?"none":"grayscale(1)",width:50,textAlign:"center",flexShrink:0 }}>{b.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap" }}>
                      <span style={{ fontSize:15,fontWeight:"bold",color:earned?b.color:"#fff" }}>{b.name}</span>
                      {earned&&<span style={{ background:`${b.color}22`,border:`1px solid ${b.color}55`,borderRadius:100,padding:"2px 8px",fontSize:9,color:b.color }}>EARNED ✓</span>}
                    </div>
                    <div style={{ fontSize:12,color:MUTED,marginBottom:8 }}>{b.desc}</div>
                    <div style={{ height:4,background:"rgba(255,255,255,0.07)",borderRadius:2 }}>
                      <div style={{ height:"100%",width:`${pct}%`,background:earned?`linear-gradient(90deg,${b.color},${b.color}aa)`:`linear-gradient(90deg,${PUR}66,${PUR}33)`,borderRadius:2,boxShadow:earned?`0 0 8px ${b.color}77`:"none" }}/>
                    </div>
                    <div style={{ fontSize:10,color:MUTED,marginTop:4 }}>{streak}/{b.req} days</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Nav/>
    </div>
  );

  // ══════════════════════════════
  // LEADERBOARD
  // ══════════════════════════════
  if (screen==="leaderboard") return (
    <div style={{ ...pageBg,paddingBottom:90 }}>
      <Head><title>Leaderboard</title></Head>
      <div style={{ padding:"24px 20px" }}>
        <div style={{ fontSize:11,color:MUTED,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:4 }}>Rankings</div>
        <h2 style={{ margin:"0 0 6px",fontSize:26 }}>Top Ritual Builders</h2>
        <p style={{ color:MUTED,fontSize:13,margin:"0 0 18px" }}>Climb the leaderboard by staying active daily</p>
        <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
          {LEADERBOARD_DEFAULT.map(u=>(
            <div key={u.rank} style={{ ...glass({padding:"13px 16px",border:`1px solid ${u.rank===1?GOLD+"44":u.rank===2?"rgba(192,192,192,0.2)":u.rank===3?"rgba(205,127,50,0.2)":BORD}`}),display:"flex",alignItems:"center",gap:12 }}>
              <div style={{ fontSize:22,width:30,textAlign:"center",flexShrink:0 }}>{u.rank===1?"🥇":u.rank===2?"🥈":u.rank===3?"🥉":`#${u.rank}`}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14,fontWeight:"bold" }}>{u.name}<span style={{ fontSize:11,color:MUTED }}>#{u.code}</span></div>
                <div style={{ fontSize:11,color:MUTED }}>{u.xp} XP</div>
              </div>
              <div style={{ fontSize:13,color:u.rank===1?GOLD:PUR }}>{u.badge} {u.streak} days</div>
            </div>
          ))}
          <div style={{ ...glass({padding:"13px 16px",border:`1px solid ${PUR}55`,background:"rgba(124,92,255,0.07)"}),display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ fontSize:22,width:30,textAlign:"center",flexShrink:0 }}>👤</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14,fontWeight:"bold",color:PUR }}>{username}<span style={{ fontSize:11,color:MUTED }}>#{userCode}</span></div>
              <div style={{ fontSize:11,color:MUTED }}>{xp} XP</div>
            </div>
            <div style={{ fontSize:13,color:PUR }}>🔥 {streak} days</div>
          </div>
        </div>
      </div>
      <Nav/>
    </div>
  );

  // ══════════════════════════════
  // CONTRIBUTIONS
  // ══════════════════════════════
  if (screen==="contributions") return (
    <div style={{ ...pageBg,paddingBottom:90 }}>
      <Head><title>My Contributions</title></Head>
      <div style={{ padding:"24px 20px" }}>
        <div style={{ fontSize:11,color:MUTED,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:4 }}>Activity Log</div>
        <h2 style={{ margin:"0 0 6px",fontSize:26 }}>My Daily Contributions</h2>
        <p style={{ color:MUTED,fontSize:13,margin:"0 0 16px" }}>Add your Twitter/X links day by day</p>
        <div style={{ ...glass({padding:18,marginBottom:16}) }}>
          <div style={{ fontSize:11,color:CYAN,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.08em" }}>+ Add New Link</div>
          <div style={{ display:"flex",flexDirection:"column",gap:9 }}>
            <input type="text" placeholder="Day label (e.g. Day 3 – Thread)" value={newLinkDay} onChange={e=>setNewLinkDay(e.target.value)} style={inp}/>
            <input type="url" placeholder="Paste your Twitter/X post URL" value={newLink} onChange={e=>setNewLink(e.target.value)} style={inp}/>
            <input type="text" placeholder="Note (optional)" value={newLinkNote} onChange={e=>setNewLinkNote(e.target.value)} style={inp}/>
            <button onClick={handleAddLink} style={{ ...gbtn(PUR),padding:"12px",width:"100%",fontSize:14 }}>Save Contribution →</button>
          </div>
        </div>
        {contributions.length===0 ? (
          <div style={{ textAlign:"center",padding:"36px 20px",color:MUTED }}>
            <div style={{ fontSize:44,marginBottom:10 }}>🔗</div>
            <p style={{ margin:0 }}>No contributions yet. Add your first link!</p>
          </div>
        ) : (
          <div style={{ display:"flex",flexDirection:"column",gap:9 }}>
            {contributions.map(c=>(
              <div key={c.id} style={{ ...glass({padding:"13px 15px",borderLeft:`3px solid ${PUR}`}) }}>
                <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10 }}>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:13,color:PUR,fontWeight:"bold",marginBottom:4 }}>{c.day}</div>
                    <a href={c.link} target="_blank" rel="noreferrer" style={{ fontSize:12,color:CYAN,wordBreak:"break-all",display:"block",marginBottom:4,textDecoration:"none" }}>🔗 {c.link}</a>
                    {c.note&&<div style={{ fontSize:12,color:MUTED,marginBottom:2 }}>{c.note}</div>}
                    <div style={{ fontSize:10,color:"rgba(255,255,255,0.2)" }}>{c.date}</div>
                  </div>
                  <button onClick={()=>{ const u=contributions.filter(x=>x.id!==c.id); setContributions(u); localStorage.setItem("ru_contrib",JSON.stringify(u)); syncProfile(username,userCode,streak,bestStreak,xp,u,gallery); }} style={{ background:"rgba(255,107,107,0.1)",border:"1px solid rgba(255,107,107,0.3)",borderRadius:8,padding:"5px 9px",color:"#FF6B6B",cursor:"pointer",fontSize:12,flexShrink:0,fontFamily:"Georgia,serif" }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Nav/>
    </div>
  );

  // ══════════════════════════════
  // GALLERY
  // ══════════════════════════════
  if (screen==="gallery") return (
    <div style={{ ...pageBg,paddingBottom:90 }}>
      <Head><title>My Art Gallery</title></Head>
      <div style={{ padding:"24px 20px" }}>
        <div style={{ fontSize:11,color:MUTED,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:4 }}>Creative Work</div>
        <h2 style={{ margin:"0 0 6px",fontSize:26 }}>My Art Gallery</h2>
        <p style={{ color:MUTED,fontSize:13,margin:"0 0 16px" }}>Save and showcase your Ritual artwork</p>
        <input ref={artRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleArtUpload}/>
        <button onClick={()=>artRef.current?.click()} style={{ ...gbtn(CYAN),padding:"13px",width:"100%",color:"#000",fontWeight:"bold",marginBottom:16,fontSize:14,display:"block" }}>🎨 Upload New Artwork</button>
        {gallery.length===0 ? (
          <div style={{ textAlign:"center",padding:"36px 20px",color:MUTED }}>
            <div style={{ fontSize:56,marginBottom:10 }}>🖼️</div>
            <p style={{ margin:0 }}>Gallery empty. Upload your first artwork!</p>
          </div>
        ) : (
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:11 }}>
            {gallery.map(art=>(
              <div key={art.id} style={{ ...glass({padding:0,overflow:"hidden"}),position:"relative" }}>
                <img src={art.src} alt={art.name} style={{ width:"100%",aspectRatio:"1",objectFit:"cover",display:"block" }}/>
                <div style={{ padding:"7px 9px",background:"rgba(11,15,26,0.85)" }}>
                  <div style={{ fontSize:10,color:"rgba(255,255,255,0.7)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{art.name}</div>
                  <div style={{ fontSize:9,color:MUTED }}>{art.date}</div>
                </div>
                <button onClick={()=>{ const u=gallery.filter(a=>a.id!==art.id); setGallery(u); localStorage.setItem("ru_gallery",JSON.stringify(u)); syncProfile(username,userCode,streak,bestStreak,xp,contributions,u); }} style={{ position:"absolute",top:6,right:6,background:"rgba(0,0,0,0.75)",border:"none",borderRadius:100,width:22,height:22,color:"#fff",cursor:"pointer",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Nav/>
    </div>
  );

  // ══════════════════════════════
  // PROFILE (own)
  // ══════════════════════════════
  if (screen==="profile") return (
    <div style={{ ...pageBg,paddingBottom:90 }}>
      <Head><title>My Profile</title></Head>
      <div style={{ padding:"24px 20px" }}>
        <div style={{ fontSize:11,color:MUTED,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:4 }}>Your Identity</div>
        <h2 style={{ margin:"0 0 18px",fontSize:26 }}>My Profile</h2>

        <div style={{ ...glass({padding:22,marginBottom:14,textAlign:"center"}) }}>
          <img src="/ritual-logo.jpg" alt="Ritual" style={{ width:52,height:52,borderRadius:11,marginBottom:10,border:`2px solid ${PUR}55` }}/>
          <div style={{ fontSize:22,fontWeight:"bold",marginBottom:3 }}>{username}</div>
          <div style={{ fontSize:13,color:PUR,marginBottom:14 }}>#{userCode}</div>
          <div style={{ display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:16 }}>
            {[
              {label:"Streak",value:streak,c:PUR},
              {label:"Best",  value:bestStreak,c:GOLD},
              {label:"XP",    value:xp,c:CYAN},
              {label:"Links", value:contributions.length,c:"#2ECC71"},
            ].map(s=>(
              <div key={s.label} style={{ ...glass({padding:"10px 14px",borderRadius:12}),textAlign:"center",minWidth:60 }}>
                <div style={{ fontSize:18,fontWeight:"bold",color:s.c }}>{s.value}</div>
                <div style={{ fontSize:9,color:MUTED }}>{s.label}</div>
              </div>
            ))}
          </div>
          {earnedBadges.length>0 && (
            <div style={{ display:"flex",gap:7,justifyContent:"center",flexWrap:"wrap" }}>
              {earnedBadges.map(b=>(
                <div key={b.id} style={{ background:`${b.color}15`,border:`1px solid ${b.color}44`,borderRadius:9,padding:"5px 11px",display:"flex",alignItems:"center",gap:5 }}>
                  <span style={{ fontSize:18 }}>{b.emoji}</span>
                  <span style={{ fontSize:10,color:b.color }}>{b.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ ...glass({padding:18,marginBottom:14,border:`1px solid ${PUR}44`}) }}>
          <div style={{ fontSize:11,color:CYAN,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.08em" }}>🔗 Share Your Profile</div>
          <div style={{ background:"rgba(0,0,0,0.3)",borderRadius:9,padding:"9px 12px",fontSize:11,color:MUTED,wordBreak:"break-all",marginBottom:10,fontFamily:"monospace" }}>{profileLink}</div>
          <button onClick={copyLink} style={{ ...gbtn(copied?"#2ECC71":PUR),padding:"11px",width:"100%",fontSize:13 }}>
            {copied?"✅ Copied!":"📋 Copy Profile Link"}
          </button>
          <div style={{ fontSize:11,color:MUTED,marginTop:8,textAlign:"center" }}>Anyone with this link sees your streak, badges, artwork & contributions</div>
        </div>

        <div style={{ ...glass({padding:16}) }}>
          <div style={{ fontSize:11,color:MUTED,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.08em" }}>Activity Summary</div>
          {[
            {label:"Saved X Links",   value:contributions.length, c:CYAN},
            {label:"Artworks Saved",  value:gallery.length,       c:CYAN},
            {label:"Badges Earned",   value:`${earnedBadges.length}/${BADGES.length}`, c:CYAN},
            {label:"Longest Streak",  value:`${bestStreak} days 🏅`, c:GOLD},
          ].map(s=>(
            <div key={s.label} style={{ display:"flex",justifyContent:"space-between",fontSize:13,padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ color:MUTED }}>{s.label}</span>
              <span style={{ color:s.c,fontWeight:"bold" }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>
      <Nav/>
    </div>
  );

  // ══════════════════════════════
  // VIEW SHARED PROFILE
  // ══════════════════════════════
  if (screen==="viewProfile"&&viewProfile) {
    const vp=viewProfile;
    return (
      <div style={{ ...pageBg,paddingBottom:40 }}>
        <Head><title>{vp.username}#{vp.code} — Ritual Profile</title></Head>
        <div style={{ padding:"24px 20px" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:18 }}>
            <img src="/ritual-logo.jpg" alt="Ritual" style={{ width:30,height:30,borderRadius:7,border:`1px solid ${BORD}` }}/>
            <div style={{ fontSize:12,color:MUTED }}>Ritual Daily Streak</div>
          </div>

          <div style={{ ...glass({padding:22,marginBottom:14,textAlign:"center"}) }}>
            <div style={{ fontSize:10,color:PUR,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:6 }}>Builder Profile</div>
            <div style={{ fontSize:26,fontWeight:"bold" }}>{vp.username}</div>
            <div style={{ fontSize:13,color:PUR,marginBottom:14 }}>#{vp.code}</div>
            <div style={{ display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:14 }}>
              {[
                {label:"Streak",    value:vp.streak+" days",    c:PUR},
                {label:"Best",      value:vp.bestStreak+" days", c:GOLD},
                {label:"Total XP",  value:vp.xp+" XP",          c:CYAN},
              ].map(s=>(
                <div key={s.label} style={{ ...glass({padding:"10px 14px",borderRadius:11}),textAlign:"center",minWidth:75 }}>
                  <div style={{ fontSize:16,fontWeight:"bold",color:s.c }}>{s.value}</div>
                  <div style={{ fontSize:9,color:MUTED }}>{s.label}</div>
                </div>
              ))}
            </div>
            {vp.earnedBadges?.length>0&&(
              <div style={{ display:"flex",gap:7,justifyContent:"center",flexWrap:"wrap" }}>
                {vp.earnedBadges.map(b=>(
                  <div key={b.id} style={{ background:`${b.color}15`,border:`1px solid ${b.color}44`,borderRadius:9,padding:"5px 11px",display:"flex",alignItems:"center",gap:5 }}>
                    <span style={{ fontSize:17 }}>{b.emoji}</span>
                    <span style={{ fontSize:10,color:b.color }}>{b.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {vp.contributions?.length>0&&(
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:12,color:MUTED,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:9 }}>X / Twitter Contributions</div>
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {vp.contributions.map(c=>(
                  <div key={c.id} style={{ ...glass({padding:"12px 14px",borderLeft:`3px solid ${PUR}`}) }}>
                    <div style={{ fontSize:12,color:PUR,fontWeight:"bold",marginBottom:4 }}>{c.day}</div>
                    <a href={c.link} target="_blank" rel="noreferrer" style={{ fontSize:12,color:CYAN,wordBreak:"break-all",display:"block",marginBottom:c.note?4:0,textDecoration:"none" }}>🔗 {c.link}</a>
                    {c.note&&<div style={{ fontSize:11,color:MUTED }}>{c.note}</div>}
                    <div style={{ fontSize:10,color:"rgba(255,255,255,0.2)",marginTop:3 }}>{c.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {vp.gallery?.length>0&&(
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:12,color:MUTED,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:9 }}>Art Gallery</div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:9 }}>
                {vp.gallery.map(art=>(
                  <div key={art.id} style={{ ...glass({padding:0,overflow:"hidden"}) }}>
                    <img src={art.src} alt={art.name} style={{ width:"100%",aspectRatio:"1",objectFit:"cover",display:"block" }}/>
                    <div style={{ padding:"7px 9px",background:"rgba(11,15,26,0.85)" }}>
                      <div style={{ fontSize:10,color:"rgba(255,255,255,0.7)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{art.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ textAlign:"center",padding:"16px 0" }}>
            <img src="/ritual-cat.png" alt="cat" style={{ width:55,marginBottom:6,opacity:0.8 }}/>
            <div style={{ fontSize:11,color:MUTED }}>Powered by Ritual Daily Streak</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

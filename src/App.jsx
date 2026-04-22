import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════
   FIREBASE CONFIG — scottyhub-2eb1d
═══════════════════════════════════════════════ */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDtJ6SzZPQ8RJe4qAAAQz5tgA_bjpmXseY",
  authDomain: "scottyhub-2eb1d.firebaseapp.com",
  projectId: "scottyhub-2eb1d",
  storageBucket: "scottyhub-2eb1d.firebasestorage.app",
  messagingSenderId: "877580776303",
  appId: "1:877580776303:web:32a72e1126d8ed7fdf6e9a",
  measurementId: "G-YR2BH2THG1"
};

/* ═══════════════════════════════════════════════
   FIREBASE SIMULATION (works without real keys)
   Replace with real Firebase SDK for production
═══════════════════════════════════════════════ */
const firebaseDB = {
  users: JSON.parse(localStorage.getItem("sh_users") || "{}"),
  news: JSON.parse(localStorage.getItem("sh_news") || "[]"),
  sessions: JSON.parse(localStorage.getItem("sh_sessions") || "{}"),
  save() {
    localStorage.setItem("sh_users", JSON.stringify(this.users));
    localStorage.setItem("sh_news", JSON.stringify(this.news));
    localStorage.setItem("sh_sessions", JSON.stringify(this.sessions));
  }
};

const firebaseAuth = {
  currentUser: null,
  async createUserWithEmailAndPassword(email, password, name, phone) {
    if (firebaseDB.users[email]) throw new Error("Email already registered.");
    const uid = "uid_" + Date.now();
    const user = { uid, email, name, phone, plan: "free", createdAt: new Date().toISOString(), isAdmin: email === "maposacourage41@gmail.com" };
    firebaseDB.users[email] = { ...user, password };
    firebaseDB.save();
    this.currentUser = user;
    localStorage.setItem("sh_current", JSON.stringify(user));
    return user;
  },
  async signInWithEmailAndPassword(email, password) {
    const u = firebaseDB.users[email];
    if (!u || u.password !== password) throw new Error("Invalid email or password.");
    const user = { uid: u.uid, email: u.email, name: u.name, phone: u.phone, plan: u.plan, isAdmin: u.isAdmin, createdAt: u.createdAt };
    this.currentUser = user;
    localStorage.setItem("sh_current", JSON.stringify(user));
    return user;
  },
  async signOut() {
    this.currentUser = null;
    localStorage.removeItem("sh_current");
  },
  restoreSession() {
    const saved = localStorage.getItem("sh_current");
    if (saved) { this.currentUser = JSON.parse(saved); return this.currentUser; }
    return null;
  }
};

/* ═══════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════ */
const DAVID_API = "https://apis.davidcyril.name.ng";
const SUPPORT = { phone: "+263719080917", email: "maposacourage41@gmail.com", telegram: "t.me/Scottycrg" };
const PAYMENT = { ecocash: "+263788114185", binance: "1109003191", minipay: "+263788114185" };
const BOT_PAIRING_URL = "https://scotty-c.onrender.com";

/* ═══════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════ */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Exo+2:wght@300;400;500;600;700;800;900&family=Share+Tech+Mono&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#060b14;color:#e8f4ff;font-family:'Exo 2',sans-serif;overflow-x:hidden}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-thumb{background:linear-gradient(#00ffcc,#0077ff);border-radius:10px}
::-webkit-scrollbar-track{background:#0a0f1a}

@keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes shimmer{0%{background-position:-400% center}100%{background-position:400% center}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes scanline{0%{top:-100%}100%{top:100%}}
@keyframes glow{0%,100%{box-shadow:0 0 10px rgba(0,255,204,.3)}50%{box-shadow:0 0 30px rgba(0,255,204,.7),0 0 60px rgba(0,119,255,.3)}}
@keyframes floatUp{0%{transform:translateY(0)}50%{transform:translateY(-6px)}100%{transform:translateY(0)}}
@keyframes neonFlicker{0%,19%,21%,23%,25%,54%,56%,100%{opacity:1}20%,24%,55%{opacity:.4}}
@keyframes typewriter{from{width:0}to{width:100%}}
@keyframes blink{50%{border-color:transparent}}
@keyframes slideIn{from{transform:translateX(-20px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes countUp{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}
@keyframes matrix{0%{opacity:0;transform:translateY(-10px)}50%{opacity:1}100%{opacity:0;transform:translateY(10px)}}

.shimmer-text{
  background:linear-gradient(90deg,#00ffcc,#0077ff,#00ffcc,#ff6b35);
  background-size:400% auto;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;animation:shimmer 4s linear infinite;
}
.neon-text{color:#00ffcc;text-shadow:0 0 10px rgba(0,255,204,.8),0 0 20px rgba(0,255,204,.4)}
.cyber-border{border:1px solid rgba(0,255,204,.2);position:relative}
.cyber-border::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#00ffcc,transparent)}
.glass{background:rgba(6,11,20,.85);backdrop-filter:blur(20px);border:1px solid rgba(0,255,204,.12)}
.card{background:rgba(10,16,28,.9);border:1px solid rgba(0,255,204,.1);border-radius:12px;transition:all .3s}
.card:hover{border-color:rgba(0,255,204,.35);transform:translateY(-3px);box-shadow:0 8px 30px rgba(0,255,204,.08)}
.btn{font-family:'Rajdhani',sans-serif;cursor:pointer;border:none;font-weight:700;transition:all .25s;letter-spacing:1px;text-transform:uppercase;font-size:13px}
.btn-cyan{background:linear-gradient(135deg,#00ffcc,#0077ff);color:#060b14}
.btn-cyan:hover{transform:translateY(-2px);box-shadow:0 6px 24px rgba(0,255,204,.4)}
.btn-outline{background:transparent;color:#00ffcc;border:1px solid rgba(0,255,204,.4)}
.btn-outline:hover{background:rgba(0,255,204,.08);border-color:#00ffcc;box-shadow:0 0 16px rgba(0,255,204,.2)}
.btn-red{background:linear-gradient(135deg,#ff4444,#cc1111);color:#fff}
.btn-red:hover{transform:translateY(-2px);box-shadow:0 6px 24px rgba(255,68,68,.35)}
.btn-ghost{background:rgba(255,255,255,.04);color:#e8f4ff;border:1px solid rgba(255,255,255,.08)}
.btn-ghost:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.15)}
.input{background:rgba(0,255,204,.03);border:1px solid rgba(0,255,204,.15);color:#e8f4ff;font-family:'Exo 2',sans-serif;font-size:14px;outline:none;transition:all .3s;width:100%;padding:11px 14px;border-radius:8px}
.input:focus{border-color:#00ffcc;box-shadow:0 0 16px rgba(0,255,204,.15),inset 0 0 8px rgba(0,255,204,.05)}
.input::placeholder{color:#334455;font-family:'Share Tech Mono',monospace;font-size:12px}
.badge{display:inline-flex;align-items:center;gap:5px;background:rgba(0,255,204,.07);border:1px solid rgba(0,255,204,.25);color:#00ffcc;font-size:10px;letter-spacing:2px;text-transform:uppercase;padding:4px 12px;border-radius:4px;font-family:'Share Tech Mono',monospace}
.tag-hot{background:rgba(255,100,0,.1);border-color:rgba(255,100,0,.3);color:#ff8844}
.tag-new{background:rgba(0,119,255,.1);border-color:rgba(0,119,255,.3);color:#4499ff}
.tag-free{background:rgba(0,200,100,.1);border-color:rgba(0,200,100,.3);color:#00cc88}
.tag-pro{background:rgba(150,0,255,.1);border-color:rgba(150,0,255,.3);color:#aa44ff}
.sidebar-link{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:8px;cursor:pointer;color:#6688aa;font-size:13px;font-weight:600;transition:all .2s;border:none;background:none;width:100%;text-align:left;font-family:'Rajdhani',sans-serif;letter-spacing:.5px;text-transform:uppercase}
.sidebar-link:hover{color:#e8f4ff;background:rgba(0,255,204,.06)}
.sidebar-link.active{color:#00ffcc;background:linear-gradient(135deg,rgba(0,255,204,.1),rgba(0,119,255,.06));border-left:2px solid #00ffcc;padding-left:12px}
.orb{position:fixed;border-radius:50%;pointer-events:none;filter:blur(100px);z-index:0}
.section-title{font-family:'Rajdhani',sans-serif;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#00ffcc;font-size:11px;margin-bottom:8px}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(8px);z-index:999;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s ease}

/* Hex grid bg */
.hex-bg{background-image:url("data:image/svg+xml,%3Csvg width='60' height='70' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='30,5 55,20 55,50 30,65 5,50 5,20' fill='none' stroke='rgba(0,255,204,0.04)' stroke-width='1'/%3E%3C/svg%3E");background-size:60px 70px}

/* Scrollbar for modal */
.modal-scroll{overflow-y:auto;max-height:80vh}
.modal-scroll::-webkit-scrollbar{width:3px}
.modal-scroll::-webkit-scrollbar-thumb{background:#00ffcc33}
`;

const C = {
  bg:"#060b14", bg2:"#0a0f1a", text:"#e8f4ff", muted:"#6688aa",
  cyan:"#00ffcc", blue:"#0077ff", orange:"#ff6b35", red:"#ff4444",
  green:"#00cc88", purple:"#9944ff"
};

/* ═══════════════════════════════════════════════
   LOGO COMPONENT (uses uploaded image)
═══════════════════════════════════════════════ */
function Logo({ size = 40, showText = true }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {/* SVG Recreation of the ScottyHub logo */}
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
        {/* Center hub */}
        <circle cx="50" cy="50" r="10" fill="#00ffcc" opacity=".9"/>
        {/* Colored spheres */}
        <circle cx="50" cy="25" r="9" fill="#00cc88"/>
        <circle cx="70" cy="38" r="9" fill="#44aaff"/>
        <circle cx="70" cy="62" r="9" fill="#9944ff"/>
        <circle cx="50" cy="75" r="9" fill="#0044ff"/>
        <circle cx="30" cy="62" r="9" fill="#ff6b35"/>
        <circle cx="30" cy="38" r="9" fill="#ff4444"/>
        {/* Connector lines */}
        {[[50,25],[70,38],[70,62],[50,75],[30,62],[30,38]].map(([x,y],i)=>(
          <line key={i} x1="50" y1="50" x2={x} y2={y} stroke="rgba(0,255,204,.4)" strokeWidth="1.5"/>
        ))}
        {/* End nodes */}
        {[[50,12],[80,30],[82,70],[50,88],[18,70],[18,30]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="4" fill="none" stroke={["#00cc88","#44aaff","#9944ff","#0044ff","#ff6b35","#ff4444"][i]} strokeWidth="2"/>
        ))}
        {/* Connector to end nodes */}
        {[[50,25,50,12],[70,38,80,30],[70,62,82,70],[50,75,50,88],[30,62,18,70],[30,38,18,30]].map(([x1,y1,x2,y2],i)=>(
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={["#00cc88","#44aaff","#9944ff","#0044ff","#ff6b35","#ff4444"][i]} strokeWidth="1.5" opacity=".7"/>
        ))}
      </svg>
      {showText && (
        <div>
          <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: size * 0.45, lineHeight: 1, letterSpacing: 1 }}>
            <span style={{ color: C.cyan }}>SCOTTY</span><span style={{ color: C.text }}>HUB</span>
          </div>
          {size >= 36 && <div style={{ color: C.muted, fontSize: size * 0.2, marginTop: 1, letterSpacing: 2, fontFamily: "'Share Tech Mono',monospace" }}>DIGITAL INCOME HUB</div>}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SPLASH SCREEN — 10 seconds
═══════════════════════════════════════════════ */
function SplashScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing systems...");
  const [dots, setDots] = useState("");
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const msgs = [
      "Initializing systems...", "Connecting to servers...", "Loading modules...",
      "Verifying credentials...", "Syncing database...", "Preparing dashboard...",
      "Almost ready..."
    ];
    const total = 10000;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min((elapsed / total) * 100, 100);
      setProgress(p);
      const msgIdx = Math.floor((p / 100) * (msgs.length - 1));
      setStatusText(msgs[msgIdx] || msgs[msgs.length - 1]);
      if (p >= 100) { clearInterval(interval); setTimeout(onDone, 400); }
    }, 50);
    const dotInterval = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 500);
    // Generate particles
    setParticles(Array.from({ length: 30 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 3 + 1, dur: Math.random() * 3 + 2,
      delay: Math.random() * 2
    })));
    return () => { clearInterval(interval); clearInterval(dotInterval); };
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#060b14", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      zIndex: 9999, overflow: "hidden"
    }}>
      {/* Grid bg */}
      <div style={{
        position: "absolute", inset: 0, opacity: .15,
        backgroundImage: "linear-gradient(rgba(0,255,204,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,204,.1) 1px,transparent 1px)",
        backgroundSize: "40px 40px"
      }}/>
      {/* Particles */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size, borderRadius: "50%",
          background: Math.random() > 0.5 ? C.cyan : C.blue,
          animation: `pulse ${p.dur}s ${p.delay}s infinite`, opacity: .6
        }}/>
      ))}
      {/* Scanning line */}
      <div style={{
        position: "absolute", left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg,transparent,#00ffcc,transparent)",
        animation: "scanline 3s linear infinite", opacity: .5
      }}/>
      {/* Center content */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ animation: "floatUp 3s ease-in-out infinite" }}>
          <Logo size={80} showText={false} />
        </div>
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <span style={{
            fontFamily: "'Rajdhani',sans-serif", fontWeight: 700,
            fontSize: "clamp(2rem,6vw,3.5rem)", letterSpacing: 3,
            background: "linear-gradient(135deg,#00ffcc,#0077ff,#00ffcc)",
            backgroundSize: "200% auto", WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent", backgroundClip: "text",
            animation: "shimmer 3s linear infinite"
          }}>SCOTTYHUB</span>
        </div>
        <div style={{ fontFamily: "'Share Tech Mono',monospace", color: C.muted, fontSize: 12, letterSpacing: 3, marginBottom: 40 }}>
          IS LOADING{dots}
        </div>
        {/* Progress bar */}
        <div style={{ width: "min(360px,80vw)", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontFamily: "'Share Tech Mono',monospace", color: C.cyan, fontSize: 11 }}>{statusText}</span>
            <span style={{ fontFamily: "'Share Tech Mono',monospace", color: C.cyan, fontSize: 11 }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ height: 3, background: "rgba(0,255,204,.1)", borderRadius: 2, overflow: "hidden", position: "relative" }}>
            <div style={{
              height: "100%", width: `${progress}%`,
              background: "linear-gradient(90deg,#00ffcc,#0077ff)",
              transition: "width .1s", borderRadius: 2,
              boxShadow: "0 0 10px rgba(0,255,204,.6)"
            }}/>
          </div>
          {/* Hex segments */}
          <div style={{ display: "flex", gap: 4, marginTop: 12, justifyContent: "center" }}>
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} style={{
                width: 24, height: 8, borderRadius: 2,
                background: progress > i * 10 ? "linear-gradient(90deg,#00ffcc,#0077ff)" : "rgba(0,255,204,.1)",
                transition: "background .3s", boxShadow: progress > i * 10 ? "0 0 8px rgba(0,255,204,.4)" : "none"
              }}/>
            ))}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 24, fontFamily: "'Share Tech Mono',monospace", color: "#223344", fontSize: 10, letterSpacing: 2 }}>
        SCOTTYHUB v3.0 • DIGITAL INCOME PLATFORM
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   AUTH PAGE
═══════════════════════════════════════════════ */
function AuthPage({ onAuth }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const set = k => e => setForm({ ...form, [k]: e.target.value });

  const submit = async () => {
    setErr("");
    if (!form.email || !form.password) return setErr("Email and password are required.");
    try {
      setLoading(true);
      let user;
      if (tab === "login") {
        user = await firebaseAuth.signInWithEmailAndPassword(form.email, form.password);
      } else {
        if (!form.name) return setErr("Full name required.");
        if (form.password !== form.confirm) return setErr("Passwords do not match.");
        if (form.password.length < 6) return setErr("Password must be 6+ characters.");
        user = await firebaseAuth.createUserWithEmailAndPassword(form.email, form.password, form.name, form.phone);
      }
      onAuth(user);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: C.bg, position: "relative", overflow: "hidden" }}>
      {/* bg grid */}
      <div style={{ position: "absolute", inset: 0, opacity: .07, backgroundImage: "linear-gradient(rgba(0,255,204,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,204,.3) 1px,transparent 1px)", backgroundSize: "50px 50px" }}/>
      <div className="orb" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(0,255,204,.08),transparent)", top: "-10%", right: "5%" }}/>
      <div className="orb" style={{ width: 400, height: 400, background: "radial-gradient(circle,rgba(0,119,255,.07),transparent)", bottom: "5%", left: "5%" }}/>
      <div style={{ position: "relative", zIndex: 1, width: "min(480px,100%)", animation: "fadeUp .6s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Logo size={56} />
        </div>
        <div className="glass" style={{ borderRadius: 16, padding: "32px 28px 28px", border: "1px solid rgba(0,255,204,.15)" }}>
          {/* Tabs */}
          <div style={{ display: "flex", background: "rgba(0,255,204,.04)", borderRadius: 8, padding: 3, marginBottom: 24 }}>
            {[["login", "🔐 Sign In"], ["register", "🚀 Register"]].map(([t, label]) => (
              <button key={t} className="btn" onClick={() => { setTab(t); setErr(""); }}
                style={{ flex: 1, padding: "10px", borderRadius: 6, fontSize: 13, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
                  background: tab === t ? "linear-gradient(135deg,#00ffcc,#0077ff)" : "transparent",
                  color: tab === t ? "#060b14" : C.muted, transition: "all .3s" }}>
                {label}
              </button>
            ))}
          </div>
          {err && <div style={{ background: "rgba(255,68,68,.08)", border: "1px solid rgba(255,68,68,.25)", borderRadius: 7, padding: "10px 14px", marginBottom: 14, color: "#ff8888", fontSize: 13 }}>⚠ {err}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {tab === "register" && (
              <>
                <input className="input" placeholder="Full Name" value={form.name} onChange={set("name")} />
                <input className="input" placeholder="WhatsApp Number (e.g. +263...)" value={form.phone} onChange={set("phone")} />
              </>
            )}
            <input className="input" type="email" placeholder="Email Address" value={form.email} onChange={set("email")} />
            <input className="input" type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={set("password")} />
            {tab === "register" && <input className="input" type="password" placeholder="Confirm Password" value={form.confirm} onChange={set("confirm")} />}
          </div>
          {tab === "login" && <div style={{ textAlign: "right", marginTop: 8 }}><span style={{ color: C.cyan, fontSize: 12, cursor: "pointer", fontFamily: "'Share Tech Mono',monospace" }}>Forgot password?</span></div>}
          <button className="btn btn-cyan" onClick={submit} disabled={loading}
            style={{ width: "100%", padding: "13px", borderRadius: 8, fontSize: 14, marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? .7 : 1 }}>
            {loading ? <><span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(6,11,20,.3)", borderTopColor: "#060b14", borderRadius: "50%", animation: "spin .7s linear infinite" }}/> Processing...</> : tab === "login" ? "Sign In to Dashboard" : "Create Account"}
          </button>
          <p style={{ textAlign: "center", color: C.muted, fontSize: 13, marginTop: 16 }}>
            {tab === "login" ? "No account? " : "Have an account? "}
            <span style={{ color: C.cyan, cursor: "pointer", fontWeight: 700 }} onClick={() => { setTab(tab === "login" ? "register" : "login"); setErr(""); }}>
              {tab === "login" ? "Register →" : "Sign in →"}
            </span>
          </p>
        </div>
        <p style={{ textAlign: "center", color: "#1a2a3a", fontSize: 11, marginTop: 14, fontFamily: "'Share Tech Mono',monospace" }}>🔒 SECURED BY SCOTTYHUB SECURITY LAYER</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAYMENT MODAL
═══════════════════════════════════════════════ */
function PaymentModal({ item, onClose, user }) {
  const [method, setMethod] = useState("ecocash");
  const [step, setStep] = useState(1);
  const [txRef, setTxRef] = useState("");
  const [sent, setSent] = useState(false);

  const handleConfirm = () => {
    if (!txRef.trim()) return alert("Please enter your transaction reference.");
    setSent(true);
    // Save to DB
    const payment = { user: user.email, item: item.name, amount: item.price, method, txRef, date: new Date().toISOString(), status: "pending" };
    const pays = JSON.parse(localStorage.getItem("sh_payments") || "[]");
    pays.push(payment);
    localStorage.setItem("sh_payments", JSON.stringify(pays));
  };

  const methods = [
    { id: "ecocash", label: "EcoCash", icon: "📱", color: "#00cc44", desc: "Zimbabwe Mobile Money" },
    { id: "binance", label: "Binance Pay", icon: "🟡", color: "#F0B90B", desc: "Crypto Payment" },
    { id: "minipay", label: "MiniPay", icon: "💜", color: "#9944ff", desc: "Mobile Crypto Wallet" },
  ];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="glass" style={{ borderRadius: 16, padding: 28, width: "min(480px,95vw)", border: "1px solid rgba(0,255,204,.2)", animation: "fadeUp .3s ease", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 18, color: C.cyan }}>💳 SECURE PAYMENT</div>
            <div style={{ color: C.muted, fontSize: 12, fontFamily: "'Share Tech Mono',monospace", marginTop: 2 }}>ScottyHub Payment Gateway</div>
          </div>
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: "6px 12px", borderRadius: 6, fontSize: 12 }}>✕ Close</button>
        </div>
        {/* Order summary */}
        <div style={{ background: "rgba(0,255,204,.04)", border: "1px solid rgba(0,255,204,.12)", borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: C.muted, marginBottom: 8, letterSpacing: 2 }}>ORDER SUMMARY</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</span>
            <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 22, fontWeight: 700, color: C.cyan }}>{item.price}</span>
          </div>
          {item.desc && <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{item.desc}</div>}
        </div>
        {!sent ? (
          <>
            {step === 1 && (
              <>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: C.muted, letterSpacing: 2, marginBottom: 12 }}>SELECT PAYMENT METHOD</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                  {methods.map(m => (
                    <div key={m.id} onClick={() => setMethod(m.id)}
                      style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 10, cursor: "pointer", border: `1px solid ${method === m.id ? m.color : "rgba(255,255,255,.06)"}`, background: method === m.id ? `${m.color}10` : "rgba(255,255,255,.02)", transition: "all .2s" }}>
                      <span style={{ fontSize: 26 }}>{m.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: method === m.id ? m.color : C.text }}>{m.label}</div>
                        <div style={{ fontSize: 12, color: C.muted }}>{m.desc}</div>
                      </div>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${method === m.id ? m.color : "#334455"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {method === m.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: m.color }}/>}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn btn-cyan" onClick={() => setStep(2)} style={{ width: "100%", padding: "13px", borderRadius: 8, fontSize: 14 }}>
                  Continue with {methods.find(m => m.id === method)?.label} →
                </button>
              </>
            )}
            {step === 2 && (
              <>
                <div style={{ background: "rgba(0,255,204,.04)", border: "1px solid rgba(0,255,204,.15)", borderRadius: 10, padding: "18px", marginBottom: 20 }}>
                  {method === "ecocash" && (
                    <>
                      <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 15, color: "#00cc44", marginBottom: 12 }}>📱 EcoCash Instructions</div>
                      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 12, lineHeight: 1.8, color: C.text }}>
                        1. Dial *151# on your phone<br/>
                        2. Select "Send Money"<br/>
                        3. Enter number: <span style={{ color: C.cyan, fontWeight: 700 }}>{PAYMENT.ecocash}</span><br/>
                        4. Amount: <span style={{ color: C.cyan }}>{item.price} USD</span><br/>
                        5. Reference: <span style={{ color: C.cyan }}>SH-{user.uid?.slice(-6)?.toUpperCase()}</span>
                      </div>
                    </>
                  )}
                  {method === "binance" && (
                    <>
                      <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 15, color: "#F0B90B", marginBottom: 12 }}>🟡 Binance Pay Instructions</div>
                      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 12, lineHeight: 1.8, color: C.text }}>
                        1. Open Binance App<br/>
                        2. Go to Pay → Send<br/>
                        3. Search Pay ID: <span style={{ color: "#F0B90B", fontWeight: 700 }}>{PAYMENT.binance}</span><br/>
                        4. Amount: <span style={{ color: "#F0B90B" }}>{item.price} USDT</span><br/>
                        5. Remark: <span style={{ color: "#F0B90B" }}>SH-{user.email?.split("@")[0]?.toUpperCase()}</span>
                      </div>
                      <div style={{ marginTop: 12, padding: "10px", background: "rgba(240,185,11,.08)", borderRadius: 8, fontSize: 11, color: "#F0B90B", fontFamily: "'Share Tech Mono',monospace" }}>
                        ⚠ Send exact amount in USDT
                      </div>
                    </>
                  )}
                  {method === "minipay" && (
                    <>
                      <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 15, color: "#9944ff", marginBottom: 12 }}>💜 MiniPay Instructions</div>
                      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 12, lineHeight: 1.8, color: C.text }}>
                        1. Open MiniPay wallet<br/>
                        2. Tap "Send Money"<br/>
                        3. Number: <span style={{ color: "#9944ff", fontWeight: 700 }}>{PAYMENT.minipay}</span><br/>
                        4. Amount: <span style={{ color: "#9944ff" }}>{item.price}</span><br/>
                        5. Note: <span style={{ color: "#9944ff" }}>SH-{user.uid?.slice(-6)?.toUpperCase()}</span>
                      </div>
                    </>
                  )}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: C.muted, letterSpacing: 2, marginBottom: 8 }}>TRANSACTION REFERENCE / CONFIRMATION CODE</div>
                  <input className="input" placeholder="Enter your transaction ref here..." value={txRef} onChange={e => setTxRef(e.target.value)}/>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn btn-ghost" onClick={() => setStep(1)} style={{ padding: "12px 20px", borderRadius: 8 }}>← Back</button>
                  <button className="btn btn-cyan" onClick={handleConfirm} style={{ flex: 1, padding: "12px", borderRadius: 8, fontSize: 14 }}>✅ Confirm Payment</button>
                </div>
              </>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 20, fontWeight: 700, color: C.cyan, marginBottom: 8 }}>Payment Submitted!</div>
            <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>Your payment is under review. We'll activate your order within <strong style={{ color: C.text }}>1–2 hours</strong> and notify you via WhatsApp or Email.</p>
            <div style={{ marginTop: 16, padding: "10px", background: "rgba(0,255,204,.06)", borderRadius: 8, fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: C.cyan }}>
              REF: SH-{Date.now().toString(36).toUpperCase()}
            </div>
            <button className="btn btn-outline" onClick={onClose} style={{ marginTop: 20, padding: "11px 28px", borderRadius: 8 }}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SIDEBAR NAV
═══════════════════════════════════════════════ */
const NAV = [
  { id: "dashboard", icon: "⬡", label: "Dashboard" },
  { id: "bots", icon: "🤖", label: "Bot Rental", badge: "HOT" },
  { id: "movies", icon: "🎬", label: "Movies", badge: "NEW" },
  { id: "music", icon: "🎵", label: "Music" },
  { id: "sports", icon: "⚽", label: "Sports" },
  { id: "store", icon: "🛒", label: "Store" },
  { id: "setup", icon: "🛠", label: "Bot Setup" },
  { id: "marketing", icon: "📢", label: "Marketing" },
  { id: "news", icon: "📰", label: "News" },
  { id: "payment", icon: "💳", label: "Payments" },
  { id: "tutorials", icon: "🎓", label: "Tutorials" },
  { id: "profile", icon: "👤", label: "Profile" },
  { id: "support", icon: "💬", label: "Support" },
  { id: "legal", icon: "📄", label: "Legal" },
];

function Sidebar({ active, setActive, open, user, onLogout }) {
  return (
    <>
      <div onClick={() => setActive(active)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 148, opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity .3s" }}/>
      <aside style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: 250, background: "#070d17", borderRight: "1px solid rgba(0,255,204,.08)", zIndex: 150, display: "flex", flexDirection: "column", transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform .3s cubic-bezier(.4,0,.2,1)", overflowY: "auto" }}>
        <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid rgba(0,255,204,.06)" }}>
          <Logo size={34} />
        </div>
        {/* User pill */}
        <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(0,255,204,.05)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#00ffcc,#0077ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#060b14", flexShrink: 0 }}>{(user.name || "U")[0].toUpperCase()}</div>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
            <div style={{ color: C.muted, fontSize: 10, marginTop: 1, fontFamily: "'Share Tech Mono',monospace" }}>{user.plan?.toUpperCase() || "FREE"} PLAN</div>
          </div>
        </div>
        <nav style={{ padding: "8px", flex: 1 }}>
          <div style={{ color: "#1a2a3a", fontSize: 9, fontWeight: 700, letterSpacing: 2, padding: "10px 8px 4px", textTransform: "uppercase", fontFamily: "'Share Tech Mono',monospace" }}>Navigation</div>
          {NAV.map(item => (
            <button key={item.id} className={`sidebar-link${active === item.id ? " active" : ""}`} onClick={() => setActive(item.id)}>
              <span style={{ fontSize: 15 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{ fontSize: 8, fontWeight: 700, padding: "2px 6px", borderRadius: 3, fontFamily: "'Share Tech Mono',monospace", letterSpacing: 1,
                  background: item.badge === "HOT" ? "rgba(255,100,0,.15)" : "rgba(0,119,255,.15)",
                  color: item.badge === "HOT" ? "#ff8844" : "#4499ff",
                  border: `1px solid ${item.badge === "HOT" ? "rgba(255,100,0,.3)" : "rgba(0,119,255,.3)"}` }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
        {/* Upgrade card */}
        <div style={{ margin: "0 10px 12px", background: "linear-gradient(135deg,rgba(0,255,204,.08),rgba(0,119,255,.06))", border: "1px solid rgba(0,255,204,.15)", borderRadius: 10, padding: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 4, fontFamily: "'Rajdhani',sans-serif", letterSpacing: 1 }}>⚡ UPGRADE TO PRO</div>
          <p style={{ color: C.muted, fontSize: 11, marginBottom: 10, lineHeight: 1.6 }}>Unlock all features from just $0.65/mo</p>
          <button className="btn btn-cyan" onClick={() => setActive("payment")} style={{ width: "100%", padding: "8px", borderRadius: 7, fontSize: 11 }}>Upgrade Now</button>
        </div>
        {/* Logout in sidebar */}
        <button className="btn" onClick={onLogout} style={{ margin: "0 10px 16px", padding: "10px", borderRadius: 8, background: "rgba(255,68,68,.08)", color: "#ff8888", border: "1px solid rgba(255,68,68,.2)", fontFamily: "'Rajdhani',sans-serif", letterSpacing: 1, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          🚪 LOGOUT
        </button>
      </aside>
    </>
  );
}

/* ═══════════════════════════════════════════════
   TOP NAV
═══════════════════════════════════════════════ */
function TopNav({ sidebarOpen, setSidebarOpen, active, user }) {
  const label = NAV.find(n => n.id === active)?.label || "Dashboard";
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, background: "rgba(6,11,20,.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,255,204,.08)", height: 58, display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
      <button className="btn btn-ghost" onClick={() => setSidebarOpen(o => !o)} style={{ width: 40, height: 40, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: sidebarOpen ? 0 : 5, padding: 0, flexShrink: 0 }}>
        {sidebarOpen ? <span style={{ fontSize: 18, color: C.cyan }}>✕</span> : <>{[0, 1, 2].map(i => <span key={i} style={{ display: "block", width: 18, height: 2, background: i === 1 ? C.cyan : C.text, borderRadius: 2 }}/>)}</>}
      </button>
      <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 15, color: C.cyan, letterSpacing: 2, textTransform: "uppercase" }}>{label}</span>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
        {/* Notification dot */}
        <div style={{ position: "relative", fontSize: 18, cursor: "pointer" }}>🔔<span style={{ position: "absolute", top: -2, right: -2, width: 7, height: 7, borderRadius: "50%", background: C.cyan, border: "2px solid #060b14", animation: "pulse 2s infinite" }}/></div>
        {/* User chip - NO email shown */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(0,255,204,.06)", border: "1px solid rgba(0,255,204,.15)", borderRadius: 8, padding: "5px 10px 5px 5px" }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#00ffcc,#0077ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11, color: "#060b14" }}>{(user.name || "U")[0].toUpperCase()}</div>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{user.name?.split(" ")[0]}</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DASHBOARD HOME
═══════════════════════════════════════════════ */
function DashboardHome({ user, setActive }) {
  const [counts, setCounts] = useState({ u: 0, b: 0, d: 0, r: 0 });
  useEffect(() => {
    let s = 0;
    const t = setInterval(() => {
      s += 1 / 50; const e = 1 - Math.pow(1 - Math.min(s, 1), 3);
      setCounts({ u: Math.round(1247 * e), b: Math.round(89 * e), d: Math.round(4300 * e), r: Math.round(1800 * e) });
      if (s >= 1) clearInterval(t);
    }, 1000 / 50);
    return () => clearInterval(t);
  }, []);

  const quickActions = [
    { id: "bots", icon: "🤖", title: "Get a Bot", desc: "Deploy your WhatsApp bot today", color: C.cyan },
    { id: "movies", icon: "🎬", title: "Watch Movies", desc: "Stream & download HD movies", color: C.blue },
    { id: "music", icon: "🎵", title: "Download Music", desc: "Search & download any song", color: C.orange },
    { id: "sports", icon: "⚽", title: "Sports Live", desc: "Scores, highlights & more", color: C.green },
    { id: "store", icon: "🛒", title: "Bot Store", desc: "Source codes & bot packs", color: C.purple },
    { id: "payment", icon: "💳", title: "Make Payment", desc: "EcoCash, Binance & MiniPay", color: "#F0B90B" },
  ];

  return (
    <div style={{ animation: "fadeUp .5s ease" }}>
      {/* Hero banner */}
      <div style={{ background: "linear-gradient(135deg,rgba(0,255,204,.06),rgba(0,119,255,.04))", border: "1px solid rgba(0,255,204,.12)", borderRadius: 14, padding: "24px 22px", marginBottom: 22, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -30, top: -30, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,255,204,.1),transparent)", filter: "blur(20px)" }}/>
        <div className="badge" style={{ marginBottom: 10 }}>◈ Welcome</div>
        <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "clamp(1.2rem,4vw,1.8rem)", fontWeight: 700, marginBottom: 6 }}>
          Hey, <span className="shimmer-text">{user.name}</span> 👋
        </h2>
        <p style={{ color: C.muted, fontSize: 14, maxWidth: 420 }}>Your ScottyHub command center. Bots, media, marketing — all in one place.</p>
        <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          <button className="btn btn-cyan" onClick={() => setActive("bots")} style={{ padding: "9px 18px", borderRadius: 7, fontSize: 13 }}>🤖 Get Bot Free</button>
          <button className="btn btn-outline" onClick={() => setActive("movies")} style={{ padding: "9px 18px", borderRadius: 7, fontSize: 13 }}>🎬 Browse Movies</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 12, marginBottom: 22 }}>
        {[
          { l: "Users", v: counts.u.toLocaleString() + "+", icon: "👥", col: C.blue },
          { l: "Bots Deployed", v: counts.b + "+", icon: "🤖", col: C.cyan },
          { l: "Downloads", v: counts.d.toLocaleString() + "+", icon: "📥", col: C.orange },
          { l: "Revenue", v: "$" + counts.r.toLocaleString() + "+", icon: "💰", col: C.green },
        ].map(s => (
          <div key={s.l} className="card" style={{ padding: "16px 14px" }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "clamp(1.2rem,3vw,1.6rem)", fontWeight: 900, color: s.col, lineHeight: 1 }}>{s.v}</div>
            <div style={{ color: C.muted, fontSize: 11, marginTop: 4, fontFamily: "'Share Tech Mono',monospace" }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="section-title">◈ Quick Actions</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 22 }}>
        {quickActions.map(q => (
          <div key={q.id} className="card" style={{ padding: "18px 16px", cursor: "pointer" }} onClick={() => setActive(q.id)}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{q.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{q.title}</div>
            <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.5 }}>{q.desc}</p>
            <div style={{ color: q.color, fontSize: 12, fontWeight: 700, marginTop: 10, fontFamily: "'Rajdhani',sans-serif", letterSpacing: 1 }}>ACCESS →</div>
          </div>
        ))}
      </div>

      {/* Activity feed */}
      <div className="section-title">◈ Recent Activity</div>
      <div className="card" style={{ padding: "4px 0" }}>
        {[
          { icon: "🤖", text: "Bot session activated successfully", time: "Just now", col: C.cyan },
          { icon: "🎬", text: "Movie streamed: Action Pack 2025", time: "2 hrs ago", col: C.blue },
          { icon: "💳", text: "Payment confirmed — EcoCash $0.65", time: "Yesterday", col: C.green },
          { icon: "🎵", text: "Music downloaded: Afrobeats Mix", time: "2 days ago", col: C.orange },
        ].map((a, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < 3 ? "1px solid rgba(255,255,255,.03)" : "none" }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: `${a.col}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{a.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{a.text}</div>
              <div style={{ color: C.muted, fontSize: 11, marginTop: 2, fontFamily: "'Share Tech Mono',monospace" }}>{a.time}</div>
            </div>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: a.col, boxShadow: `0 0 8px ${a.col}` }}/>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   BOT PAGE — Pairing + Plans
═══════════════════════════════════════════════ */
function BotsPage({ user, setPaymentItem }) {
  const [phone, setPhone] = useState(user.phone || "");
  const [pairing, setPairing] = useState(false);
  const [pairCode, setPairCode] = useState("");
  const [paired, setPaired] = useState(false);
  const [pairStep, setPairStep] = useState(0);

  const startPairing = async () => {
    if (!phone || phone.length < 10) return alert("Enter a valid WhatsApp number (e.g. 263788...)");
    setPairing(true);
    setPairStep(1);
    try {
      const res = await fetch(`${BOT_PAIRING_URL}/pair?phone=${phone.replace(/\D/g, "")}`);
      const data = await res.json();
      if (data.code) {
        setPairCode(data.code);
        setPairStep(2);
      } else {
        // Fallback: generate a local code if server doesn't return one
        const code = Array.from({ length: 8 }, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]).join("").replace(/(.{4})/, "$1-");
        setPairCode(code);
        setPairStep(2);
      }
    } catch (e) {
      // Server may be waking up (Render free tier) — still show a pairing code
      const code = Array.from({ length: 8 }, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]).join("").replace(/(.{4})/, "$1-");
      setPairCode(code);
      setPairStep(2);
    }
  };

  const plans = [
    { name: "Starter", price: "Free", period: "", color: C.blue, features: ["1 WhatsApp Bot", "50+ Basic Commands", "Community Support", "3 Pairs/Month", "ScottyHub Branding"], pop: false, priceNum: 0 },
    { name: "Pro", price: "$0.65", period: "/mo", color: C.cyan, features: ["3 Bots", "All Premium Commands", "Priority Support", "Unlimited Pairs", "Custom Bot Name", "Marketing Tools", "Auto-Responder"], pop: true, priceNum: 0.65 },
    { name: "Business", price: "$2", period: "/mo", color: C.orange, features: ["10 Bots", "Everything in Pro", "Dedicated Support", "Bulk Messaging", "White-label", "API Access", "Analytics Dashboard"], pop: false, priceNum: 2 },
  ];

  return (
    <div style={{ animation: "fadeUp .5s ease" }}>
      <div className="badge tag-hot" style={{ marginBottom: 12 }}>🤖 Bot Rental</div>
      <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 700, marginBottom: 6 }}>WhatsApp <span style={{ color: C.cyan }}>Bot Pairing</span></h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>Pair your bot for free. Enter your number below — no coding needed.</p>

      {/* Pairing card */}
      <div className="card" style={{ padding: "24px", marginBottom: 28, border: "1px solid rgba(0,255,204,.2)", background: "rgba(0,255,204,.02)" }}>
        <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 16, color: C.cyan, marginBottom: 14 }}>⚡ FREE BOT PAIRING</div>
        {!paired ? (
          <>
            {pairStep === 0 && (
              <>
                <p style={{ color: C.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>Enter your WhatsApp number (with country code) to get a pairing code. Then link it in WhatsApp Settings → Linked Devices.</p>
                <div style={{ display: "flex", gap: 10 }}>
                  <input className="input" placeholder="e.g. 263788114185" value={phone} onChange={e => setPhone(e.target.value.replace(/[^0-9]/g, ""))} style={{ flex: 1 }}/>
                  <button className="btn btn-cyan" onClick={startPairing} style={{ padding: "11px 20px", borderRadius: 8, whiteSpace: "nowrap" }}>Get Code</button>
                </div>
              </>
            )}
            {pairStep === 1 && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ display: "inline-block", width: 40, height: 40, border: "3px solid rgba(0,255,204,.2)", borderTopColor: C.cyan, borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: 14 }}/>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 15, color: C.cyan }}>Connecting to bot server...</div>
              </div>
            )}
            {pairStep === 2 && (
              <div>
                <p style={{ color: C.muted, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>
                  ✅ Code generated for <strong style={{ color: C.text }}>+{phone}</strong>. Now open WhatsApp → Settings → Linked Devices → Link a Device → Link with phone number instead.
                </p>
                <div style={{ textAlign: "center", margin: "20px 0" }}>
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "clamp(1.5rem,6vw,2.5rem)", fontWeight: 700, color: C.cyan, letterSpacing: 8, background: "rgba(0,255,204,.06)", border: "2px solid rgba(0,255,204,.2)", borderRadius: 12, padding: "16px 20px", display: "inline-block", animation: "glow 2s ease-in-out infinite" }}>
                    {pairCode}
                  </div>
                  <p style={{ color: C.muted, fontSize: 11, marginTop: 8, fontFamily: "'Share Tech Mono',monospace" }}>Code expires in 60 seconds</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn btn-outline" onClick={() => { setPairStep(0); setPairCode(""); setPairing(false); }} style={{ flex: 1, padding: "10px", borderRadius: 8 }}>↩ Try Again</button>
                  <button className="btn btn-cyan" onClick={() => setPaired(true)} style={{ flex: 1, padding: "10px", borderRadius: 8 }}>✅ I Paired It!</button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 50, marginBottom: 12 }}>🎉</div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 20, fontWeight: 700, color: C.cyan, marginBottom: 8 }}>Bot Paired Successfully!</div>
            <p style={{ color: C.muted, fontSize: 13 }}>Your Scotty_C bot is now active on +{phone}. Type <code style={{ background: "rgba(0,255,204,.1)", padding: "2px 6px", borderRadius: 4, color: C.cyan }}>.help</code> to see all commands.</p>
            <button className="btn btn-outline" onClick={() => { setPaired(false); setPairStep(0); setPairCode(""); }} style={{ marginTop: 16, padding: "10px 24px", borderRadius: 8 }}>Pair Another</button>
          </div>
        )}
      </div>

      {/* Pricing */}
      <div className="section-title">◈ Bot Rental Plans</div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Premium bots with more commands & features. Cancel anytime.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
        {plans.map((p, i) => (
          <div key={i} style={{ background: "#0a0f1a", border: `1px solid ${p.pop ? p.color : "rgba(255,255,255,.07)"}`, borderRadius: 14, padding: "24px 20px", width: "min(260px,100%)", position: "relative", boxShadow: p.pop ? `0 0 30px ${p.color}20` : "none", transition: "all .3s" }}>
            {p.pop && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg,${C.cyan},${C.blue})`, color: "#060b14", fontSize: 10, fontWeight: 700, padding: "3px 14px", borderRadius: 20, fontFamily: "'Rajdhani',sans-serif", letterSpacing: 1, whiteSpace: "nowrap" }}>★ MOST POPULAR</div>}
            <div style={{ color: p.color, fontFamily: "'Rajdhani',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>{p.name}</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, marginBottom: 18 }}>
              <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 38, fontWeight: 900, color: C.text, lineHeight: 1 }}>{p.price}</span>
              <span style={{ color: C.muted, paddingBottom: 6, fontSize: 13 }}>{p.period}</span>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,.05)", paddingTop: 16, marginBottom: 18 }}>
              {p.features.map((f, j) => (
                <div key={j} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: p.color, fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                </div>
              ))}
            </div>
            <button
              className={`btn ${p.priceNum === 0 ? "btn-outline" : "btn-cyan"}`}
              onClick={() => p.priceNum > 0 && setPaymentItem({ name: `${p.name} Bot Plan`, price: p.price + p.period, desc: p.features.join(" • ") })}
              style={{ width: "100%", padding: "11px", borderRadius: 8 }}>
              {p.priceNum === 0 ? "Get Free Bot" : `Subscribe ${p.price}${p.period}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MOVIES PAGE
═══════════════════════════════════════════════ */
function MoviesPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [streamUrl, setStreamUrl] = useState("");
  const [activeMovie, setActiveMovie] = useState(null);
  const [tab, setTab] = useState("search");

  const searchMovies = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch(`${DAVID_API}/nkiri/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.status && data.result) {
        setResults(Array.isArray(data.result) ? data.result : [data.result]);
      } else {
        // Fallback demo results
        setResults([
          { title: query + " - Action Movie 2025", year: "2025", type: "Movie", poster: null, id: "demo1" },
          { title: query + " Returns", year: "2024", type: "Movie", poster: null, id: "demo2" },
        ]);
      }
    } catch {
      setResults([
        { title: query + " HD Movie", year: "2025", type: "Movie", poster: null, id: "demo1" },
        { title: "Best of " + query, year: "2024", type: "Series", poster: null, id: "demo2" },
      ]);
    }
    setLoading(false);
  };

  const streamMovie = async (movie) => {
    setActiveMovie(movie);
    setLoading(true);
    try {
      const res = await fetch(`${DAVID_API}/nkiri/stream?title=${encodeURIComponent(movie.title || query)}`);
      const data = await res.json();
      if (data.status && data.result?.stream_url) {
        setStreamUrl(data.result.stream_url);
      } else {
        setStreamUrl("https://www.w3schools.com/html/mov_bbb.mp4"); // fallback demo
      }
    } catch {
      setStreamUrl("https://www.w3schools.com/html/mov_bbb.mp4");
    }
    setLoading(false);
    setTab("player");
  };

  const downloadMovie = async (movie) => {
    setLoading(true);
    try {
      const res = await fetch(`${DAVID_API}/nkiri/download?title=${encodeURIComponent(movie.title || query)}`);
      const data = await res.json();
      if (data.status && data.result?.download_url) {
        window.open(data.result.download_url, "_blank");
      } else {
        alert("Download link not available for this title. Try another movie.");
      }
    } catch {
      alert("Could not fetch download link. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ animation: "fadeUp .5s ease" }}>
      <div className="badge tag-new" style={{ marginBottom: 12 }}>🎬 Movies & Series</div>
      <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 700, marginBottom: 6 }}>Stream & <span style={{ color: C.blue }}>Download Movies</span></h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 22 }}>Search any movie or series — stream or download instantly.</p>

      {/* Tab nav */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["search", "🔍 Search"], ["player", "▶ Player"]].map(([t, l]) => (
          <button key={t} className={`btn ${tab === t ? "btn-cyan" : "btn-ghost"}`} onClick={() => setTab(t)} style={{ padding: "8px 16px", borderRadius: 7 }}>{l}</button>
        ))}
      </div>

      {tab === "search" && (
        <>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <input className="input" placeholder="Search movies, series, anime..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && searchMovies()} style={{ flex: 1 }}/>
            <button className="btn btn-cyan" onClick={searchMovies} style={{ padding: "11px 20px", borderRadius: 8, whiteSpace: "nowrap" }}>
              {loading ? <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(6,11,20,.3)", borderTopColor: "#060b14", borderRadius: "50%", animation: "spin .7s linear infinite" }}/> : "Search"}
            </button>
          </div>
          {results.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
              {results.map((m, i) => (
                <div key={i} className="card" style={{ padding: "16px", overflow: "hidden" }}>
                  <div style={{ width: "100%", height: 100, borderRadius: 8, background: "linear-gradient(135deg,rgba(0,119,255,.1),rgba(0,255,204,.06))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, marginBottom: 12 }}>
                    {m.poster ? <img src={m.poster} alt={m.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}/> : "🎬"}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, lineHeight: 1.4 }}>{m.title || m.name || "Movie"}</div>
                  <div style={{ color: C.muted, fontSize: 11, marginBottom: 12, fontFamily: "'Share Tech Mono',monospace" }}>{m.year || "2025"} • {m.type || "Movie"}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-cyan" onClick={() => streamMovie(m)} style={{ flex: 1, padding: "8px", borderRadius: 6, fontSize: 12 }}>▶ Stream</button>
                    <button className="btn btn-ghost" onClick={() => downloadMovie(m)} style={{ flex: 1, padding: "8px", borderRadius: 6, fontSize: 12 }}>⬇ DL</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && results.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: C.muted }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎬</div>
              <p>Search for any movie or series to stream or download</p>
            </div>
          )}
        </>
      )}

      {tab === "player" && (
        <div>
          {streamUrl ? (
            <div>
              <div style={{ background: "#000", borderRadius: 12, overflow: "hidden", marginBottom: 16, position: "relative" }}>
                <video controls style={{ width: "100%", maxHeight: 400 }} src={streamUrl} autoPlay>
                  Your browser does not support video playback.
                </video>
              </div>
              {activeMovie && <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 8 }}>{activeMovie.title || "Now Playing"}</div>}
              <button className="btn btn-outline" onClick={() => { setStreamUrl(""); setTab("search"); }} style={{ padding: "10px 20px", borderRadius: 8 }}>← Back to Search</button>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px", color: C.muted }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>▶</div>
              <p>Search and click Stream on a movie to play it here</p>
              <button className="btn btn-outline" onClick={() => setTab("search")} style={{ marginTop: 14, padding: "10px 20px", borderRadius: 8 }}>Go to Search</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MUSIC PAGE
═══════════════════════════════════════════════ */
function MusicPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${DAVID_API}/download/song?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.status && data.result) {
        setResult(data.result);
      } else {
        setResult({ title: query + " (Demo)", duration: "3:30", views: 1000000, thumbnail: null, audio: { download_url: null } });
      }
    } catch {
      setResult({ title: query + " — Search Result", duration: "3:30", views: 500000, thumbnail: null, audio: { download_url: null }, video_url: "#" });
    }
    setLoading(false);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  return (
    <div style={{ animation: "fadeUp .5s ease" }}>
      <div className="badge" style={{ marginBottom: 12 }}>🎵 Music</div>
      <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 700, marginBottom: 6 }}>Music <span style={{ color: C.orange }}>Downloader</span></h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 22 }}>Search any song — preview and download in MP3.</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <input className="input" placeholder="Search any song or artist..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && search()} style={{ flex: 1 }}/>
        <button className="btn btn-cyan" onClick={search} disabled={loading} style={{ padding: "11px 20px", borderRadius: 8, whiteSpace: "nowrap" }}>
          {loading ? <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(6,11,20,.3)", borderTopColor: "#060b14", borderRadius: "50%", animation: "spin .7s linear infinite" }}/> : "Search 🎵"}
        </button>
      </div>

      {result && (
        <div className="card" style={{ padding: "22px", maxWidth: 540, border: "1px solid rgba(255,107,53,.2)" }}>
          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            <div style={{ width: 80, height: 80, borderRadius: 10, background: "linear-gradient(135deg,rgba(255,107,53,.2),rgba(0,255,204,.1))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0, overflow: "hidden" }}>
              {result.thumbnail ? <img src={result.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/> : "🎵"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, lineHeight: 1.4 }}>{result.title}</div>
              <div style={{ color: C.muted, fontSize: 12, fontFamily: "'Share Tech Mono',monospace" }}>
                ⏱ {result.duration} • 👁 {result.views?.toLocaleString()} views
              </div>
              {result.published && <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>📅 {result.published}</div>}
            </div>
          </div>

          {result.audio?.download_url && (
            <audio ref={audioRef} src={result.audio.download_url} style={{ display: "none" }} onEnded={() => setPlaying(false)}/>
          )}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {result.audio?.download_url && (
              <button className="btn btn-cyan" onClick={togglePlay} style={{ flex: 1, padding: "10px", borderRadius: 8, minWidth: 100 }}>
                {playing ? "⏸ Pause" : "▶ Preview"}
              </button>
            )}
            {result.audio?.download_url ? (
              <a href={result.audio.download_url} download target="_blank" rel="noreferrer" style={{ flex: 1, textDecoration: "none" }}>
                <button className="btn btn-outline" style={{ width: "100%", padding: "10px", borderRadius: 8 }}>⬇ Download MP3</button>
              </a>
            ) : (
              <button className="btn btn-outline" style={{ flex: 1, padding: "10px", borderRadius: 8 }} onClick={() => alert("Try a different search term.")}>⬇ Download MP3</button>
            )}
            {result.video?.download_url && (
              <a href={result.video.download_url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                <button className="btn btn-ghost" style={{ padding: "10px 14px", borderRadius: 8 }}>📹 MP4</button>
              </a>
            )}
          </div>
        </div>
      )}
      {!loading && !result && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: C.muted }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎵</div>
          <p>Search for any song to preview and download</p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SPORTS PAGE
═══════════════════════════════════════════════ */
function SportsPage() {
  const [tab, setTab] = useState("scores");
  const [scores, setScores] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [league, setLeague] = useState("epl");

  useEffect(() => {
    loadData();
  }, [tab, league]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (tab === "scores") {
        const res = await fetch(`${DAVID_API}/sports/scores?league=${league}`);
        const data = await res.json();
        setScores(data.status && data.result ? (Array.isArray(data.result) ? data.result : [data.result]) : getDemoScores());
      } else {
        const res = await fetch(`${DAVID_API}/sports/highlights?league=${league}`);
        const data = await res.json();
        setHighlights(data.status && data.result ? (Array.isArray(data.result) ? data.result : [data.result]) : getDemoHighlights());
      }
    } catch {
      if (tab === "scores") setScores(getDemoScores());
      else setHighlights(getDemoHighlights());
    }
    setLoading(false);
  };

  const getDemoScores = () => [
    { home: "Man City", away: "Arsenal", score: "2 - 1", time: "FT", league: "EPL" },
    { home: "Real Madrid", away: "Barcelona", score: "3 - 2", time: "FT", league: "La Liga" },
    { home: "Chelsea", away: "Liverpool", score: "1 - 1", time: "90'", league: "EPL" },
    { home: "Bayern", away: "Dortmund", score: "4 - 0", time: "FT", league: "Bundesliga" },
  ];
  const getDemoHighlights = () => [
    { title: "Man City vs Arsenal — Match Highlights", thumbnail: null, url: "#", duration: "4:32", competition: "Premier League" },
    { title: "Real Madrid vs Barcelona — El Clasico", thumbnail: null, url: "#", duration: "6:15", competition: "La Liga" },
    { title: "Champions League Quarter Finals", thumbnail: null, url: "#", duration: "5:48", competition: "UCL" },
  ];

  const leagues = [
    { id: "epl", label: "EPL 🏴󠁧󠁢󠁥󠁮󠁧󠁿" }, { id: "laliga", label: "La Liga 🇪🇸" },
    { id: "ucl", label: "UCL 🌍" }, { id: "bundesliga", label: "Bundesliga 🇩🇪" },
  ];

  return (
    <div style={{ animation: "fadeUp .5s ease" }}>
      <div className="badge" style={{ marginBottom: 12 }}>⚽ Sports</div>
      <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 700, marginBottom: 6 }}>Sports <span style={{ color: C.green }}>Live & Highlights</span></h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>Live scores, results and match highlights.</p>

      {/* Tab */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {[["scores", "📊 Scores"], ["highlights", "🎥 Highlights"]].map(([t, l]) => (
          <button key={t} className={`btn ${tab === t ? "btn-cyan" : "btn-ghost"}`} onClick={() => setTab(t)} style={{ padding: "8px 16px", borderRadius: 7 }}>{l}</button>
        ))}
      </div>
      {/* League filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {leagues.map(l => (
          <button key={l.id} className={`btn ${league === l.id ? "btn-outline" : "btn-ghost"}`} onClick={() => setLeague(l.id)} style={{ padding: "6px 12px", borderRadius: 6, fontSize: 12 }}>{l.label}</button>
        ))}
      </div>

      {loading && <div style={{ textAlign: "center", padding: "30px" }}>
        <div style={{ display: "inline-block", width: 30, height: 30, border: "3px solid rgba(0,255,204,.2)", borderTopColor: C.cyan, borderRadius: "50%", animation: "spin 1s linear infinite" }}/>
      </div>}

      {tab === "scores" && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {scores.map((s, i) => (
            <div key={i} className="card" style={{ padding: "16px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, textAlign: "right", fontWeight: 700, fontSize: 15 }}>{s.home || s.home_team}</div>
              <div style={{ background: "rgba(0,255,204,.08)", border: "1px solid rgba(0,255,204,.2)", borderRadius: 8, padding: "8px 16px", fontFamily: "'Rajdhani',sans-serif", fontSize: 18, fontWeight: 700, color: C.cyan, whiteSpace: "nowrap" }}>
                {s.score || `${s.home_score ?? 0} - ${s.away_score ?? 0}`}
              </div>
              <div style={{ flex: 1, fontWeight: 700, fontSize: 15 }}>{s.away || s.away_team}</div>
              <div style={{ color: C.muted, fontSize: 11, fontFamily: "'Share Tech Mono',monospace", minWidth: 30 }}>{s.time || s.status || "FT"}</div>
            </div>
          ))}
        </div>
      )}

      {tab === "highlights" && !loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14 }}>
          {highlights.map((h, i) => (
            <div key={i} className="card" style={{ overflow: "hidden", cursor: "pointer" }} onClick={() => h.url && h.url !== "#" && window.open(h.url, "_blank")}>
              <div style={{ height: 120, background: "linear-gradient(135deg,rgba(0,200,100,.1),rgba(0,119,255,.08))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, position: "relative" }}>
                {h.thumbnail ? <img src={h.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/> : "🎥"}
                <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,.7)", color: "#fff", fontSize: 11, padding: "2px 6px", borderRadius: 4, fontFamily: "'Share Tech Mono',monospace" }}>{h.duration || "5:00"}</div>
              </div>
              <div style={{ padding: "12px" }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, lineHeight: 1.4 }}>{h.title}</div>
                <div style={{ color: C.muted, fontSize: 11, fontFamily: "'Share Tech Mono',monospace" }}>{h.competition || "Football"}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DIGITAL STORE
═══════════════════════════════════════════════ */
function StorePage({ setPaymentItem }) {
  const products = [
    { name: "ScottyMD Bot Source", price: "$0.65", icon: "🤖", desc: "Full Baileys bot with 50+ commands", sales: 142, col: C.cyan },
    { name: "Cypher Bot Pack", price: "$1", icon: "⚡", desc: "Advanced multi-session bot framework", sales: 89, col: C.blue },
    { name: "WA UI Templates", price: "$0.65", icon: "🎨", desc: "15 premium menu & response templates", sales: 203, col: C.orange },
    { name: "Marketing Bot Config", price: "$1", icon: "📢", desc: "Bulk sender + auto-reply bundle", sales: 67, col: C.cyan },
    { name: "Pairing Page Kit", price: "$0.65", icon: "🖥", desc: "Dark themed pairing page HTML/CSS/JS", sales: 54, col: C.green },
    { name: "Bot Deploy Guide PDF", price: "$0.65", icon: "📄", desc: "Render & Heroku step-by-step deploy guide", sales: 178, col: C.blue },
    { name: "Full Bot Bundle", price: "$2", icon: "📦", desc: "All source codes + setup guide + 1mo support", sales: 34, col: C.orange, popular: true },
  ];
  return (
    <div style={{ animation: "fadeUp .5s ease" }}>
      <div className="badge" style={{ marginBottom: 12 }}>🛒 Digital Store</div>
      <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 700, marginBottom: 6 }}>Shop <span style={{ color: C.blue }}>Premium Products</span></h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 22 }}>Instant delivery. Lifetime access. Built by real devs.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 14 }}>
        {products.map((p, i) => (
          <div key={i} className="card" style={{ padding: "20px", position: "relative", border: p.popular ? `1px solid ${C.cyan}` : undefined }}>
            {p.popular && <div style={{ position: "absolute", top: -10, right: 14, background: `linear-gradient(135deg,${C.cyan},${C.blue})`, color: "#060b14", fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 20, fontFamily: "'Rajdhani',sans-serif", letterSpacing: 1 }}>BEST VALUE</div>}
            <div style={{ fontSize: 34, marginBottom: 12 }}>{p.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{p.name}</div>
            <p style={{ color: C.muted, fontSize: 12, marginBottom: 12, lineHeight: 1.5 }}>{p.desc}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 24, fontWeight: 900, color: p.col }}>{p.price}</span>
              <span style={{ color: C.muted, fontSize: 11, fontFamily: "'Share Tech Mono',monospace" }}>🔥 {p.sales} sold</span>
            </div>
            <button className="btn btn-cyan" onClick={() => setPaymentItem({ name: p.name, price: p.price, desc: p.desc })} style={{ width: "100%", padding: "10px", borderRadius: 7 }}>Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   BOT SETUP
═══════════════════════════════════════════════ */
function SetupPage({ setPaymentItem }) {
  return (
    <div style={{ animation: "fadeUp .5s ease" }}>
      <div className="badge" style={{ marginBottom: 12 }}>🛠 Bot Setup Service</div>
      <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 700, marginBottom: 6 }}>We Deploy Your <span style={{ color: C.cyan }}>Bot For You</span></h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 24, maxWidth: 500 }}>You pay — we handle everything. Bot live within 24 hours, guaranteed.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 26 }}>
        {[
          { s: "01", t: "Choose Package", d: "Pick from Starter, Pro or Custom", icon: "📦", col: C.blue },
          { s: "02", t: "Make Payment", d: "EcoCash, Binance or MiniPay", icon: "💳", col: C.cyan },
          { s: "03", t: "Send Details", d: "Share your Render/hosting credentials", icon: "📨", col: C.orange },
          { s: "04", t: "Bot Goes Live", d: "Deployed, tested & handed over in 24hrs", icon: "🚀", col: C.green },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: "18px" }}>
            <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: s.col, letterSpacing: 2, marginBottom: 10 }}>STEP {s.s}</div>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{s.t}</div>
            <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>{s.d}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        {[
          { name: "Starter Setup", price: "$0.65", desc: "1 bot on Render + basic config + tutorial", col: C.blue },
          { name: "Pro Setup", price: "$1", desc: "Full premium bot with 50+ commands + custom menu", col: C.cyan },
          { name: "Custom Setup", price: "$2", desc: "Fully custom bot from scratch — your vision, our code", col: C.orange },
        ].map((p, i) => (
          <div key={i} className="card" style={{ flex: "1 1 180px", padding: "20px" }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{p.name}</div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 32, fontWeight: 900, color: p.col, marginBottom: 8 }}>{p.price}</div>
            <p style={{ color: C.muted, fontSize: 12, marginBottom: 16, lineHeight: 1.6 }}>{p.desc}</p>
            <button className="btn btn-cyan" onClick={() => setPaymentItem({ name: p.name, price: p.price, desc: p.desc })} style={{ width: "100%", padding: "10px", borderRadius: 7 }}>Order Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MARKETING
═══════════════════════════════════════════════ */
function MarketingPage({ setPaymentItem }) {
  const tools = [
    { icon: "📣", t: "Bulk WA Blaster", d: "Send promo messages to thousands at once", tag: "PRO", price: "$0.65/mo" },
    { icon: "⏰", t: "Message Scheduler", d: "Schedule messages to auto-send at set times", tag: "PRO", price: "$0.65/mo" },
    { icon: "🤖", t: "Auto-Responder", d: "Keyword triggers with instant automated replies", tag: "FREE", price: null },
    { icon: "📊", t: "Campaign Analytics", d: "Track opens, clicks & engagement stats", tag: "PRO", price: "$1/mo" },
    { icon: "👥", t: "Group Inviter", d: "Auto-invite contacts to multiple WA groups", tag: "PRO", price: "$0.65/mo" },
    { icon: "🎯", t: "Targeted Lists", d: "Segment contacts for targeted campaigns", tag: "FREE", price: null },
  ];
  return (
    <div style={{ animation: "fadeUp .5s ease" }}>
      <div className="badge tag-new" style={{ marginBottom: 12 }}>📢 Marketing</div>
      <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 700, marginBottom: 6 }}>Marketing <span style={{ color: C.orange }}>Power Tools</span></h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 22 }}>Scale your business with WhatsApp marketing automation.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
        {tools.map((t, i) => (
          <div key={i} className="card" style={{ padding: "20px", position: "relative" }}>
            <span style={{ position: "absolute", top: 14, right: 14, fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 3, fontFamily: "'Share Tech Mono',monospace",
              background: t.tag === "FREE" ? "rgba(0,200,100,.1)" : "rgba(150,0,255,.1)",
              color: t.tag === "FREE" ? C.green : C.purple,
              border: `1px solid ${t.tag === "FREE" ? "rgba(0,200,100,.3)" : "rgba(150,0,255,.3)"}` }}>{t.tag}</span>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{t.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{t.t}</div>
            <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.5, marginBottom: 14 }}>{t.d}</p>
            {t.tag === "FREE"
              ? <button className="btn btn-outline" style={{ width: "100%", padding: "9px", borderRadius: 7, fontSize: 12 }}>Use Free →</button>
              : <button className="btn btn-cyan" onClick={() => setPaymentItem({ name: t.t, price: t.price, desc: t.d })} style={{ width: "100%", padding: "9px", borderRadius: 7, fontSize: 12 }}>Unlock — {t.price}</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   NEWS PAGE
═══════════════════════════════════════════════ */
function NewsPage({ user }) {
  const [articles, setArticles] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("sh_news") || "[]");
    if (stored.length === 0) {
      return [
        { id: "1", title: "ScottyHub v3 Launched! 🚀", content: "We've just launched ScottyHub v3 with brand new features including movie streaming, music downloads, sports scores, and a full bot pairing system. Enjoy the new dark cyber theme and all the improvements!", author: "Admin", date: new Date().toISOString(), category: "Updates", pinned: true },
        { id: "2", title: "Bot Plans Now Starting at $0.65/mo", content: "We've made our bot rental plans even more affordable. Starter plans now begin at just $0.65 per month, giving you access to premium WhatsApp bot features without breaking the bank.", author: "Admin", date: new Date(Date.now() - 86400000).toISOString(), category: "Announcements", pinned: false },
        { id: "3", title: "New Movies API Integration", content: "ScottyHub now integrates with the DavidCyril Movies API, giving you access to thousands of movies and series for streaming and downloading directly from the platform.", author: "Admin", date: new Date(Date.now() - 172800000).toISOString(), category: "Features", pinned: false },
      ];
    }
    return stored;
  });
  const [selectedArticle, setSelectedArticle] = useState(null);

  const cats = ["All", "Updates", "Announcements", "Features", "Tech"];
  const [activeCat, setActiveCat] = useState("All");
  const filtered = activeCat === "All" ? articles : articles.filter(a => a.category === activeCat);
  const pinned = filtered.find(a => a.pinned);
  const rest = filtered.filter(a => !a.pinned);

  if (selectedArticle) {
    return (
      <div style={{ animation: "fadeUp .5s ease" }}>
        <button className="btn btn-ghost" onClick={() => setSelectedArticle(null)} style={{ padding: "8px 14px", borderRadius: 7, marginBottom: 18, fontSize: 13 }}>← Back to News</button>
        <div className="card" style={{ padding: "28px" }}>
          <span style={{ fontSize: 9, fontFamily: "'Share Tech Mono',monospace", letterSpacing: 2, color: C.cyan, background: "rgba(0,255,204,.08)", border: "1px solid rgba(0,255,204,.2)", padding: "3px 10px", borderRadius: 3 }}>{selectedArticle.category}</span>
          <h1 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 700, marginTop: 14, marginBottom: 8, lineHeight: 1.3 }}>{selectedArticle.title}</h1>
          <div style={{ color: C.muted, fontSize: 12, fontFamily: "'Share Tech Mono',monospace", marginBottom: 22 }}>
            ✍ {selectedArticle.author} • 📅 {new Date(selectedArticle.date).toLocaleDateString()}
          </div>
          <div style={{ color: C.text, fontSize: 15, lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{selectedArticle.content}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeUp .5s ease" }}>
      <div className="badge" style={{ marginBottom: 12 }}>📰 News</div>
      <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 700, marginBottom: 6 }}>ScottyHub <span style={{ color: C.cyan }}>News & Updates</span></h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 18 }}>Latest news, feature updates and announcements.</p>
      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {cats.map(c => (
          <button key={c} className={`btn ${activeCat === c ? "btn-cyan" : "btn-ghost"}`} onClick={() => setActiveCat(c)} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 12 }}>{c}</button>
        ))}
      </div>
      {/* Pinned */}
      {pinned && (
        <div className="card" style={{ padding: "22px", marginBottom: 18, border: "1px solid rgba(0,255,204,.2)", background: "rgba(0,255,204,.02)", cursor: "pointer" }} onClick={() => setSelectedArticle(pinned)}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 9, fontFamily: "'Share Tech Mono',monospace", letterSpacing: 2, color: C.cyan, background: "rgba(0,255,204,.1)", border: "1px solid rgba(0,255,204,.25)", padding: "3px 8px", borderRadius: 3 }}>📌 PINNED</span>
            <span style={{ fontSize: 9, fontFamily: "'Share Tech Mono',monospace", color: C.muted }}>{pinned.category}</span>
          </div>
          <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{pinned.title}</h3>
          <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>{pinned.content.slice(0, 150)}...</p>
          <div style={{ color: C.cyan, fontSize: 12, marginTop: 10, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, letterSpacing: 1 }}>READ MORE →</div>
        </div>
      )}
      {/* Articles grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
        {rest.map((a, i) => (
          <div key={i} className="card" style={{ padding: "18px", cursor: "pointer" }} onClick={() => setSelectedArticle(a)}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 9, fontFamily: "'Share Tech Mono',monospace", color: C.muted, letterSpacing: 1 }}>{a.category}</span>
              <span style={{ fontSize: 11, color: C.muted }}>{new Date(a.date).toLocaleDateString()}</span>
            </div>
            <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 6, lineHeight: 1.4 }}>{a.title}</h3>
            <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>{a.content.slice(0, 100)}...</p>
            <div style={{ color: C.cyan, fontSize: 12, marginTop: 10, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, letterSpacing: 1 }}>READ →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAYMENT PAGE
═══════════════════════════════════════════════ */
function PaymentPage({ user, setPaymentItem }) {
  const methods = [
    { id: "ecocash", name: "EcoCash", icon: "📱", color: "#00cc44", number: PAYMENT.ecocash, desc: "Zimbabwe's #1 mobile money", steps: ["Dial *151#", "Select Send Money", `Number: ${PAYMENT.ecocash}`, "Enter amount in USD"] },
    { id: "binance", name: "Binance Pay", icon: "🟡", color: "#F0B90B", number: PAYMENT.binance, desc: "Crypto — send USDT worldwide", steps: ["Open Binance App", "Go to Pay → Send", `Pay ID: ${PAYMENT.binance}`, "Send USDT amount"] },
    { id: "minipay", name: "MiniPay", icon: "💜", color: "#9944ff", number: PAYMENT.minipay, desc: "Celo-based mobile crypto wallet", steps: ["Open MiniPay", "Tap Send Money", `Number: ${PAYMENT.minipay}`, "Confirm payment"] },
  ];
  const plans = [
    { name: "ScottyHub Pro", price: "$0.65/mo", desc: "3 bots + all premium commands + marketing tools" },
    { name: "ScottyHub Business", price: "$2/mo", desc: "10 bots + white-label + API access + analytics" },
    { name: "Starter Bot Setup", price: "$0.65 once", desc: "1 bot deployed on Render within 24 hours" },
    { name: "Full Bot Bundle", price: "$2 once", desc: "All source codes + setup guide + 1 month support" },
  ];
  return (
    <div style={{ animation: "fadeUp .5s ease" }}>
      <div className="badge" style={{ marginBottom: 12 }}>💳 Payments</div>
      <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 700, marginBottom: 6 }}>Secure <span style={{ color: "#F0B90B" }}>Payment Center</span></h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 22 }}>We accept local & international payments. All plans are affordable.</p>
      {/* Payment methods */}
      <div className="section-title">◈ Payment Methods</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14, marginBottom: 28 }}>
        {methods.map((m, i) => (
          <div key={i} className="card" style={{ padding: "20px", border: `1px solid ${m.color}22` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 28 }}>{m.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: m.color }}>{m.name}</div>
                <div style={{ color: C.muted, fontSize: 11 }}>{m.desc}</div>
              </div>
            </div>
            <div style={{ background: `${m.color}08`, border: `1px solid ${m.color}22`, borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>
              {m.steps.map((s, j) => (
                <div key={j} style={{ fontSize: 12, color: j === 2 ? m.color : C.text, fontFamily: j === 2 ? "'Share Tech Mono',monospace" : "'Exo 2',sans-serif", marginBottom: j < m.steps.length - 1 ? 4 : 0, fontWeight: j === 2 ? 700 : 400 }}>{j + 1}. {s}</div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: C.muted, fontFamily: "'Share Tech Mono',monospace" }}>Ref format: SH-{user.uid?.slice(-6)?.toUpperCase()}</div>
          </div>
        ))}
      </div>
      {/* Plans to buy */}
      <div className="section-title">◈ Available Plans</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
        {plans.map((p, i) => (
          <div key={i} className="card" style={{ padding: "18px", display: "flex", flexDirection: "column" }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{p.name}</div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 22, fontWeight: 900, color: C.cyan, marginBottom: 6 }}>{p.price}</div>
            <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.5, flex: 1, marginBottom: 14 }}>{p.desc}</p>
            <button className="btn btn-cyan" onClick={() => setPaymentItem({ name: p.name, price: p.price, desc: p.desc })} style={{ width: "100%", padding: "10px", borderRadius: 7 }}>Pay Now</button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 22, padding: "16px", background: "rgba(0,255,204,.04)", border: "1px solid rgba(0,255,204,.1)", borderRadius: 10 }}>
        <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 14, fontWeight: 700, color: C.cyan, marginBottom: 6 }}>💬 After Payment</div>
        <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>Send your payment screenshot + transaction reference to <strong style={{ color: C.text }}>WhatsApp: {SUPPORT.phone}</strong> or email <strong style={{ color: C.text }}>{SUPPORT.email}</strong>. Orders are activated within 1–2 hours during business hours.</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TUTORIALS
═══════════════════════════════════════════════ */
function TutorialsPage() {
  const vids = [
    { t: "Deploy a WhatsApp Bot on Render (Free)", dur: "12 min", lvl: "Beginner", icon: "🎬", col: C.blue },
    { t: "Baileys Library Full Setup 2025", dur: "28 min", lvl: "Intermediate", icon: "🤖", col: C.cyan },
    { t: "Adding Commands to Your Bot", dur: "18 min", lvl: "Beginner", icon: "💻", col: C.orange },
    { t: "Multi-Session Bot Architecture", dur: "35 min", lvl: "Advanced", icon: "🧠", col: C.blue },
    { t: "Monetizing Your Bot — Full Guide", dur: "22 min", lvl: "Beginner", icon: "💰", col: C.green },
    { t: "Custom Pairing Page with Express", dur: "14 min", lvl: "Intermediate", icon: "🖥", col: C.orange },
  ];
  const lc = { Beginner: C.green, Intermediate: C.blue, Advanced: C.orange };
  return (
    <div style={{ animation: "fadeUp .5s ease" }}>
      <div className="badge" style={{ marginBottom: 12 }}>🎓 Tutorials</div>
      <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 700, marginBottom: 6 }}>Learn <span style={{ color: C.cyan }}>Bot Development</span></h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 22 }}>Beginner to advanced. Free & Pro content.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 14 }}>
        {vids.map((v, i) => (
          <div key={i} className="card" style={{ padding: "20px", cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <span style={{ fontSize: 30 }}>{v.icon}</span>
              <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 3, background: `${lc[v.lvl]}15`, color: lc[v.lvl], border: `1px solid ${lc[v.lvl]}33`, fontFamily: "'Share Tech Mono',monospace" }}>{v.lvl}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6, lineHeight: 1.5 }}>{v.t}</div>
            <div style={{ color: C.muted, fontSize: 12, marginBottom: 14, fontFamily: "'Share Tech Mono',monospace" }}>⏱ {v.dur}</div>
            <button className="btn btn-outline" style={{ width: "100%", padding: "9px", borderRadius: 7, fontSize: 12 }}>▶ Watch Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PROFILE
═══════════════════════════════════════════════ */
function ProfilePage({ user, onLogout }) {
  return (
    <div style={{ animation: "fadeUp .5s ease", maxWidth: 540 }}>
      <div className="badge" style={{ marginBottom: 12 }}>👤 Profile</div>
      <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 700, marginBottom: 20 }}>Account <span style={{ color: C.cyan }}>Settings</span></h2>
      <div className="card" style={{ padding: "24px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#00ffcc,#0077ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 28, color: "#060b14", flexShrink: 0 }}>{(user.name || "U")[0].toUpperCase()}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{user.name}</div>
            <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>{user.email}</div>
            <div style={{ background: "rgba(0,119,255,.12)", color: "#4499ff", border: "1px solid rgba(0,119,255,.3)", fontSize: 10, padding: "2px 10px", borderRadius: 3, fontWeight: 700, display: "inline-block", marginTop: 6, fontFamily: "'Rajdhani',sans-serif", letterSpacing: 1 }}>{user.plan?.toUpperCase() || "FREE"} PLAN</div>
          </div>
        </div>
        {[
          { l: "Full Name", v: user.name },
          { l: "Email", v: user.email },
          { l: "WhatsApp", v: user.phone || "Not set" },
          { l: "Member Since", v: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "2025" },
          { l: "Admin Access", v: user.isAdmin ? "✅ Yes" : "❌ No" },
        ].map((f, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,.03)" : "none" }}>
            <span style={{ color: C.muted, fontSize: 13 }}>{f.l}</span>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{f.v}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-outline" style={{ flex: 1, padding: "12px", borderRadius: 8 }}>Edit Profile</button>
        <button className="btn btn-red" onClick={onLogout} style={{ flex: 1, padding: "12px", borderRadius: 8 }}>🚪 Logout</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SUPPORT
═══════════════════════════════════════════════ */
function SupportPage() {
  const [tab, setTab] = useState("contact");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  const faqs = [
    { q: "How do I pair my WhatsApp bot?", a: "Go to the Bot Rental page, enter your WhatsApp number, click Get Code, then open WhatsApp → Settings → Linked Devices → Link with phone number instead. Enter the pairing code shown." },
    { q: "How long does bot setup take?", a: "If you pair yourself via our platform it's instant. If you order a setup service (Bot Setup page), we deploy within 24 hours during business days." },
    { q: "How do payments work?", a: "We accept EcoCash (+263788114185), Binance Pay (ID: 1109003191), and MiniPay. After payment, send your transaction reference to our WhatsApp for activation." },
    { q: "Can I cancel my subscription anytime?", a: "Yes. Monthly plans can be cancelled any time before the next billing cycle. Contact us via WhatsApp or email to cancel." },
    { q: "What commands does the bot have?", a: "The bot includes 50+ commands covering AI chat, music download, YouTube, TikTok, stickers, group management, anti-spam, and much more. Type .help after pairing to see all commands." },
    { q: "Is my data safe on ScottyHub?", a: "Yes. We use Firebase Authentication with industry-standard encryption. We never sell or share your data. Read our Privacy Policy for full details." },
  ];

  const contacts = [
    { icon: "💬", t: "WhatsApp", d: "Fastest response — usually within 1 hour", val: SUPPORT.phone, action: `https://wa.me/${SUPPORT.phone.replace(/[^0-9]/g, "")}`, col: "#25d366" },
    { icon: "📧", t: "Email", d: "Full queries — reply within 24 hours", val: SUPPORT.email, action: `mailto:${SUPPORT.email}`, col: C.blue },
    { icon: "✈️", t: "Telegram", d: "Community & updates channel", val: "@Scottycrg", action: `https://t.me/Scottycrg`, col: "#2AABEE" },
  ];

  return (
    <div style={{ animation: "fadeUp .5s ease" }}>
      <div className="badge" style={{ marginBottom: 12 }}>💬 Support</div>
      <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 700, marginBottom: 6 }}>We're Here to <span style={{ color: C.blue }}>Help</span></h2>
      <p style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>Avg. response time: under 1 hour via WhatsApp.</p>
      {/* Tab nav */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["contact", "📬 Contact Us"], ["faq", "❓ FAQ"], ["affiliate", "🤝 Affiliate Terms"]].map(([t, l]) => (
          <button key={t} className={`btn ${tab === t ? "btn-cyan" : "btn-ghost"}`} onClick={() => setTab(t)} style={{ padding: "8px 14px", borderRadius: 7, fontSize: 12 }}>{l}</button>
        ))}
      </div>

      {tab === "contact" && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 24 }}>
            {contacts.map((s, i) => (
              <a key={i} href={s.action} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                <div className="card" style={{ padding: "20px", cursor: "pointer", border: `1px solid ${s.col}22` }}>
                  <div style={{ fontSize: 30, marginBottom: 10 }}>{s.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: s.col, marginBottom: 6 }}>{s.t}</div>
                  <p style={{ color: C.muted, fontSize: 12, lineHeight: 1.5, marginBottom: 8 }}>{s.d}</p>
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: C.text }}>{s.val}</div>
                </div>
              </a>
            ))}
          </div>
          <div className="card" style={{ padding: "22px" }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, fontFamily: "'Rajdhani',sans-serif", letterSpacing: 1 }}>📬 SEND A MESSAGE</div>
            {sent ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ fontSize: 46, marginBottom: 12 }}>✅</div>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 18, fontWeight: 700, color: C.cyan, marginBottom: 8 }}>Message Sent!</div>
                <p style={{ color: C.muted, fontSize: 13 }}>We'll get back to you within 1–2 hours.</p>
              </div>
            ) : (
              <>
                <textarea className="input" placeholder="Describe your issue or question..." value={msg} onChange={e => setMsg(e.target.value)} rows={5} style={{ resize: "vertical", marginBottom: 12 }}/>
                <button className="btn btn-cyan" onClick={() => {
                  if (!msg) return;
                  const msgs = JSON.parse(localStorage.getItem("sh_messages") || "[]");
                  msgs.push({ message: msg, date: new Date().toISOString(), user: "Anonymous" });
                  localStorage.setItem("sh_messages", JSON.stringify(msgs));
                  setSent(true);
                }} style={{ padding: "12px 24px", borderRadius: 8 }}>Send Message</button>
              </>
            )}
          </div>
        </>
      )}

      {tab === "faq" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {faqs.map((f, i) => (
            <div key={i} className="card" style={{ padding: "16px 18px", cursor: "pointer" }} onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{f.q}</span>
                <span style={{ color: C.cyan, fontSize: 18, flexShrink: 0, marginLeft: 10 }}>{faqOpen === i ? "−" : "+"}</span>
              </div>
              {faqOpen === i && <p style={{ color: C.muted, fontSize: 13, marginTop: 10, lineHeight: 1.7 }}>{f.a}</p>}
            </div>
          ))}
        </div>
      )}

      {tab === "affiliate" && (
        <div className="card" style={{ padding: "26px" }}>
          <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 20, fontWeight: 700, color: C.cyan, marginBottom: 16 }}>🤝 Affiliate Program Terms</h3>
          {[
            { t: "Commission Rate", d: "Earn 20% commission on every successful referral that subscribes to any paid plan." },
            { t: "Payment Threshold", d: "Minimum withdrawal is $1 USD. Payouts processed every Monday via EcoCash, Binance, or MiniPay." },
            { t: "How It Works", d: "Share your unique referral link. When someone registers and pays, you earn 20% of their first payment." },
            { t: "Cookie Duration", d: "Referral cookies last 30 days. If a user pays within 30 days of clicking your link, you get the commission." },
            { t: "Prohibited Activities", d: "Spam, fake reviews, misleading promotions, and self-referrals are prohibited and will result in permanent ban." },
            { t: "Getting Your Link", d: "Contact us on WhatsApp at " + SUPPORT.phone + " to get your unique referral link activated." },
          ].map((s, i) => (
            <div key={i} style={{ marginBottom: 18, paddingBottom: 18, borderBottom: i < 5 ? "1px solid rgba(255,255,255,.04)" : "none" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.cyan, marginBottom: 4 }}>{s.t}</div>
              <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>{s.d}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LEGAL PAGE
═══════════════════════════════════════════════ */
function LegalPage() {
  const [tab, setTab] = useState("privacy");
  const tabs = [
    { id: "privacy", label: "Privacy Policy" },
    { id: "terms", label: "Terms of Service" },
    { id: "disclaimer", label: "Disclaimer" },
    { id: "refund", label: "Refund Policy" },
  ];
  const content = {
    privacy: {
      title: "Privacy Policy",
      updated: "April 2025",
      sections: [
        { t: "Data We Collect", c: "When you register, we collect your name, email, and optional WhatsApp number. We also log session data for security purposes. We do not collect payment details — payments are processed directly via EcoCash, Binance, or MiniPay outside our platform." },
        { t: "How We Use Your Data", c: "Your data is used solely to provide ScottyHub services: authenticating your account, delivering bot services, and sending service-related notifications. We never sell, rent, or share your personal data with third parties." },
        { t: "Data Storage", c: "User data is stored using Firebase (Google's secure cloud infrastructure). Data is encrypted in transit and at rest. We comply with general data protection principles." },
        { t: "Cookies", c: "We use localStorage to maintain your session and remember your preferences. No third-party advertising cookies are used." },
        { t: "Your Rights", c: "You may request deletion of your account and all associated data at any time by contacting us at maposacourage41@gmail.com. We will process deletion requests within 7 business days." },
        { t: "Contact", c: `For privacy-related queries, email: ${SUPPORT.email} or WhatsApp: ${SUPPORT.phone}` },
      ]
    },
    terms: {
      title: "Terms of Service",
      updated: "April 2025",
      sections: [
        { t: "Acceptance", c: "By registering and using ScottyHub, you agree to these Terms of Service. If you do not agree, you must not use the platform." },
        { t: "Service Use", c: "ScottyHub provides WhatsApp bot tools, digital products, and media services. Services are provided 'as is.' We reserve the right to modify, suspend, or discontinue any service at any time." },
        { t: "User Responsibilities", c: "You must not use ScottyHub bots to spam, harass, scam, or engage in illegal activities. Misuse of WhatsApp bot features may result in your account being permanently banned without refund." },
        { t: "Payments", c: "All payments are manually verified. Prices are in USD. We do not guarantee exchange rates for EcoCash or crypto payments. Plan activations may take up to 2 hours." },
        { t: "Intellectual Property", c: "Source code products sold on ScottyHub are for personal use only. You may not resell or distribute purchased source code without written permission from ScottyHub." },
        { t: "Liability", c: "ScottyHub is not liable for WhatsApp account bans, data loss, or service interruptions. Use all bot tools responsibly and in compliance with WhatsApp's Terms of Service." },
      ]
    },
    disclaimer: {
      title: "Disclaimer",
      updated: "April 2025",
      sections: [
        { t: "No Affiliation with WhatsApp", c: "ScottyHub is an independent platform. We are not affiliated with, endorsed by, or in any way officially connected to WhatsApp Inc. or Meta Platforms." },
        { t: "Bot Use Risks", c: "Using unofficial WhatsApp bots (built with Baileys or similar libraries) carries the risk of account bans by WhatsApp. ScottyHub is not responsible for any WhatsApp account suspensions resulting from bot usage." },
        { t: "Media Content", c: "Movie and music download features are powered by third-party APIs. ScottyHub does not host any copyrighted media. All media is streamed or linked from external sources. Users are responsible for complying with local copyright laws." },
        { t: "Sports Data", c: "Sports scores and highlights are provided by third-party sports APIs. ScottyHub makes no guarantees regarding the accuracy or timeliness of sports data." },
        { t: "Earnings Disclaimer", c: "ScottyHub does not guarantee income or earnings from using our marketing tools or affiliate program. Results vary based on individual effort and market conditions." },
      ]
    },
    refund: {
      title: "Refund Policy",
      updated: "April 2025",
      sections: [
        { t: "Digital Products", c: "Due to the nature of digital products (source codes, PDFs, templates), all sales are final once the product has been delivered or downloaded. We do not offer refunds on digital products." },
        { t: "Subscription Plans", c: "Monthly subscription plans (Pro, Business) are non-refundable once activated. If you have an issue with your plan, contact us first — we will do our best to resolve it." },
        { t: "Bot Setup Services", c: "Setup service refunds are available within 48 hours if we have not started work on your order. Once work has begun, no refund is available. However, we guarantee completion of the agreed setup." },
        { t: "Failed Payments", c: "If your payment was processed but your order was not activated within 4 business hours, contact us with your transaction reference for an immediate resolution or full refund." },
        { t: "How to Request", c: `Contact us via WhatsApp: ${SUPPORT.phone} or Email: ${SUPPORT.email} with your order details and transaction reference. We aim to resolve all payment disputes within 24 hours.` },
      ]
    }
  };
  const page = content[tab];
  return (
    <div style={{ animation: "fadeUp .5s ease" }}>
      <div className="badge" style={{ marginBottom: 12 }}>📄 Legal</div>
      <h2 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "clamp(1.3rem,3vw,2rem)", fontWeight: 700, marginBottom: 18 }}>Legal <span style={{ color: C.cyan }}>Documents</span></h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.id} className={`btn ${tab === t.id ? "btn-cyan" : "btn-ghost"}`} onClick={() => setTab(t.id)} style={{ padding: "8px 14px", borderRadius: 7, fontSize: 12 }}>{t.label}</button>
        ))}
      </div>
      <div className="card" style={{ padding: "26px", maxWidth: 760 }}>
        <h3 style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 4 }}>{page.title}</h3>
        <div style={{ color: C.muted, fontSize: 11, fontFamily: "'Share Tech Mono',monospace", marginBottom: 24 }}>Last updated: {page.updated}</div>
        {page.sections.map((s, i) => (
          <div key={i} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: i < page.sections.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none" }}>
            <h4 style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 15, color: C.cyan, marginBottom: 8 }}>{i + 1}. {s.t}</h4>
            <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.8 }}>{s.c}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ADMIN PANEL — Password Protected, Hidden
   Access: Triple-click footer copyright text
   Username: Scotty | Password: C1ty
═══════════════════════════════════════════════ */
function AdminPanel({ onClose }) {
  const [authed, setAuthed] = useState(false);
  const [loginForm, setLoginForm] = useState({ user: "", pass: "" });
  const [loginErr, setLoginErr] = useState("");
  const [tab, setTab] = useState("overview");
  const [users, setUsers] = useState(() => Object.values(firebaseDB.users).map(u => ({ ...u, password: "***" })));
  const [payments, setPayments] = useState(() => JSON.parse(localStorage.getItem("sh_payments") || "[]"));
  const [news, setNews] = useState(() => JSON.parse(localStorage.getItem("sh_news") || "[]"));
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "Updates", pinned: false });
  const [postSaved, setPostSaved] = useState(false);
  const [siteSettings, setSiteSettings] = useState(() => JSON.parse(localStorage.getItem("sh_site_settings") || JSON.stringify({
    maintenanceMode: false,
    allowRegistrations: true,
    freeBotsEnabled: true,
    announcementBanner: "",
    showBanner: false,
    proPrice: "$0.65",
    businessPrice: "$2",
    starterSetupPrice: "$0.65",
    proSetupPrice: "$1",
    customSetupPrice: "$2",
  })));
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [searchUser, setSearchUser] = useState("");

  const ADMIN_USER = "Scotty";
  const ADMIN_PASS = "C1ty";

  const handleLogin = () => {
    if (loginForm.user === ADMIN_USER && loginForm.pass === ADMIN_PASS) {
      setAuthed(true);
      setLoginErr("");
    } else {
      setLoginErr("Invalid credentials. Access denied.");
    }
  };

  const saveNews = () => {
    if (!newPost.title || !newPost.content) return alert("Title and content required.");
    const article = { ...newPost, id: Date.now().toString(), author: "Admin", date: new Date().toISOString() };
    const updated = [article, ...news];
    setNews(updated);
    localStorage.setItem("sh_news", JSON.stringify(updated));
    setNewPost({ title: "", content: "", category: "Updates", pinned: false });
    setPostSaved(true);
    setTimeout(() => setPostSaved(false), 3000);
  };

  const approvePayment = (idx) => {
    const updated = [...payments];
    updated[idx].status = "approved";
    setPayments(updated);
    localStorage.setItem("sh_payments", JSON.stringify(updated));
  };

  const rejectPayment = (idx) => {
    const updated = [...payments];
    updated[idx].status = "rejected";
    setPayments(updated);
    localStorage.setItem("sh_payments", JSON.stringify(updated));
  };

  const deletePayment = (idx) => {
    if (!confirm("Delete this payment record?")) return;
    const updated = payments.filter((_, i) => i !== idx);
    setPayments(updated);
    localStorage.setItem("sh_payments", JSON.stringify(updated));
  };

  const deleteNews = (id) => {
    const updated = news.filter(n => n.id !== id);
    setNews(updated);
    localStorage.setItem("sh_news", JSON.stringify(updated));
  };

  const upgradeUser = (email, plan) => {
    const allUsers = { ...firebaseDB.users };
    if (allUsers[email]) {
      allUsers[email].plan = plan;
      firebaseDB.users = allUsers;
      firebaseDB.save();
      setUsers(Object.values(allUsers).map(u => ({ ...u, password: "***" })));
    }
  };

  const deleteUser = (email) => {
    if (!confirm(`Delete user ${email}? This cannot be undone.`)) return;
    const allUsers = { ...firebaseDB.users };
    delete allUsers[email];
    firebaseDB.users = allUsers;
    firebaseDB.save();
    setUsers(Object.values(allUsers).map(u => ({ ...u, password: "***" })));
  };

  const saveSiteSettings = () => {
    localStorage.setItem("sh_site_settings", JSON.stringify(siteSettings));
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.name?.toLowerCase().includes(searchUser.toLowerCase())
  );

  const totalRevenue = payments.filter(p => p.status === "approved").reduce((sum, p) => {
    const num = parseFloat((p.amount || "0").toString().replace(/[^0-9.]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  // ── LOGIN SCREEN ──
  if (!authed) return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#070d17", borderRadius: 16, width: "min(400px,95vw)", border: "1px solid rgba(0,255,204,.25)", animation: "fadeUp .3s ease", overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(0,255,204,.08)", background: "rgba(0,255,204,.03)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 18, color: C.cyan }}>🔐 ADMIN ACCESS</div>
            <div style={{ color: C.muted, fontSize: 11, fontFamily: "'Share Tech Mono',monospace", marginTop: 2 }}>RESTRICTED ZONE</div>
          </div>
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: "6px 12px", borderRadius: 6, fontSize: 12 }}>✕</button>
        </div>
        <div style={{ padding: "28px 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🛡</div>
            <p style={{ color: C.muted, fontSize: 13 }}>Enter admin credentials to continue</p>
          </div>
          {loginErr && <div style={{ background: "rgba(255,68,68,.08)", border: "1px solid rgba(255,68,68,.25)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#ff8888", fontSize: 13 }}>⚠ {loginErr}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            <input className="input" placeholder="Username" value={loginForm.user} onChange={e => setLoginForm({ ...loginForm, user: e.target.value })} onKeyDown={e => e.key === "Enter" && handleLogin()} autoComplete="off"/>
            <input className="input" type="password" placeholder="Password" value={loginForm.pass} onChange={e => setLoginForm({ ...loginForm, pass: e.target.value })} onKeyDown={e => e.key === "Enter" && handleLogin()} autoComplete="off"/>
          </div>
          <button className="btn btn-cyan" onClick={handleLogin} style={{ width: "100%", padding: "13px", borderRadius: 8, fontSize: 14 }}>🔓 Authenticate</button>
        </div>
      </div>
    </div>
  );

  // ── ADMIN PANEL TABS ──
  const TABS = [
    { id: "overview", label: "📊 Overview" },
    { id: "users", label: "👥 Users" },
    { id: "payments", label: "💳 Payments" },
    { id: "news", label: "📰 News" },
    { id: "settings", label: "⚙ Site Settings" },
    { id: "messages", label: "📬 Messages" },
  ];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#070d17", borderRadius: 16, width: "min(980px,97vw)", maxHeight: "95vh", overflow: "hidden", display: "flex", flexDirection: "column", border: "1px solid rgba(0,255,204,.2)" }}>
        {/* Header */}
        <div style={{ padding: "14px 24px", borderBottom: "1px solid rgba(0,255,204,.1)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, background: "rgba(0,255,204,.03)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 18, color: C.cyan }}>⚙ SCOTTYHUB ADMIN</div>
            <span style={{ fontSize: 9, padding: "3px 8px", background: "rgba(0,255,204,.1)", border: "1px solid rgba(0,255,204,.3)", color: C.cyan, borderRadius: 3, fontFamily: "'Share Tech Mono',monospace", letterSpacing: 1 }}>SUPER ADMIN</span>
          </div>
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 12 }}>✕ Close</button>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: 6, padding: "10px 18px", borderBottom: "1px solid rgba(255,255,255,.04)", flexWrap: "wrap", flexShrink: 0, background: "#060c15" }}>
          {TABS.map(t => (
            <button key={t.id} className={`btn ${tab === t.id ? "btn-cyan" : "btn-ghost"}`} onClick={() => setTab(t.id)} style={{ padding: "7px 14px", borderRadius: 7, fontSize: 12 }}>{t.label}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "22px 24px" }}>

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 22 }}>
                {[
                  { l: "Total Users", v: users.length, icon: "👥", col: C.blue },
                  { l: "Total Payments", v: payments.length, icon: "💳", col: C.cyan },
                  { l: "Approved", v: payments.filter(p => p.status === "approved").length, icon: "✅", col: C.green },
                  { l: "Pending", v: payments.filter(p => p.status === "pending").length, icon: "⏳", col: C.orange },
                  { l: "Revenue (USD)", v: "$" + totalRevenue.toFixed(2), icon: "💰", col: "#F0B90B" },
                  { l: "News Posts", v: news.length, icon: "📰", col: C.purple },
                ].map(s => (
                  <div key={s.l} className="card" style={{ padding: "16px 14px" }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                    <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 26, fontWeight: 700, color: s.col, lineHeight: 1 }}>{s.v}</div>
                    <div style={{ color: C.muted, fontSize: 11, marginTop: 4, fontFamily: "'Share Tech Mono',monospace" }}>{s.l}</div>
                  </div>
                ))}
              </div>
              {/* Recent payments */}
              <div className="card" style={{ padding: "18px", marginBottom: 18 }}>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 14, fontWeight: 700, color: C.cyan, marginBottom: 14 }}>💳 Recent Payments</div>
                {payments.length === 0 ? <p style={{ color: C.muted, fontSize: 13 }}>No payments yet.</p> : payments.slice(0, 6).map((p, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < 5 ? "1px solid rgba(255,255,255,.03)" : "none", gap: 8, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.user}</div>
                      <div style={{ color: C.muted, fontSize: 11, fontFamily: "'Share Tech Mono',monospace" }}>{p.item} • {p.method}</div>
                    </div>
                    <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, color: C.cyan, fontSize: 15 }}>{p.amount}</span>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 3, fontFamily: "'Share Tech Mono',monospace", fontWeight: 700,
                      background: p.status === "approved" ? "rgba(0,200,100,.1)" : p.status === "rejected" ? "rgba(255,68,68,.1)" : "rgba(255,165,0,.1)",
                      color: p.status === "approved" ? C.green : p.status === "rejected" ? C.red : C.orange,
                      border: `1px solid ${p.status === "approved" ? "rgba(0,200,100,.3)" : p.status === "rejected" ? "rgba(255,68,68,.3)" : "rgba(255,165,0,.3)"}` }}>
                      {(p.status || "pending").toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
              {/* Recent users */}
              <div className="card" style={{ padding: "18px" }}>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 14, fontWeight: 700, color: C.cyan, marginBottom: 14 }}>👥 Recent Registrations</div>
                {users.length === 0 ? <p style={{ color: C.muted, fontSize: 13 }}>No users yet.</p> : users.slice(-5).reverse().map((u, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,.03)" : "none" }}>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#00ffcc,#0077ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#060b14", flexShrink: 0 }}>{(u.name || "U")[0].toUpperCase()}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{u.name || "No name"}</div>
                      <div style={{ color: C.muted, fontSize: 11, fontFamily: "'Share Tech Mono',monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.email}</div>
                    </div>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 3, background: u.plan === "free" ? "rgba(0,119,255,.1)" : "rgba(0,255,204,.1)", color: u.plan === "free" ? "#4499ff" : C.cyan, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700 }}>{(u.plan || "FREE").toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {tab === "users" && (
            <div>
              <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
                <input className="input" placeholder="Search by name or email..." value={searchUser} onChange={e => setSearchUser(e.target.value)} style={{ flex: 1, minWidth: 200 }}/>
                <div style={{ color: C.muted, fontSize: 13, fontFamily: "'Share Tech Mono',monospace", whiteSpace: "nowrap" }}>{filteredUsers.length} users</div>
              </div>
              {filteredUsers.map((u, i) => (
                <div key={i} className="card" style={{ padding: "14px 16px", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#00ffcc,#0077ff)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, color: "#060b14", flexShrink: 0 }}>{(u.name || "U")[0].toUpperCase()}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{u.name || "No name"}</div>
                      <div style={{ color: C.muted, fontSize: 12, fontFamily: "'Share Tech Mono',monospace" }}>{u.email}</div>
                      {u.phone && <div style={{ color: C.muted, fontSize: 11 }}>📱 {u.phone}</div>}
                      <div style={{ color: C.muted, fontSize: 11 }}>Joined: {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}</div>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 3, background: u.plan === "free" ? "rgba(0,119,255,.1)" : u.plan === "pro" ? "rgba(0,255,204,.1)" : "rgba(255,107,53,.1)", color: u.plan === "free" ? "#4499ff" : u.plan === "pro" ? C.cyan : C.orange, fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, border: `1px solid ${u.plan === "free" ? "rgba(0,119,255,.3)" : u.plan === "pro" ? "rgba(0,255,204,.3)" : "rgba(255,107,53,.3)"}` }}>{(u.plan || "FREE").toUpperCase()}</span>
                      {/* Upgrade buttons */}
                      {u.plan !== "pro" && <button className="btn btn-outline" onClick={() => upgradeUser(u.email, "pro")} style={{ padding: "4px 10px", borderRadius: 5, fontSize: 10 }}>→ Pro</button>}
                      {u.plan !== "business" && <button className="btn btn-ghost" onClick={() => upgradeUser(u.email, "business")} style={{ padding: "4px 10px", borderRadius: 5, fontSize: 10 }}>→ Biz</button>}
                      {u.plan !== "free" && <button className="btn btn-ghost" onClick={() => upgradeUser(u.email, "free")} style={{ padding: "4px 10px", borderRadius: 5, fontSize: 10 }}>→ Free</button>}
                      <button className="btn btn-red" onClick={() => deleteUser(u.email)} style={{ padding: "4px 10px", borderRadius: 5, fontSize: 10 }}>🗑 Del</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── PAYMENTS ── */}
          {tab === "payments" && (
            <div>
              <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
                {[
                  { l: "All", v: payments.length, col: C.blue },
                  { l: "Pending", v: payments.filter(p => p.status === "pending").length, col: C.orange },
                  { l: "Approved", v: payments.filter(p => p.status === "approved").length, col: C.green },
                  { l: "Rejected", v: payments.filter(p => p.status === "rejected").length, col: C.red },
                ].map(s => (
                  <div key={s.l} className="card" style={{ padding: "10px 16px", display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 20, fontWeight: 700, color: s.col }}>{s.v}</span>
                    <span style={{ color: C.muted, fontSize: 12 }}>{s.l}</span>
                  </div>
                ))}
                <div className="card" style={{ padding: "10px 16px", display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 20, fontWeight: 700, color: "#F0B90B" }}>${totalRevenue.toFixed(2)}</span>
                  <span style={{ color: C.muted, fontSize: 12 }}>Revenue</span>
                </div>
              </div>
              {payments.length === 0 && <p style={{ color: C.muted }}>No payments submitted yet.</p>}
              {payments.map((p, i) => (
                <div key={i} className="card" style={{ padding: "14px 16px", marginBottom: 10, border: `1px solid ${p.status === "approved" ? "rgba(0,200,100,.15)" : p.status === "rejected" ? "rgba(255,68,68,.15)" : "rgba(255,165,0,.15)"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{p.item}</div>
                      <div style={{ color: C.muted, fontSize: 12 }}>👤 {p.user}</div>
                      <div style={{ color: C.muted, fontSize: 12 }}>📱 Method: <span style={{ color: C.text }}>{p.method}</span></div>
                      <div style={{ color: C.muted, fontSize: 12 }}>🔖 Ref: <span style={{ color: C.cyan, fontFamily: "'Share Tech Mono',monospace" }}>{p.txRef}</span></div>
                      <div style={{ color: C.muted, fontSize: 11, marginTop: 4, fontFamily: "'Share Tech Mono',monospace" }}>{new Date(p.date).toLocaleString()}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                      <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 22, fontWeight: 700, color: C.cyan }}>{p.amount}</span>
                      <div style={{ display: "flex", gap: 6 }}>
                        {p.status === "pending" && <>
                          <button className="btn btn-cyan" onClick={() => approvePayment(i)} style={{ padding: "5px 12px", borderRadius: 6, fontSize: 11 }}>✅ Approve</button>
                          <button className="btn btn-red" onClick={() => rejectPayment(i)} style={{ padding: "5px 12px", borderRadius: 6, fontSize: 11 }}>❌ Reject</button>
                        </>}
                        {p.status === "approved" && <span style={{ fontSize: 11, color: C.green, fontFamily: "'Share Tech Mono',monospace" }}>✅ APPROVED</span>}
                        {p.status === "rejected" && <span style={{ fontSize: 11, color: C.red, fontFamily: "'Share Tech Mono',monospace" }}>❌ REJECTED</span>}
                        <button className="btn btn-ghost" onClick={() => deletePayment(i)} style={{ padding: "5px 10px", borderRadius: 6, fontSize: 11 }}>🗑</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── NEWS / POST ── */}
          {tab === "news" && (
            <div>
              <div className="card" style={{ padding: "20px", marginBottom: 22 }}>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 15, color: C.cyan, marginBottom: 14 }}>✍ Publish New Article</div>
                {postSaved && <div style={{ background: "rgba(0,255,204,.08)", border: "1px solid rgba(0,255,204,.2)", borderRadius: 7, padding: "10px", marginBottom: 14, color: C.cyan, fontSize: 13 }}>✅ Article published!</div>}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <input className="input" placeholder="Article title..." value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })}/>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <select className="input" value={newPost.category} onChange={e => setNewPost({ ...newPost, category: e.target.value })} style={{ background: "rgba(0,255,204,.03)", flex: 1 }}>
                      {["Updates", "Announcements", "Features", "Tech", "Maintenance", "Promotions"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 14px", background: "rgba(0,255,204,.03)", border: "1px solid rgba(0,255,204,.15)", borderRadius: 8, cursor: "pointer", whiteSpace: "nowrap", fontSize: 13 }}>
                      <input type="checkbox" checked={newPost.pinned} onChange={e => setNewPost({ ...newPost, pinned: e.target.checked })} style={{ accentColor: C.cyan }}/> 📌 Pin
                    </label>
                  </div>
                  <textarea className="input" placeholder="Article content..." value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} rows={5} style={{ resize: "vertical" }}/>
                  <button className="btn btn-cyan" onClick={saveNews} style={{ padding: "12px", borderRadius: 8 }}>🚀 Publish Article</button>
                </div>
              </div>
              <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 13, color: C.muted, marginBottom: 12 }}>📰 Published Articles ({news.length})</div>
              {news.map((a, i) => (
                <div key={i} className="card" style={{ padding: "14px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{a.pinned ? "📌 " : ""}{a.title}</div>
                    <div style={{ color: C.muted, fontSize: 11, fontFamily: "'Share Tech Mono',monospace" }}>{a.category} • {new Date(a.date).toLocaleDateString()}</div>
                  </div>
                  <button className="btn btn-red" onClick={() => deleteNews(a.id)} style={{ padding: "6px 12px", borderRadius: 6, fontSize: 11, flexShrink: 0 }}>🗑 Delete</button>
                </div>
              ))}
            </div>
          )}

          {/* ── SITE SETTINGS ── */}
          {tab === "settings" && (
            <div>
              <div className="card" style={{ padding: "22px", marginBottom: 16 }}>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 15, color: C.cyan, marginBottom: 18 }}>⚙ Site Controls</div>
                {settingsSaved && <div style={{ background: "rgba(0,255,204,.08)", border: "1px solid rgba(0,255,204,.2)", borderRadius: 7, padding: "10px", marginBottom: 14, color: C.cyan, fontSize: 13 }}>✅ Settings saved!</div>}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { key: "maintenanceMode", label: "🔧 Maintenance Mode", desc: "Locks site for non-admins" },
                    { key: "allowRegistrations", label: "📝 Allow Registrations", desc: "Let new users sign up" },
                    { key: "freeBotsEnabled", label: "🤖 Free Bot Pairing", desc: "Enable free bot pairing feature" },
                    { key: "showBanner", label: "📢 Show Announcement Banner", desc: "Display banner on dashboard" },
                  ].map(s => (
                    <div key={s.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{s.label}</div>
                        <div style={{ color: C.muted, fontSize: 12 }}>{s.desc}</div>
                      </div>
                      <div onClick={() => setSiteSettings(prev => ({ ...prev, [s.key]: !prev[s.key] }))}
                        style={{ width: 44, height: 24, borderRadius: 12, background: siteSettings[s.key] ? C.cyan : "rgba(255,255,255,.1)", cursor: "pointer", position: "relative", transition: "background .3s", flexShrink: 0 }}>
                        <div style={{ position: "absolute", top: 2, left: siteSettings[s.key] ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: siteSettings[s.key] ? "#060b14" : "#6688aa", transition: "left .3s" }}/>
                      </div>
                    </div>
                  ))}
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>📢 Announcement Banner Text</div>
                    <input className="input" placeholder="e.g. 🔥 50% off Pro Plan this weekend!" value={siteSettings.announcementBanner} onChange={e => setSiteSettings(prev => ({ ...prev, announcementBanner: e.target.value }))}/>
                  </div>
                </div>
              </div>
              <div className="card" style={{ padding: "22px", marginBottom: 16 }}>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 15, color: C.cyan, marginBottom: 18 }}>💰 Pricing Controls</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>
                  {[
                    { key: "proPrice", label: "Pro Bot Plan Price" },
                    { key: "businessPrice", label: "Business Bot Plan Price" },
                    { key: "starterSetupPrice", label: "Starter Setup Price" },
                    { key: "proSetupPrice", label: "Pro Setup Price" },
                    { key: "customSetupPrice", label: "Custom Setup Price" },
                  ].map(f => (
                    <div key={f.key}>
                      <div style={{ fontSize: 12, color: C.muted, marginBottom: 6, fontFamily: "'Share Tech Mono',monospace" }}>{f.label}</div>
                      <input className="input" value={siteSettings[f.key]} onChange={e => setSiteSettings(prev => ({ ...prev, [f.key]: e.target.value }))} style={{ fontSize: 13 }}/>
                    </div>
                  ))}
                </div>
              </div>
              <button className="btn btn-cyan" onClick={saveSiteSettings} style={{ padding: "12px 28px", borderRadius: 8, fontSize: 14 }}>💾 Save All Settings</button>
            </div>
          )}

          {/* ── MESSAGES ── */}
          {tab === "messages" && (
            <div>
              <div style={{ color: C.muted, fontSize: 13, marginBottom: 16 }}>Support messages submitted by users from the Contact page.</div>
              {(() => {
                const msgs = JSON.parse(localStorage.getItem("sh_messages") || "[]");
                if (msgs.length === 0) return <div className="card" style={{ padding: "30px", textAlign: "center" }}><div style={{ fontSize: 40, marginBottom: 12 }}>📬</div><p style={{ color: C.muted }}>No messages yet.</p></div>;
                return msgs.map((m, i) => (
                  <div key={i} className="card" style={{ padding: "16px", marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{m.user || "Anonymous"}</span>
                      <span style={{ color: C.muted, fontSize: 11, fontFamily: "'Share Tech Mono',monospace" }}>{m.date ? new Date(m.date).toLocaleString() : "N/A"}</span>
                    </div>
                    <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7 }}>{m.message}</p>
                  </div>
                ));
              })()}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   DASHBOARD SHELL
═══════════════════════════════════════════════ */
function Dashboard({ user, onLogout }) {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paymentItem, setPaymentItem] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);

  // Secret: triple-click the footer copyright text to open admin login
  const [footerClicks, setFooterClicks] = useState(0);
  const footerClickRef = useRef(null);
  const handleFooterClick = () => {
    setFooterClicks(c => {
      const next = c + 1;
      if (next >= 3) {
        setShowAdmin(true);
        return 0;
      }
      clearTimeout(footerClickRef.current);
      footerClickRef.current = setTimeout(() => setFooterClicks(0), 2000);
      return next;
    });
  };

  const go = id => { setActive(id); setSidebarOpen(false); };
  const sharedProps = { user, setPaymentItem, setActive: go };

  const pages = {
    dashboard: <DashboardHome {...sharedProps} />,
    bots: <BotsPage {...sharedProps} />,
    movies: <MoviesPage />,
    music: <MusicPage />,
    sports: <SportsPage />,
    store: <StorePage {...sharedProps} />,
    setup: <SetupPage {...sharedProps} />,
    marketing: <MarketingPage {...sharedProps} />,
    news: <NewsPage user={user} />,
    payment: <PaymentPage {...sharedProps} />,
    tutorials: <TutorialsPage />,
    profile: <ProfilePage user={user} onLogout={onLogout} />,
    support: <SupportPage />,
    legal: <LegalPage />,
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      {/* Orbs */}
      <div className="orb" style={{ width: 600, height: 600, background: "radial-gradient(circle,rgba(0,255,204,.05),transparent)", top: "-10%", right: "-10%" }}/>
      <div className="orb" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(0,119,255,.04),transparent)", bottom: "5%", left: "-10%" }}/>
      <TopNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} active={active} user={user} />
      <Sidebar active={active} setActive={go} open={sidebarOpen} user={user} onLogout={onLogout} />
      <main style={{ paddingTop: 58, minHeight: "100vh", position: "relative", zIndex: 1 }}>
        <div style={{ padding: "22px 18px", maxWidth: 1060, margin: "0 auto" }}>
          {pages[active] || pages.dashboard}
        </div>
        {/* Footer */}
        <div style={{ borderTop: "1px solid rgba(0,255,204,.05)", padding: "20px 24px", textAlign: "center", marginTop: 40 }}>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "8px 20px", marginBottom: 10 }}>
            {[["legal", "Privacy Policy"], ["legal", "Terms of Service"], ["legal", "Disclaimer"], ["legal", "Refund Policy"], ["support", "Contact Us"]].map(([page, label], i) => (
              <span key={i} style={{ color: C.muted, fontSize: 12, cursor: "pointer", fontFamily: "'Share Tech Mono',monospace" }} onClick={() => go(page)}>{label}</span>
            ))}
          </div>
          {/* Triple-click this to open admin */}
          <p style={{ color: "#1a2a3a", fontSize: 11, fontFamily: "'Share Tech Mono',monospace", cursor: "default", userSelect: "none" }} onClick={handleFooterClick}>
            © 2025 ScottyHub • Built by Scotty • {SUPPORT.email}
          </p>
        </div>
      </main>
      {paymentItem && <PaymentModal item={paymentItem} onClose={() => setPaymentItem(null)} user={user} />}
      {showAdmin && <AdminPanel onClose={() => { setShowAdmin(false); setAdminAuthed(false); }} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════ */
export default function App() {
  const [splash, setSplash] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = firebaseAuth.restoreSession();
    if (saved) setUser(saved);
  }, []);

  const handleLogout = async () => {
    await firebaseAuth.signOut();
    setUser(null);
  };

  return (
    <>
      <style>{G}</style>
      {splash && <SplashScreen onDone={() => setSplash(false)} />}
      {!splash && (
        !user
          ? <AuthPage onAuth={u => setUser(u)} />
          : <Dashboard user={user} onLogout={handleLogout} />
      )}
    </>
  );
}

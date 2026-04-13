import { useState, useEffect, useRef } from "react";

const EMOJIS = ["😊","🔥","⭐","💎","🚀","❤️","🎯","🌟","👋","🦁","🐉","🍀","💡","🎵","📌"];

function loadQRious(cb) {
  if (window.QRious) return cb();
  const s = document.createElement("script");
  s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js";
  s.onload = cb;
  document.head.appendChild(s);
}

export default function App() {
  const [tab, setTab] = useState("url");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [contact, setContact] = useState({ first:"", last:"", phone:"", email:"", org:"", website:"" });
  const [mode, setMode] = useState("none");
  const [emoji, setEmoji] = useState("⭐");
  const [imgSrc, setImgSrc] = useState(null);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);
  const fileRef = useRef(null);

  function getData() {
    if (tab === "url") {
      const v = url.trim();
      if (!v) return "";
      return v.startsWith("http") ? v : "https://" + v;
    }
    if (tab === "text") return text;
    const { first, last, phone, email, org, website } = contact;
    if (!first && !last && !phone && !email) return "";
    return `BEGIN:VCARD\nVERSION:3.0\nFN:${first} ${last}\nN:${last};${first};;;\nORG:${org}\nTEL:${phone}\nEMAIL:${email}\nURL:${website}\nEND:VCARD`;
  }

  function drawOverlay(canvas) {
    if (mode === "none") return;
    const ctx = canvas.getContext("2d");
    const s = canvas.width, cx = s/2, cy = s/2, r = s*0.11;
    ctx.beginPath(); ctx.arc(cx,cy,r+5,0,Math.PI*2); ctx.fillStyle="#fff"; ctx.fill();
    if (mode === "emoji") {
      ctx.font = `${r*1.4}px serif`; ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText(emoji, cx, cy+2);
    } else if (mode === "image" && imgSrc) {
      const img = new Image();
      img.onload = () => { ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.clip(); ctx.drawImage(img,cx-r,cy-r,r*2,r*2); ctx.restore(); };
      img.src = imgSrc;
    }
  }

  useEffect(() => {
    const data = getData();
    const canvas = canvasRef.current;
    if (!canvas || !data) return;
    loadQRious(() => {
      new window.QRious({ element: canvas, value: data, size: 280, background: "white", foreground: "black", level: "H" });
      drawOverlay(canvas);
    });
  }, [tab, url, text, contact, mode, emoji, imgSrc]);

  const data = getData();

  function download() {
    const canvas = canvasRef.current; if (!canvas) return;
    const a = document.createElement("a"); a.download = "qr-code.png"; a.href = canvas.toDataURL(); a.click();
  }

  function copy() {
    if (!data) return;
    navigator.clipboard.writeText(data).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  function clearAll() {
    setUrl(""); setText(""); setContact({ first:"",last:"",phone:"",email:"",org:"",website:"" }); setImgSrc(null);
  }

  function handleFile(e) {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = ev => setImgSrc(ev.target.result);
    r.readAsDataURL(file);
  }

  const inp = "w-full px-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all";

  return (
    <div className="min-h-screen p-4" style={{background:"linear-gradient(135deg,#f5f3ff,#eff6ff,#eef2ff)"}}>
      <div className="max-w-4xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 text-3xl" style={{background:"linear-gradient(135deg,#7c3aed,#2563eb)"}}>▣</div>
          <h1 className="text-4xl font-bold mb-1" style={{background:"linear-gradient(135deg,#7c3aed,#2563eb)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>QR Code Generator</h1>
          <p className="text-gray-500">Generate QR codes for URLs, text, and contacts</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {[["url","🔗 URL"],["text","💬 Text"],["contact","👤 Contact"]].map(([id,label]) => (
              <button key={id} onClick={() => setTab(id)}
                className={"flex-1 py-4 text-sm font-medium transition-all border-b-2 " + (tab===id ? "text-purple-600 border-purple-600 bg-purple-50" : "text-gray-500 border-transparent hover:bg-gray-50")}>
                {label}
              </button>
            ))}
          </div>

          <div className="p-8 grid gap-8" style={{gridTemplateColumns:"1fr 1fr"}}>
            {/* LEFT */}
            <div>
              <p className="text-2xl font-semibold text-gray-800 mb-4">
                {tab==="url"?"Enter URL":tab==="text"?"Enter Text":"Contact Information"}
              </p>

              {tab==="url" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                  <input className={inp} placeholder="example.com or https://example.com" value={url} onChange={e=>setUrl(e.target.value)} />
                  <p className="text-xs text-gray-400 mt-1">https:// added automatically if omitted.</p>
                </div>
              )}

              {tab==="text" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Text Content</label>
                  <textarea className={inp} rows={4} placeholder="Enter any text..." value={text} onChange={e=>setText(e.target.value)} style={{resize:"none"}} />
                </div>
              )}

              {tab==="contact" && (
                <div className="space-y-3 mb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">First Name</label><input className={inp} placeholder="John" value={contact.first} onChange={e=>setContact({...contact,first:e.target.value})} /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label><input className={inp} placeholder="Doe" value={contact.last} onChange={e=>setContact({...contact,last:e.target.value})} /></div>
                  </div>
                  {[["phone","Phone","tel","+1 (555) 123-4567"],["email","Email","email","john@example.com"],["org","Organization","text","Company"],["website","Website","text","https://example.com"]].map(([k,label,type,ph]) => (
                    <div key={k}><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label><input className={inp} type={type} placeholder={ph} value={contact[k]} onChange={e=>setContact({...contact,[k]:e.target.value})} /></div>
                  ))}
                </div>
              )}

              {/* Overlay */}
              <div className="border border-gray-200 rounded-2xl p-4 mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">Center overlay</p>
                <div className="flex gap-2 mb-3">
                  {[["none","None"],["emoji","😊 Emoji"],["image","📷 Photo"]].map(([m,label]) => (
                    <button key={m} onClick={()=>setMode(m)}
                      className={"flex-1 py-2 rounded-xl text-sm font-medium border transition-all " + (mode===m ? "text-white border-purple-600" : "text-gray-600 border-gray-200 hover:border-purple-300")}
                      style={mode===m?{background:"linear-gradient(135deg,#7c3aed,#2563eb)"}:{}}>
                      {label}
                    </button>
                  ))}
                </div>
                {mode==="emoji" && (
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {EMOJIS.map(e => (
                        <button key={e} onClick={()=>setEmoji(e)}
                          className={"w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-all " + (emoji===e?"bg-purple-100 ring-2 ring-purple-500":"hover:bg-gray-100")}>
                          {e}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">Selected: <span className="text-base">{emoji}</span></p>
                  </div>
                )}
                {mode==="image" && (
                  <div>
                    <button onClick={()=>fileRef.current.click()}
                      className="w-full py-2 border-2 border-dashed border-purple-300 rounded-xl text-sm text-purple-600 font-medium hover:bg-purple-50 transition-all">
                      {imgSrc ? "Change photo" : "Upload photo"}
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                    {imgSrc && (
                      <div className="flex items-center gap-2 mt-2">
                        <img src={imgSrc} className="w-10 h-10 rounded-full object-cover border-2 border-purple-300" alt="preview" />
                        <span className="text-xs text-gray-500 flex-1">Photo uploaded</span>
                        <button onClick={()=>setImgSrc(null)} className="text-gray-400 hover:text-red-500 text-lg">✕</button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button onClick={clearAll} className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all">
                Clear All Fields
              </button>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-center gap-4">
              <p className="text-2xl font-semibold text-gray-800">Generated QR Code</p>
              <div className="bg-gray-50 rounded-2xl p-8 w-full max-w-xs flex flex-col items-center justify-center" style={{minHeight:280}}>
                {!data ? (
                  <div className="text-center">
                    <div className="text-6xl opacity-20 mb-2">▣</div>
                    <p className="text-gray-400 text-sm">Fill in the form to generate your QR code</p>
                  </div>
                ) : (
                  <>
                    <canvas ref={canvasRef} style={{maxWidth:"100%",borderRadius:12,boxShadow:"0 4px 20px rgba(0,0,0,.08)"}} />
                    <p className="text-xs text-gray-500 mt-3">Scan with your device</p>
                  </>
                )}
                {!data && <canvas ref={canvasRef} className="hidden" />}
              </div>

              {data && (
                <>
                  <div className="flex gap-3 w-full max-w-xs">
                    <button onClick={download} className="flex-1 py-3 text-white rounded-xl text-sm font-medium transition-opacity hover:opacity-90"
                      style={{background:"linear-gradient(135deg,#7c3aed,#2563eb)"}}>
                      ⬇ Download
                    </button>
                    <button onClick={copy} className={"flex-1 py-3 rounded-xl text-sm font-medium transition-all " + (copied?"bg-green-100 text-green-700":"bg-gray-100 text-gray-700 hover:bg-gray-200")}>
                      {copied ? "✓ Copied!" : "📋 Copy Data"}
                    </button>
                  </div>
                  <div className="w-full max-w-xs">
                    <p className="text-xs text-gray-500 mb-1">QR Data:</p>
                    <pre className="bg-gray-100 rounded-xl p-3 text-xs text-gray-600 max-h-24 overflow-y-auto whitespace-pre-wrap break-all">{data}</pre>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <p className="text-center mt-6 text-gray-400 text-xs">Generate QR codes instantly • No data stored • Free to use</p>
      </div>
    </div>
  );
}

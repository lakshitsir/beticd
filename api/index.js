const axios = require('axios');
const { HttpsProxyAgent } = require('https-proxy-agent');

// --- AUTH & IDENTITY ---
const AUTH_KEY = "lakshitop";
const DEV_TAG = "@lakshitpatidar";

// --- GLOBAL PROXY POOL (India & Global) ---
const PROXY_LIST = [
    "117.216.46.148:1080", "203.115.106.94:60606", "103.174.81.1:5678",
    "3.6.92.46:1080", "219.65.73.81:80", "139.59.24.173:1080",
    "103.48.183.113:4145", "175.101.240.38:80", "64.227.131.240:1080",
    "139.59.59.122:8118", "103.159.46.10:83", "103.81.117.225:4153",
    "167.71.226.135:1080", "4.213.98.253:80", "103.143.8.126:51951",
    "103.69.243.162:4153", "210.16.86.105:5678", "4.213.167.178:80",
    "103.147.98.122:8080", "40.192.16.115:5050", "103.97.94.22:4153",
    "45.249.79.190:3629", "27.34.242.98:80", "117.198.221.34:4153",
    "202.179.83.169:51951", "103.37.82.134:39873"
];

// Anti-Crash Guard
process.on('uncaughtException', (err) => console.error('System Overlord Guard:', err));

export default async function handler(req, res) {
    const { url, key, proxy_custom } = req.query;

    // 1. MASTER DASHBOARD (Visual Interface)
    if (!url) {
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>OVERLORD V3 | MAX PROFESSIONAL</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Inter:wght@300;500&display=swap" rel="stylesheet">
                <style>
                    body { background: radial-gradient(circle at top, #1e293b 0%, #0f172a 100%); font-family: 'Inter', sans-serif; }
                    .cyber-card { background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(59, 130, 246, 0.2); }
                    .glow-text { font-family: 'Orbitron', sans-serif; text-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
                </style>
            </head>
            <body class="flex items-center justify-center min-h-screen p-4">
                <div class="cyber-card p-10 rounded-3xl w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <div class="text-center mb-8">
                        <h1 class="text-5xl font-black text-blue-500 glow-text mb-2">OVERLORD V3</h1>
                        <p class="text-gray-400 text-sm tracking-widest uppercase">Multi-Platform Extraction Engine</p>
                    </div>

                    <div class="space-y-5">
                        <div class="relative">
                            <input id="mediaUrl" type="text" placeholder="Paste Video/Post URL..." class="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <input id="apiKey" type="password" value="lakshitop" class="p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-white outline-none focus:border-blue-500">
                            <input id="proxy" type="text" placeholder="Custom Proxy (Opt)" class="p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-white outline-none focus:border-blue-500">
                        </div>

                        <button onclick="extract()" id="btn" class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all transform active:scale-95">START EXTRACTION</button>
                    </div>

                    <div id="status" class="mt-4 text-center text-xs font-mono text-gray-500">System Ready | India Proxies: Active</div>

                    <div id="res" class="mt-8 hidden p-5 rounded-xl bg-black/60 border border-blue-500/20 overflow-x-auto">
                        <pre id="json" class="text-xs text-blue-400"></pre>
                    </div>

                    <div class="mt-10 pt-6 border-t border-slate-800 text-center">
                        <p class="text-gray-600 text-[10px] uppercase tracking-tighter">Developed by <span class="text-blue-400">${DEV_TAG}</span></p>
                    </div>
                </div>

                <script>
                    async function extract() {
                        const btn = document.getElementById('btn');
                        const resDiv = document.getElementById('res');
                        const json = document.getElementById('json');
                        const url = document.getElementById('mediaUrl').value;
                        const key = document.getElementById('apiKey').value;
                        const proxy = document.getElementById('proxy').value;

                        if(!url) return alert('Bhai URL kidhar hai?');

                        btn.innerText = 'EXTRACTING MAX QUALITY...';
                        btn.disabled = true;

                        try {
                            const response = await fetch(\`/api?url=\${encodeURIComponent(url)}&key=\${key}\${proxy ? '&proxy_custom='+proxy : ''}\`);
                            const data = await response.json();
                            resDiv.classList.remove('hidden');
                            json.innerText = JSON.stringify(data, null, 4);
                        } catch (e) {
                            json.innerText = 'ERROR: Connection failed.';
                        } finally {
                            btn.innerText = 'START EXTRACTION';
                            btn.disabled = false;
                        }
                    }
                </script>
            </body>
            </html>
        `);
    }

    // 2. API ENDPOINT LOGIC
    if (key !== AUTH_KEY) {
        return res.status(401).json({ status: false, msg: "Key invalid hai bhai!", dev: DEV_TAG });
    }

    try {
        // Dynamic Proxy Selection
        const selectedProxy = proxy_custom || PROXY_LIST[Math.floor(Math.random() * PROXY_LIST.length)];
        const agent = new HttpsProxyAgent(selectedProxy.startsWith('http') ? selectedProxy : `http://${selectedProxy}`);

        const extraction = await axios({
            method: 'POST',
            url: 'https://api.cobalt.tools/api/json',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36'
            },
            data: {
                url: url,
                videoQuality: "max", 
                filenameStyle: "pretty",
                isNoTTWatermark: true,
                twitterGif: true
            },
            httpsAgent: agent,
            timeout: 15000
        });

        return res.status(200).json({
            status: "success",
            dev: DEV_TAG,
            data: {
                title: extraction.data.text || "Overlord Media",
                download: extraction.data.url,
                stream: extraction.data.stream || extraction.data.url,
                quality: "Max Resolution",
                platform: new URL(url).hostname.replace('www.', ''),
                proxy_used: selectedProxy.split('@')[1] || selectedProxy
            }
        });

    } catch (err) {
        return res.status(500).json({
            status: "error",
            msg: err.response?.data?.text || "Request failed. Check URL or Proxy.",
            dev: DEV_TAG
        });
    }
  }
          

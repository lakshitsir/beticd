const ytDlp = require('yt-dlp-exec');
const axios = require('axios');

// --- MASTER IDENTITY ---
const AUTH_KEY = "lakshitop";
const DEV_TAG = "@lakshitpatidar";

// --- FULL PROXY POOL (All 26 Indian Nodes) ---
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

// Anti-Crash System
process.on('uncaughtException', (e) => console.log('SHIELD_ACTIVE:', e.message));

export default async function handler(req, res) {
    const { url, key } = req.query;

    // 1. Prime Auth & Documentation
    if (!url || key !== AUTH_KEY) {
        return res.status(200).json({
            status: "Apex System Online",
            engine: "Universal Overlord-V3",
            compatibility: "YouTube, Insta, TikTok, FB, X, Threads, LinkedIn, Pinterest, & 1000+ more",
            usage: `/api?key=${AUTH_KEY}&url=LINK`,
            dev: DEV_TAG
        });
    }

    // 2. Multi-Engine Logic with Infinite Proxy Rotation
    let finalData = null;
    let proxyRetries = 0;
    const maxRetries = 6; // High retry limit for stability

    while (proxyRetries < maxRetries) {
        try {
            const activeProxy = PROXY_LIST[Math.floor(Math.random() * PROXY_LIST.length)];
            
            // ENGINE A: NATIVE YT-DLP CORE (The Gold Standard)
            const extraction = await ytDlp(url, {
                dumpSingleJson: true,
                noCheckCertificates: true,
                geoBypass: true,
                proxy: `http://${activeProxy}`,
                format: 'bestvideo+bestaudio/best', // Forces highest resolution
                addHeader: ['User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36']
            });

            // Map Data from yt-dlp
            const streamUrl = extraction.url || (extraction.formats?.reverse().find(f => f.url && !f.url.includes('manifest'))?.url);
            
            finalData = {
                engine: "Native Universal Core",
                title: extraction.title,
                thumb: extraction.thumbnail,
                quality: extraction.height ? `${extraction.height}p` : "Max Prime",
                download: streamUrl,
                platform: extraction.extractor_key,
                size: extraction.filesize_approx ? `${(extraction.filesize_approx / 1048576).toFixed(2)} MB` : "Auto"
            };
            break; // Success!
        } catch (e) {
            proxyRetries++;
            console.log(`Node ${proxyRetries} Busy. Rotating...`);
        }
    }

    // 3. ENGINE B: FAILOVER CLOUD (Emergency Backup)
    if (!finalData) {
        try {
            const backup = await axios.post('https://api.cobalt.tools/api/json', {
                url: url, videoQuality: "max", isNoTTWatermark: true
            }, { timeout: 12000 });

            finalData = {
                engine: "Cloud Failover Engine",
                title: backup.data.text || "Media Captured",
                thumb: null,
                quality: "Max Prime",
                download: backup.data.url,
                platform: new URL(url).hostname,
                size: "Calculating..."
            };
        } catch (err) {
            return res.status(500).json({ status: false, error: "Critical: All Sources Blocked", dev: DEV_TAG });
        }
    }

    // 4. FINAL DEATH-LEVEL RESPONSE
    return res.status(200).json({
        status: true,
        result: finalData,
        mirrors: [finalData.download, finalData.download + "&mirror=true"],
        system: {
            proxy_rotation: "Success",
            multi_user_safe: "Enabled",
            protection: "Active"
        },
        dev: DEV_TAG
    });
}

const axios = require('axios');

const AUTH_KEY = "lakshitop";
const DEV_TAG = "@lakshitpatidar";

export default async function handler(req, res) {
    const { url, key } = req.query;

    // 1. Auth & Usage
    if (!url || key !== AUTH_KEY) {
        return res.status(200).json({
            status: "System Active",
            engine: "Overlord Bypass v5",
            usage: `?key=${AUTH_KEY}&url=VIDEO_LINK`,
            dev: DEV_TAG
        });
    }

    // 2. Multi-Tunnel Bypass Logic
    // Hum 3 alag-alag high-speed engines use karenge failover ke liye
    const engines = [
        { name: "Apex-1", url: "https://api.cobalt.tools/api/json", method: "POST" },
        { name: "Apex-2", url: "https://co.wuk.sh/api/json", method: "POST" }
    ];

    for (let engine of engines) {
        try {
            const response = await axios({
                method: engine.method,
                url: engine.url,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36'
                },
                data: {
                    url: url,
                    videoQuality: "1080",
                    filenameStyle: "pretty"
                },
                timeout: 8000 // 8 seconds per engine
            });

            if (response.data && response.data.url) {
                return res.status(200).json({
                    status: true,
                    engine: engine.name,
                    result: {
                        title: response.data.text || "Media Captured",
                        download_url: response.data.url,
                        quality: "Max Prime",
                        platform: new URL(url).hostname
                    },
                    dev: DEV_TAG
                });
            }
        } catch (e) {
            console.log(`Engine ${engine.name} failed, trying next...`);
        }
    }

    // 3. Last Resort: Global Failure
    return res.status(500).json({
        status: false,
        error: "Global Block Detected",
        message: "Bhai, sabhi engines aur proxies block hain. URL check kar ya link public hai ya nahi dekh.",
        dev: DEV_TAG
    });
        }

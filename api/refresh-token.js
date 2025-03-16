export default async function handler(req, res) {
    // 读取环境变量
    const refreshToken = process.env.DROPBOX_REFRESH_TOKEN;
    const clientId = process.env.DROPBOX_CLIENT_ID;
    const clientSecret = process.env.DROPBOX_CLIENT_SECRET;
  
    if (!refreshToken || !clientId || !clientSecret) {
      return res.status(500).json({ error: "Missing environment variables" });
    }
  
    try {
      // 发送请求到 Dropbox API，获取新的 access_token
      const response = await fetch("https://api.dropbox.com/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          refresh_token: refreshToken,
          grant_type: "refresh_token",
          client_id: clientId,
          client_secret: clientSecret,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || "Failed to refresh token");
      }
  
      // 成功获取 access_token，返回给前端
      res.status(200).json({ access_token: data.access_token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
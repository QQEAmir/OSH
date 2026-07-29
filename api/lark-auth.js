export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const APP_ID = process.env.LARK_APP_ID;
  const APP_SECRET = process.env.LARK_APP_SECRET;
  const { code } = req.body;

  try {
    // Get user access token
    const tokenRes = await fetch('https://open.larksuite.com/open-apis/authen/v1/oidc/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grant_type: 'authorization_code', code, app_id: APP_ID, app_secret: APP_SECRET })
    });
    const tokenData = await tokenRes.json();
    const userToken = tokenData.data?.access_token;
    if (!userToken) return res.status(400).json({ success: false, error: 'No token' });

    // Get user info
    const userRes = await fetch('https://open.larksuite.com/open-apis/authen/v1/user_info', {
      headers: { 'Authorization': `Bearer ${userToken}` }
    });
    const userData = await userRes.json();
    const u = userData.data;

    return res.status(200).json({
      success: true,
      name: u?.name || u?.en_name || 'User',
      open_id: u?.open_id || '',
      avatar: u?.avatar_url || ''
    });
  } catch(err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

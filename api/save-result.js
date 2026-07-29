export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const WEBHOOK_URL = 'https://zp9fxvayn6g.jp.larksuite.com/base/workflow/webhook/event/X7zgaLFdlwleLnhFBMdjzLEspfg';

  try {
    const { name, employeeId, module, score, passed, attempts, wrongQuestions, date } = req.body;

    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name || employeeId,
        module: String(module),
        score: String(score),
        passed: String(passed),
        attempts: String(attempts),
        wrong_questions: wrongQuestions || '',
        date: date || new Date().toISOString()
      })
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
}

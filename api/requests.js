// API Vercel simple sans dépendances
let requests = {};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    // Créer une nouvelle demande
    const { phone, username } = req.body;
    
    if (!phone || !username) {
      return res.status(400).json({ error: 'phone and username required' });
    }

    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    const requestData = {
      phone,
      username,
      createdAt: Date.now(),
      status: 'pending'
    };

    requests[id] = requestData;
    
    console.log(`📨 Nouvelle demande: ${id} - ${username} (${phone})`);
    
    return res.status(200).json({ id, ...requestData });
  }

  if (req.method === 'GET') {
    // Récupérer les demandes en attente
    const pending = {};
    for (const [id, data] of Object.entries(requests)) {
      if (data.status === 'pending') {
        pending[id] = data;
      }
    }
    return res.status(200).json(pending);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

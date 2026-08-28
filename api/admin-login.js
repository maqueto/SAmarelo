import { createAdminCookie } from './_auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { senha } = req.body || {};

  if (!process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'Configuração do servidor incompleta' });
  }

  if (!senha || senha !== process.env.ADMIN_PASSWORD) {
    // Pequeno atraso ajuda a dificultar tentativas automatizadas de força bruta.
    await new Promise((r) => setTimeout(r, 400));
    return res.status(401).json({ error: 'Senha incorreta' });
  }

  res.setHeader('Set-Cookie', createAdminCookie());
  return res.status(200).json({ ok: true });
}

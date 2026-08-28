// Funções auxiliares de autenticação do painel administrativo.
// Usa um cookie httpOnly com um JWT assinado — sem sessão em banco.

import jwt from 'jsonwebtoken';

const COOKIE_NAME = 'admin_token';

export function getTokenFromRequest(req) {
  const cookieHeader = req.headers.cookie || '';
  const match = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`));
  return match ? match.split('=')[1] : null;
}

export function isAdminRequest(req) {
  const token = getTokenFromRequest(req);
  if (!token) return false;
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export function createAdminCookie() {
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '4h' });
  // Secure exige HTTPS — a Vercel já serve tudo em HTTPS por padrão.
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=14400`;
}

export function clearAdminCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

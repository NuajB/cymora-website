const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'No autorizado. Inicia sesión de nuevo.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.empleado = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Tu sesión expiró o no es válida. Inicia sesión de nuevo.' });
  }
}

module.exports = requireAuth;

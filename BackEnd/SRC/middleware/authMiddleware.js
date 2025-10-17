import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET;

export const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Missing token' });
  }
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, secret);
    req.user = payload; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

import type { RequestHandler } from 'express'

export type Role = 'guest' | 'member' | 'staff' | 'admin' | 'owner'

export const requireRole = (allowed: Role[]): RequestHandler => {
  return (req, res, next) => {
    const role = req.user?.role
    if (!role || !allowed.includes(role)) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    next()
  }
}

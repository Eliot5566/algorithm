import type { RequestHandler } from 'express'
import type { Role } from './requireRole.js'

export interface RequestUser {
  id?: string
  role: Role
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: RequestUser
  }
}

const defaultRole: Role = 'guest'

export const attachUserFromHeader: RequestHandler = (req, _res, next) => {
  const roleHeader = req.header('x-role')?.toLowerCase() as Role | undefined
  req.user = {
    role: roleHeader ?? defaultRole
  }
  next()
}

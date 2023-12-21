import { Request } from 'express';

interface JwtUserPayload extends BaseJwtPayload {
  id: number;
}

interface BaseJwtPayload {
  iat: number;
  exp: number;
}

interface RequestWithUser extends Request {
  user?: JwtUserPayload;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export { JwtUserPayload, RequestWithUser, BaseJwtPayload, TokenPair };

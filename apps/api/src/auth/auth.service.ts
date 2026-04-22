import { Injectable } from "@nestjs/common";
import { fromNodeHeaders } from "better-auth/node";
import type { Request } from "express";
import { auth } from "./auth.config";

export type SessionUser = {
  id: string;
  email: string | null;
};

@Injectable()
export class AuthService {
  async getSession(req: Request) {
    return auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  }
}

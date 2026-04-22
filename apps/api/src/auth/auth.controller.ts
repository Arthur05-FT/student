import { All, Controller, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.config";

const handler = toNodeHandler(auth);

@Controller("api/auth")
export class AuthController {
  @All("*path")
  async handle(@Req() req: Request, @Res() res: Response): Promise<void> {
    await handler(req, res);
  }
}

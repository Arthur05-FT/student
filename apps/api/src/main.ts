import "dotenv/config";
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as express from "express";
import type { Request, Response, NextFunction } from "express";
import { AppModule } from "./app.module";
import { AppExceptionFilter } from "./common/filters/app-exception.filter";

async function bootstrap(): Promise<void> {
  // bodyParser: false → on n'applique JSON parsing qu'aux routes non-Better-Auth.
  // Better Auth a besoin du Request brut (toNodeHandler).
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });

  const webOrigin = process.env.WEB_ORIGIN ?? "http://localhost:3000";
  app.enableCors({ origin: webOrigin, credentials: true });

  app.useGlobalFilters(new AppExceptionFilter());

  // Body parser actif seulement hors /api/auth/*.
  const skipAuth = (req: Request) => req.path.startsWith("/api/auth");
  const jsonParser = express.json();
  const urlencodedParser = express.urlencoded({ extended: true });

  app.use((req: Request, res: Response, next: NextFunction) =>
    skipAuth(req) ? next() : jsonParser(req, res, next),
  );
  app.use((req: Request, res: Response, next: NextFunction) =>
    skipAuth(req) ? next() : urlencodedParser(req, res, next),
  );

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  Logger.log(`API listening on http://localhost:${port}`, "Bootstrap");
  Logger.log(`Better Auth handler: http://localhost:${port}/api/auth/*`, "Bootstrap");
  Logger.log(`CORS origin: ${webOrigin}`, "Bootstrap");
}

void bootstrap();

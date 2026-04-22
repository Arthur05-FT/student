import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { SchoolsModule } from "./schools/schools.module";
import { ClassesModule } from "./classes/classes.module";
import { StudentsModule } from "./students/students.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    SchoolsModule,
    ClassesModule,
    StudentsModule,
    UsersModule,
  ],
})
export class AppModule {}

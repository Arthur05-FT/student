import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { TeachersService } from "./teachers.service";
import { SessionGuard } from "../common/guards/session.guard";
import { MembershipGuard, Membership } from "../common/guards/membership.guard";
import { CurrentMembership } from "../common/decorators/membership.decorator";
import { ROLES, Roles } from "../common/decorators/roles.decorator";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import {
  createTeacherSchema,
  CreateTeacherDto,
  updateTeacherSchema,
  UpdateTeacherDto,
} from "../schemas/teacher.schema";

@Controller("schools/:schoolSlug/teachers")
@UseGuards(SessionGuard, MembershipGuard)
export class TeachersController {
  constructor(private readonly teachers: TeachersService) {}

  @Get()
  list(@CurrentMembership() m: Membership) {
    return this.teachers.list(m.schoolId);
  }

  @Get(":id")
  findOne(@CurrentMembership() m: Membership, @Param("id") id: string) {
    return this.teachers.findById(m.schoolId, id);
  }

  @Post()
  @Roles(...ROLES.STAFF)
  create(
    @CurrentMembership() m: Membership,
    @Body(new ZodValidationPipe(createTeacherSchema)) body: CreateTeacherDto,
  ) {
    return this.teachers.create(m.schoolId, body);
  }

  @Patch(":id")
  @Roles(...ROLES.STAFF)
  update(
    @CurrentMembership() m: Membership,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateTeacherSchema)) body: UpdateTeacherDto,
  ) {
    return this.teachers.update(m.schoolId, id, body);
  }

  @Delete(":id")
  @Roles(...ROLES.ADMINS)
  remove(@CurrentMembership() m: Membership, @Param("id") id: string) {
    return this.teachers.delete(m.schoolId, id);
  }
}

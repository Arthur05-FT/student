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
import { ClassesService } from "./classes.service";
import { SessionGuard } from "../common/guards/session.guard";
import { MembershipGuard, Membership } from "../common/guards/membership.guard";
import { CurrentMembership } from "../common/decorators/membership.decorator";
import { ROLES, Roles } from "../common/decorators/roles.decorator";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import {
  createClassesSchema,
  CreateClassesDto,
  updateClassesSchema,
  UpdateClassesDto,
} from "../schemas/classes.schema";

@Controller("schools/:schoolSlug/classes")
@UseGuards(SessionGuard, MembershipGuard)
export class ClassesController {
  constructor(private readonly classes: ClassesService) {}

  @Get()
  list(@CurrentMembership() m: Membership) {
    return this.classes.list(m.schoolId);
  }

  @Get(":id")
  findOne(@CurrentMembership() m: Membership, @Param("id") id: string) {
    return this.classes.findById(m.schoolId, id);
  }

  @Post()
  @Roles(...ROLES.STAFF)
  create(
    @CurrentMembership() m: Membership,
    @Body(new ZodValidationPipe(createClassesSchema)) body: CreateClassesDto,
  ) {
    return this.classes.create(m.schoolId, body);
  }

  @Patch(":id")
  @Roles(...ROLES.STAFF)
  update(
    @CurrentMembership() m: Membership,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateClassesSchema)) body: UpdateClassesDto,
  ) {
    return this.classes.update(m.schoolId, id, body);
  }

  @Delete(":id")
  @Roles(...ROLES.ADMINS)
  remove(@CurrentMembership() m: Membership, @Param("id") id: string) {
    return this.classes.delete(m.schoolId, id);
  }
}

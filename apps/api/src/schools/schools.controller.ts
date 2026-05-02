import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { SchoolsService } from "./schools.service";
import { SessionGuard, SessionContext } from "../common/guards/session.guard";
import { MembershipGuard, Membership } from "../common/guards/membership.guard";
import { Session } from "../common/decorators/session.decorator";
import { CurrentMembership } from "../common/decorators/membership.decorator";
import { ROLES, Roles } from "../common/decorators/roles.decorator";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import {
  createSchoolSchema,
  CreateSchoolDto,
  updateSchoolSchema,
  UpdateSchoolDto,
} from "../schemas/school.schema";

@Controller("schools")
@UseGuards(SessionGuard)
export class SchoolsController {
  constructor(private readonly schools: SchoolsService) {}

  @Get()
  list(@Session() session: SessionContext) {
    return this.schools.listMine(session.userId);
  }

  @Get("lookup-by-email")
  lookupByEmail(@Query("email") email: string) {
    return this.schools.findByEmail(email);
  }

  @Post()
  create(
    @Session() session: SessionContext,
    @Body(new ZodValidationPipe(createSchoolSchema)) body: CreateSchoolDto,
  ) {
    return this.schools.create(session.userId, body);
  }

  @Get(":schoolSlug")
  @UseGuards(MembershipGuard)
  detail(@CurrentMembership() membership: Membership) {
    return this.schools.findBySlug(membership.schoolSlug);
  }

  @Patch(":schoolSlug")
  @UseGuards(MembershipGuard)
  @Roles(...ROLES.ADMINS)
  update(
    @CurrentMembership() membership: Membership,
    @Body(new ZodValidationPipe(updateSchoolSchema)) body: UpdateSchoolDto,
  ) {
    return this.schools.update(membership.schoolId, membership.schoolSlug, body);
  }

  @Delete(":schoolSlug")
  @UseGuards(MembershipGuard)
  @Roles(...ROLES.DIRECTOR_ONLY)
  remove(@CurrentMembership() membership: Membership) {
    return this.schools.delete(membership.schoolId);
  }
}


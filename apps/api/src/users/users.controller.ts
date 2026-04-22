import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { SessionGuard, SessionContext } from "../common/guards/session.guard";
import { MembershipGuard, Membership } from "../common/guards/membership.guard";
import { Session } from "../common/decorators/session.decorator";
import { CurrentMembership } from "../common/decorators/membership.decorator";
import { ROLES, Roles } from "../common/decorators/roles.decorator";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import {
  ListSchoolMembersQuery,
  listSchoolMembersSchema,
  UpdateMembershipRoleDto,
  updateMembershipRoleSchema,
  UpdateUserProfileDto,
  updateUserProfileSchema,
} from "../schemas/user.schema";

@Controller()
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get("me")
  @UseGuards(SessionGuard)
  me(@Session() session: SessionContext) {
    return this.users.findById(session.userId);
  }

  @Patch("me")
  @UseGuards(SessionGuard)
  updateMe(
    @Session() session: SessionContext,
    @Body(new ZodValidationPipe(updateUserProfileSchema)) body: UpdateUserProfileDto,
  ) {
    return this.users.updateProfile(session.userId, body);
  }

  @Get("schools/:schoolSlug/members")
  @UseGuards(SessionGuard, MembershipGuard)
  listMembers(
    @CurrentMembership() m: Membership,
    @Query(new ZodValidationPipe(listSchoolMembersSchema)) query: ListSchoolMembersQuery,
  ) {
    return this.users.listMembers(m.schoolId, query);
  }

  @Patch("schools/:schoolSlug/members/:targetUserId")
  @UseGuards(SessionGuard, MembershipGuard)
  @Roles(...ROLES.DIRECTOR_ONLY)
  updateMemberRole(
    @CurrentMembership() m: Membership,
    @Param("targetUserId") targetUserId: string,
    @Body(new ZodValidationPipe(updateMembershipRoleSchema)) body: UpdateMembershipRoleDto,
  ) {
    return this.users.updateMembershipRole(m.schoolId, m.userId, targetUserId, body.role);
  }

  @Delete("schools/:schoolSlug/members/:targetUserId")
  @UseGuards(SessionGuard, MembershipGuard)
  @Roles(...ROLES.DIRECTOR_ONLY)
  removeMember(
    @CurrentMembership() m: Membership,
    @Param("targetUserId") targetUserId: string,
  ) {
    return this.users.removeMembership(m.schoolId, m.userId, targetUserId);
  }
}

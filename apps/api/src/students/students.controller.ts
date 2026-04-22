import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { StudentsService } from "./students.service";
import { SessionGuard } from "../common/guards/session.guard";
import { MembershipGuard, Membership } from "../common/guards/membership.guard";
import { CurrentMembership } from "../common/decorators/membership.decorator";
import { ROLES, Roles } from "../common/decorators/roles.decorator";
import { ZodValidationPipe } from "../common/pipes/zod-validation.pipe";
import {
  createStudentSchema,
  CreateStudentDto,
  ListStudentsQuery,
  listStudentsSchema,
  updateStudentSchema,
  UpdateStudentDto,
} from "../schemas/student.schema";

@Controller("schools/:schoolSlug/students")
@UseGuards(SessionGuard, MembershipGuard)
export class StudentsController {
  constructor(private readonly students: StudentsService) {}

  @Get()
  list(
    @CurrentMembership() m: Membership,
    @Query(new ZodValidationPipe(listStudentsSchema)) query: ListStudentsQuery,
  ) {
    return this.students.list(m.schoolId, query);
  }

  @Get(":id")
  findOne(@CurrentMembership() m: Membership, @Param("id") id: string) {
    return this.students.findById(m.schoolId, id);
  }

  @Post()
  @Roles(...ROLES.STAFF)
  create(
    @CurrentMembership() m: Membership,
    @Body(new ZodValidationPipe(createStudentSchema)) body: CreateStudentDto,
  ) {
    return this.students.create(m.schoolId, body);
  }

  @Patch(":id")
  @Roles(...ROLES.STAFF)
  update(
    @CurrentMembership() m: Membership,
    @Param("id") id: string,
    @Body(new ZodValidationPipe(updateStudentSchema)) body: UpdateStudentDto,
  ) {
    return this.students.update(m.schoolId, id, body);
  }

  @Delete(":id")
  @Roles(...ROLES.STAFF)
  remove(@CurrentMembership() m: Membership, @Param("id") id: string) {
    return this.students.delete(m.schoolId, id);
  }
}

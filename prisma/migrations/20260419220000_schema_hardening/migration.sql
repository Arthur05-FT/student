-- Schema hardening migration
-- 1. Rename Classes.updateAt -> updatedAt
-- 2. Rename Student.updateAt -> updatedAt
-- 3. Add cascade deletes for Classes.schoolId and Student.schoolId
-- 4. Add SET NULL for Student.classId
-- 5. Add indexes on FK columns
-- 6. Add unique (schoolId, name) on Classes
-- 7. Make User.role nullable (per-school role lives in UserSchool.role)

-- 1 & 2: Rename columns
ALTER TABLE "Classes" RENAME COLUMN "updateAt" TO "updatedAt";
ALTER TABLE "Student" RENAME COLUMN "updateAt" TO "updatedAt";

-- 3: Drop and recreate FK Classes.schoolId with CASCADE
ALTER TABLE "Classes" DROP CONSTRAINT "Classes_schoolId_fkey";
ALTER TABLE "Classes"
  ADD CONSTRAINT "Classes_schoolId_fkey"
  FOREIGN KEY ("schoolId") REFERENCES "School"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- 4: Drop and recreate FK Student.schoolId with CASCADE
ALTER TABLE "Student" DROP CONSTRAINT "Student_schoolId_fkey";
ALTER TABLE "Student"
  ADD CONSTRAINT "Student_schoolId_fkey"
  FOREIGN KEY ("schoolId") REFERENCES "School"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- (Student.classId -> SET NULL already in place from previous migration)

-- 5: Indexes
CREATE INDEX "Classes_schoolId_idx" ON "Classes"("schoolId");
CREATE INDEX "Student_schoolId_idx" ON "Student"("schoolId");
CREATE INDEX "Student_classId_idx" ON "Student"("classId");

-- 6: Unique (schoolId, name) on Classes
CREATE UNIQUE INDEX "Classes_schoolId_name_key" ON "Classes"("schoolId", "name");

-- 7: User.role nullable
ALTER TABLE "User" ALTER COLUMN "role" DROP NOT NULL;
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;

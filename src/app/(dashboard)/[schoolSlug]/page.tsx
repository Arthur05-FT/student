"use client";

import { useSchoolName } from "@/store/selectors/school.selectors";

const Schools = () => {
  const schoolName = useSchoolName();
  return (
    <div>
      <h1 className="scroll-m-20 text-center text-2xl font-extrabold tracking-tight text-balance">
        {schoolName}.
      </h1>
    </div>
  );
};

export default Schools;

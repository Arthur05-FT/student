"use client";

import { useCurrentSchool } from "@/lib/contexts/school-context";

const SchoolHomePage = () => {
  const school = useCurrentSchool();
  return (
    <div>
      <h1 className="scroll-m-20 text-center text-2xl font-extrabold tracking-tight text-balance">
        {school.name}.
      </h1>
    </div>
  );
};

export default SchoolHomePage;

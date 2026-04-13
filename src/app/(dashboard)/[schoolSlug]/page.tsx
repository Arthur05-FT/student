"use client";

import { useSchoolName } from "@/store/selectors/school.selectors";

const Schools = () => {
  const schoolName = useSchoolName();
  return <div>{schoolName}</div>;
};

export default Schools;

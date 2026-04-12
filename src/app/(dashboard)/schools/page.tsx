"use client";

import { useSession } from "@/lib/auth-client";

const Schools = () => {
  const session = useSession();
  console.log(session);
  return <div>Schools</div>;
};

export default Schools;

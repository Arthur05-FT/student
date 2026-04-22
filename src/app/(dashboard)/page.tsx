import { redirect } from "next/navigation";
import { usersApi } from "@/lib/api/users.api";
import { ApiError } from "@/lib/api/client";

const DashboardPage = async () => {
  let user;
  try {
    user = await usersApi.meServer();
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) redirect("/sign-in");
    throw err;
  }

  const firstSchool = user.schools[0]?.school;
  if (firstSchool) redirect(`/${firstSchool.slug}`);

  redirect("/create-school");
};

export default DashboardPage;

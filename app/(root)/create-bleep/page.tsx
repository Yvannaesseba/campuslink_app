import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation"
import PostBleep from "@/components/forms/PostBleep";

async function Page() {
  const user = await currentUser();

  if(!user) return null;

  const userInfo = await fetchUser(user.id);

  if(!userInfo?.onboarded) redirect('/onboarding');

  return(
    <>
    <h1 className="head-text">Create Bleep</h1>

    <PostBleep userId={userInfo._id} />
    </>
  );
}

export default Page;
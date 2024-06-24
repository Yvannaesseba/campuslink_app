import { currentUser } from "@clerk/nextjs"; // Importing currentUser function from Clerk's Next.js package to get the current authenticated user
import { redirect } from "next/navigation"; // Importing redirect function from Next.js for client-side navigation

import { fetchUser } from "@/lib/actions/user.actions"; // Importing fetchUser function to get additional user data
import AccountProfile from "@/components/forms/AccountProfile"; // Importing AccountProfile component for profile editing form

// Async function to render the Page component
async function Page() {
  // Fetch the current authenticated user
  const user = await currentUser();
  // If no user is authenticated, return null (nothing is rendered)
  if (!user) return null;

  // Fetch additional user information using the user's ID
  const userInfo = await fetchUser(user.id);
  // If the user has not completed onboarding, redirect to the onboarding page
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Prepare the user data for the AccountProfile component
  const userData = {
    id: user.id, // User ID
    objectId: userInfo?._id, // Object ID from the user info
    username: userInfo ? userInfo?.username : user.username, // Username from user info or current user's username
    name: userInfo ? userInfo?.name : user.firstName ?? "", // Name from user info or current user's first name
    bio: userInfo ? userInfo?.bio : "", // Bio from user info or empty string if not available
    image: userInfo ? userInfo?.image : user.imageUrl, // Image from user info or current user's image URL
  };

  // Return the JSX to render the profile editing page
  return (
    <>
      <h1 className='head-text'>Edit Profile</h1> {/* Heading for the page */}
      <p className='mt-3 text-base-regular text-dark-2'>Make any changes</p> {/* Instruction text */}

      <section className='mt-12'>
        <AccountProfile user={userData} btnTitle='Continue' /> {/* AccountProfile component with user data and button title */}
      </section>
    </>
  );
}

export default Page; // Exporting the Page component as the default export

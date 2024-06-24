import { currentUser } from "@clerk/nextjs"; // Importing currentUser function from Clerk's Next.js package to get the current authenticated user
import { redirect } from "next/navigation"; // Importing redirect function from Next.js for client-side navigation

import { fetchUser } from "@/lib/actions/user.actions"; // Importing fetchUser function to get additional user data from custom actions
import AccountProfile from "@/components/forms/AccountProfile"; // Importing AccountProfile component to display the user's profile form

// Async function to render the Page component
async function Page() {
  // Fetch the current authenticated user
  const user = await currentUser();
  // If no user is authenticated, return null (nothing is rendered)
  if (!user) return null;

  // Fetch additional user information using the user's ID
  const userInfo = await fetchUser(user.id);
  // If the user has already completed onboarding, redirect to the homepage
  if (userInfo?.onboarded) redirect("/");

  // Construct userData object with user and userInfo details
  const userData = {
    id: user.id, // User ID from Clerk
    objectId: userInfo?._id, // Object ID from additional user info (if available)
    username: userInfo ? userInfo?.username : user.username, // Username from userInfo or default to Clerk's username
    name: userInfo ? userInfo?.name : user.firstName ?? "", // Name from userInfo or default to Clerk's first name
    bio: userInfo ? userInfo?.bio : "", // Bio from userInfo or default to empty string
    image: userInfo ? userInfo?.image : user.imageUrl, // Image from userInfo or default to Clerk's imageUrl
  };

  // Return the JSX to render the onboarding page
  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1> {/* Title for the onboarding page */}
      <p className="mt-3 text-base-regular text-dark-2">
        Complete your profile now to use CampusLink
      </p> {/* Description for the onboarding process */}

      <section className="mt-9 bg-light-2 p-10">
        <AccountProfile 
          user={userData} // Pass userData to the AccountProfile component
          btnTitle='Continue' // Button title for the AccountProfile component
        />
      </section>
    </main>
  );
}

export default Page; // Exporting the Page component as the default export

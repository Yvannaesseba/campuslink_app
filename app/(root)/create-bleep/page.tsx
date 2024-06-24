import { fetchUser } from "@/lib/actions/user.actions"; // Importing fetchUser function to get additional user data
import { currentUser } from "@clerk/nextjs"; // Importing currentUser function from Clerk's Next.js package to get the current authenticated user
import { redirect } from "next/navigation"; // Importing redirect function from Next.js for client-side navigation
import PostBleep from "@/components/forms/PostBleep"; // Importing PostBleep component to create a new bleep
import { Button } from "@/components/ui/button"; // Importing Button component (not used in this code snippet)
import { Image } from "lucide-react"; // Importing Image component from Lucide React icons library (not used in this code snippet)

// Async function to render the Page component
async function Page() {
  // Fetch the current authenticated user
  const user = await currentUser();
  // If no user is authenticated, return null (nothing is rendered)
  if (!user) return null;

  // Fetch additional user information using the user's ID
  const userInfo = await fetchUser(user.id);
  // If the user has not completed onboarding, redirect to the onboarding page
  if (!userInfo?.onboarded) redirect('/onboarding');

  // Return the JSX to render the create bleep page
  return (
    <div className="bg-dark-2 border-dark-4 p-2 rounded-md"> {/* Container with styling */}
      <h1 className="head-text">Create Bleep</h1> {/* Heading for the page */}
      <PostBleep userId={userInfo._id} /> {/* PostBleep component with user ID passed as prop */}
    </div>
  );
}

export default Page; // Exporting the Page component as the default export

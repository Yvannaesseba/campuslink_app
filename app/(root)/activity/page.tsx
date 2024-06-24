import { fetchUser, getActivity } from "@/lib/actions/user.actions"; // Importing fetchUser and getActivity functions from custom actions
import { currentUser } from "@clerk/nextjs"; // Importing currentUser function from Clerk's Next.js package to get the current authenticated user
import Image from "next/image"; // Importing Image component from Next.js for optimized image handling
import Link from "next/link"; // Importing Link component from Next.js for client-side navigation
import { redirect } from "next/navigation"; // Importing redirect function from Next.js for client-side navigation

// Async function to render the Page component
async function Page(): Promise<JSX.Element | null> {
  // Fetch the current authenticated user
  const user = await currentUser();
  // If no user is authenticated, return null (nothing is rendered)
  if (!user) return null;

  // Fetch additional user information using the user's ID
  const userInfo = await fetchUser(user.id);
  // If the user has not completed onboarding, redirect to the onboarding page
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Get user's recent activity
  const activity = await getActivity(userInfo._id);

  // Return the JSX to render the user's recent activity
  return (
    <section>
      <h1 className="head-text mb-10">Your Recent Activity</h1> {/* Title for the recent activity section */}

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/bleep/${activity.parentId}`}>
                <article className="activity-card flex items-center gap-4 p-4 rounded-md bg-white shadow-md">
                  <Image
                    src={activity.author.image}
                    alt="Profile Picture"
                    width={40}
                    height={40}
                    className="rounded-full"
                  /> {/* Displaying the author's profile picture */}
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {activity.author.name}
                    </p> {/* Displaying the author's name */}
                    <p className="text-sm text-gray-600">
                      Replied to your bleep
                    </p> {/* Displaying a description of the activity */}
                  </div>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/empty-activity.svg"
              alt="Empty Activity"
              width={200}
              height={200}
              className="object-contain"
            /> {/* Displaying an image when there is no activity */}
            <p className="text-lg text-gray-600">
              It's quiet here... Why not start a conversation?
            </p> {/* Message to encourage starting a conversation when there is no activity */}
          </div>
        )}
      </section>
    </section>
  );
}

export default Page; // Exporting the Page component as the default export

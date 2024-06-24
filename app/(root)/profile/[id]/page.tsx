import Image from "next/image"; // Importing Image component from Next.js for optimized image handling
import { currentUser } from "@clerk/nextjs"; // Importing currentUser function from Clerk's Next.js package to get the current authenticated user
import { redirect } from "next/navigation"; // Importing redirect function from Next.js for client-side navigation

import { profileTabs } from "@/constants"; // Importing profileTabs constant for tab configuration
import BleepsTab from "@/components/shared/BleepsTab"; // Importing BleepsTab component to display user's bleeps
import ProfileHeader from "@/components/shared/ProfileHeader"; // Importing ProfileHeader component for the profile header section
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Importing Tabs components from the UI library

import { fetchUser } from "@/lib/actions/user.actions"; // Importing fetchUser function to get additional user data

// Async function to render the Page component
async function Page({ params }: { params: { id: string } }) {
  // Fetch the current authenticated user
  const user = await currentUser();
  // If no user is authenticated, return null (nothing is rendered)
  if (!user) return null;

  // Fetch additional user information using the user ID from the URL parameters
  const userInfo = await fetchUser(params.id);
  // If the user has not completed onboarding, redirect to the onboarding page
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Return the JSX to render the profile page
  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id} // User ID of the profile being viewed
        authUserId={user.id} // Authenticated user's ID
        name={userInfo.name} // User's name
        username={userInfo.username} // User's username
        imgUrl={userInfo.image} // User's profile image URL
        bio={userInfo.bio} // User's bio
      />

      <div className='mt-9'>
        <Tabs defaultValue='bleeps' className='w-full'> {/* Tabs component for switching between different profile sections */}
          <TabsList className='tab'>
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className='tab'> {/* Trigger for each tab */}
                <Image
                  src={tab.icon} // Icon for the tab
                  alt={tab.label} // Alt text for the icon
                  width={24} // Icon width
                  height={24} // Icon height
                  className='object-contain' // Icon styling
                />
                <p className='max-sm:hidden'>{tab.label}</p> {/* Label for the tab, hidden on small screens */}

                {tab.label === "Bleeps" && (
                  <p className='ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {userInfo.bleeps.length} {/* Number of bleeps displayed if the tab is "Bleeps" */}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className='w-full text-light-1'
            >
              {/* @ts-ignore */}
              <BleepsTab
                currentUserId={user.id} // Authenticated user's ID
                accountId={userInfo.id} // User ID of the profile being viewed
                accountType='User' // Type of account (User)
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

export default Page; // Exporting the Page component as the default export

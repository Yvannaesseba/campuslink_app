import { currentUser } from "@clerk/nextjs"; // Importing currentUser function from Clerk's Next.js package to get the current authenticated user
import Image from "next/image"; // Importing Image component from Next.js for optimized image handling

import { communityTabs } from "@/constants"; // Importing communityTabs constant for tab navigation
import { fetchCommunityDetails } from "@/lib/actions/community.actions"; // Importing fetchCommunityDetails function to get community details

import UserCard from "@/components/cards/UserCard"; // Importing UserCard component to display individual user cards
import BleepsTab from "@/components/shared/BleepsTab"; // Importing BleepsTab component to display bleeps
import ProfileHeader from "@/components/shared/ProfileHeader"; // Importing ProfileHeader component to display profile header
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Importing Tabs components for tabbed navigation

// Async function to render the Page component
async function Page({ params }: { params: { id: string } }) {
  // Fetch the current authenticated user
  const user = await currentUser();
  // If no user is authenticated, return null (nothing is rendered)
  if (!user) return null;

  // Fetch the community details using the provided ID
  const communityDetails = await fetchCommunityDetails(params.id);

  // Return the JSX to render the community profile page
  return (
    <section>
      <ProfileHeader
        accountId={communityDetails.id} // Community ID
        authUserId={user.id} // Authenticated user's ID
        name={communityDetails.name} // Community name
        username={communityDetails.username} // Community username
        imgUrl={communityDetails.image} // Community image URL
        bio={communityDetails.bio} // Community bio
        type="Community" // Type of profile (Community)
      />
      <div className="mt-9">
        <Tabs defaultValue="bleeps" className="w-full">
          <TabsList className="tab">
            {communityTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <div className="flex items-center">
                  <Image
                    src={tab.icon} // Tab icon
                    alt={tab.label} // Alt text for the tab icon
                    width={24} // Icon width
                    height={24} // Icon height
                    className="object-contain"
                  />
                  <p className="max-sm:hidden ml-2">{tab.label}</p> {/* Tab label */}
                  {tab.label === "Bleeps" && (
                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                      {communityDetails?.bleeps?.length} {/* Number of bleeps */}
                    </p>
                  )}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="bleeps" className="w-full text-light-1">
            <BleepsTab
              currentUserId={user.id} // Current user's ID
              accountId={communityDetails._id} // Community ID
              accountType="Community" // Type of account (Community)
            />
          </TabsContent>

          <TabsContent value="members" className="w-full text-light-1">
            <section className="mt-9 flex flex-col gap-10">
              <h2 className="text-2xl font-bold mb-4">
                Meet the Members of {communityDetails.name}: {/* Heading */}
              </h2>
              {communityDetails?.members.map((member: any) => (
                <UserCard
                  key={member.id} // Unique key for the member
                  id={member.id} // Member ID
                  name={member.name} // Member name
                  username={member.username} // Member username
                  imgUrl={member.image} // Member image URL
                  personType="User" // Type of person (User)
                />
              ))}
            </section>
          </TabsContent>

          <TabsContent value="requests" className="w-full text-light-1">
            <div className="mt-9 flex flex-col items-center">
              <Image
                src="/join-community.png" // Image for joining the community
                alt="Join Community" // Alt text for the image
                width={300} // Image width
                height={200} // Image height
                className="object-contain"
              />
              <p className="mt-4 text-lg text-gray-600">
                Ready to join {communityDetails.name}? Start engaging with the
                community today! {/* Message to encourage joining the community */}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default Page; // Exporting the Page component as the default export

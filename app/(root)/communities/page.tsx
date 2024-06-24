import { currentUser } from "@clerk/nextjs"; // Importing currentUser function from Clerk's Next.js package to get the current authenticated user
import { redirect } from "next/navigation"; // Importing redirect function from Next.js for client-side navigation
import Image from "next/image"; // Importing Image component from Next.js for optimized image handling

import Searchbar from "@/components/shared/SearchBar"; // Importing Searchbar component for search functionality
import Pagination from "@/components/shared/Pagination"; // Importing Pagination component for pagination functionality
import CommunityCard from "@/components/cards/CommunityCard"; // Importing CommunityCard component to display individual community cards

import { fetchUser } from "@/lib/actions/user.actions"; // Importing fetchUser function to get additional user data
import { fetchCommunities } from "@/lib/actions/community.actions"; // Importing fetchCommunities function to get communities data

// Async function to render the Page component
async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  // Fetch the current authenticated user
  const user = await currentUser();
  // If no user is authenticated, return null (nothing is rendered)
  if (!user) return null;

  // Fetch additional user information using the user's ID
  const userInfo = await fetchUser(user.id);
  // If the user has not completed onboarding, redirect to the onboarding page
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Fetch communities based on search parameters
  const result = await fetchCommunities({
    searchString: searchParams.q, // Search query from URL parameters
    pageNumber: searchParams?.page ? +searchParams.page : 1, // Page number from URL parameters
    pageSize: 25, // Number of communities to fetch per page
  });

  // Return the JSX to render the communities page
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="head-text">Discover Communities</h1> {/* Page title */}
        <Image
          src="/explore.png" // Image source for the explore communities banner
          alt="Explore Communities" // Alt text for the image
          width={200} // Image width
          height={200} // Image height
          className="object-contain" // Image styling
        />
      </div>

      <div className="mt-5">
        <Searchbar routeType="communities" /> {/* Search bar for communities */}
      </div>

      <section className="mt-9 flex flex-wrap gap-4">
        {result.communities.length === 0 ? ( // Check if there are no communities found
          <p className="no-result">No communities found</p> // Display message if no communities are found
        ) : (
          <>
            {result.communities.map((community) => ( // Map over the communities and render CommunityCard for each
              <CommunityCard
                key={community.id} // Unique key for each community
                id={community.id} // Community ID
                name={community.name} // Community name
                username={community.username} // Community username
                imgUrl={community.image} // Community image URL
                bio={community.bio} // Community bio
                members={community.members} // Community members
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path="communities" // Path for pagination links
        pageNumber={searchParams?.page ? +searchParams.page : 1} // Current page number
        isNext={result.isNext} // Boolean to indicate if there is a next page
      />
    </>
  );
}

export default Page; // Exporting the Page component as the default export

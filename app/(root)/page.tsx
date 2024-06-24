import { currentUser } from "@clerk/nextjs"; // Importing currentUser function from Clerk for authentication
import { redirect } from "next/navigation"; // Importing redirect function from Next.js for navigation
import Image from "next/image"; // Importing Image component from Next.js for optimized image loading

import BleepCard from "@/components/cards/BleepCard"; // Importing BleepCard component
import Searchbar from "@/components/shared/SearchBar"; // Importing SearchBar component
import Pagination from "@/components/shared/Pagination"; // Importing Pagination component

import { fetchPosts } from "@/lib/actions/bleep.actions"; // Importing fetchPosts function from bleep actions
import { fetchUser } from "@/lib/actions/user.actions"; // Importing fetchUser function from user actions

async function Home({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const user = await currentUser(); // Fetching current authenticated user
  if (!user) return null; // If user is not logged in, return null

  const userInfo = await fetchUser(user.id); // Fetching user information using user ID
  if (!userInfo?.onboarded) redirect("/onboarding"); // Redirecting to onboarding page if user is not onboarded

  // Log the search parameters to debug
  console.log("Search Parameters:", searchParams);

  const result = await fetchPosts({
    searchString: searchParams.q, // Setting search string based on 'q' parameter in searchParams
    pageNumber: searchParams?.page ? +searchParams.page : 1, // Setting page number for pagination
    pageSize: 30, // Setting page size for pagination
  });

  // Log the result to debug
  console.log("Fetched Posts Result:", result);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="head-text text-left">Welcome to CampusLink!</h1>
      </div>

      <p className="text-lg mt-4 mb-8 text-light-2">
        Connect with your university community like never before. Share your thoughts, engage in discussions, and stay updated with the latest campus news.
      </p>

      <div className="mt-5">
        <Searchbar routeType="/" /> {/* Render SearchBar component */}
      </div>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? ( // Conditionally render message if no posts found
          <p className="no-result">No bleeps found</p>
        ) : (
          <>
            {result.posts.map((post) => ( // Mapping through fetched posts to render BleepCard components
              <BleepCard
                key={post._id}
                id={post._id}
                currentUserId={user.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>

      <Pagination
        path="/" // Setting path for pagination
        pageNumber={searchParams?.page ? +searchParams.page : 1} // Setting current page number
        isNext={result.isNext} // Setting boolean flag for next page existence
      />
    </>
  );
}

export default Home; // Exporting Home component as default

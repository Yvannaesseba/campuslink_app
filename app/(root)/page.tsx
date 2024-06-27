import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";

import BleepCard from "@/components/cards/BleepCard";
import Searchbar from "@/components/shared/SearchBar"; // Import SearchBar
import Pagination from "@/components/shared/Pagination";

import { fetchPosts } from "@/lib/actions/bleep.actions";
import { fetchUser } from "@/lib/actions/user.actions";

async function Home({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Log the search parameters to debug
  console.log("Search Parameters:", searchParams);

  const result = await fetchPosts({
    searchString: searchParams.q, // Ensure this is the correct parameter
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 30,
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
        <Searchbar routeType="/" />
      </div>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No bleeps found</p>
        ) : (
          <>
            {result.posts.map((post) => (
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
        path="/"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  );
}

export default Home;
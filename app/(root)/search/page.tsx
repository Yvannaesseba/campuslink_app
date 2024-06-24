import { redirect } from "next/navigation"; // Importing redirect function from Next.js for client-side navigation
import { currentUser } from "@clerk/nextjs"; // Importing currentUser function from Clerk's Next.js package to get the current authenticated user

import UserCard from "@/components/cards/UserCard"; // Importing UserCard component to display user information
import Searchbar from "@/components/shared/SearchBar"; // Importing Searchbar component for searching users
import Pagination from "@/components/shared/Pagination"; // Importing Pagination component for paginating user search results

import { fetchUser, fetchUsers } from "@/lib/actions/user.actions"; // Importing fetchUser and fetchUsers functions to get user data

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

  // Fetch users based on search parameters, current user ID, and pagination details
  const result = await fetchUsers({
    userId: user.id,
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  });

  // Return the JSX to render the user search page
  return (
    <section>
      <h1 className='head-text mb-10'>Search</h1> {/* Heading for the page */}

      <Searchbar routeType='search' /> {/* Searchbar component */}

      <div className='mt-14 flex flex-col gap-9'>
        {result.users.length === 0 ? (
          <p className='no-result'>No Result</p> 
        ) : (
          <>
            {result.users.map((person) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType='User'
              />
            ))}
          </>
        )}
      </div>

      <Pagination
        path='search'
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      /> {/* Pagination component */}
    </section>
  );
}

export default Page; // Exporting the Page component as the default export

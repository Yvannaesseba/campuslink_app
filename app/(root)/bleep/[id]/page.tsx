import BleepCard from "@/components/cards/BleepCard"; // Importing BleepCard component to display individual bleeps
import { fetchBleepById } from "@/lib/actions/bleep.actions"; // Importing fetchBleepById function to fetch a bleep by its ID
import { fetchUser } from "@/lib/actions/user.actions"; // Importing fetchUser function to get additional user data
import { currentUser } from "@clerk/nextjs"; // Importing currentUser function from Clerk's Next.js package to get the current authenticated user
import { redirect } from "next/navigation"; // Importing redirect function from Next.js for client-side navigation
import Comment from "@/components/forms/Comment"; // Importing Comment component to display and handle comments

// Async function to render the Page component
const Page = async ({ params } : {params: { id: string}}) => {
  // If no ID is provided in the params, return null (nothing is rendered)
  if(!params.id) return null;

  // Fetch the current authenticated user
  const user = await currentUser();
  // If no user is authenticated, return null (nothing is rendered)
  if(!user) return null;

  // Fetch additional user information using the user's ID
  const userInfo = await fetchUser(user.id);
  // If the user has not completed onboarding, redirect to the onboarding page
  if(!userInfo?.onboarded) redirect('/onboarding');
  
  // Fetch the bleep using the provided ID
  const bleep = await fetchBleepById(params.id);
    
  // Return the JSX to render the bleep and its comments
  return (
    <section className="relative">
      <div>
        <BleepCard  
          key={bleep._id} // Unique key for the bleep
          id={bleep._id} // Bleep ID
          currentUserId={user?.id || ""} // Current user's ID
          parentId={bleep.parentId} // Parent bleep ID
          content={bleep.text} // Bleep content
          author={bleep.author} // Author of the bleep
          community={bleep.community} // Community associated with the bleep
          createdAt={bleep.createdAt} // Creation date of the bleep
          comments={bleep.children} // Comments on the bleep
        />
      </div>

      <div className="mt-7">
        <Comment 
          bleepId={bleep.id} // Bleep ID for the comment
          currentUserImg={userInfo.image} // Current user's image
          currentUserId={JSON.stringify(userInfo._id)} // Current user's ID as a string
        />
      </div>
      
      <div className="mt-10">
        {bleep.children.map((childItem: any) => (
          <BleepCard  
            key={childItem._id} // Unique key for the comment
            id={childItem._id} // Comment ID
            currentUserId={childItem?.id || ""} // Current user's ID
            parentId={childItem.parentId} // Parent bleep ID
            content={childItem.text} // Comment content
            author={childItem.author} // Author of the comment
            community={childItem.community} // Community associated with the comment
            createdAt={childItem.createdAt} // Creation date of the comment
            comments={childItem.children} // Nested comments
            isComment // Indicate that this is a comment
          />
        ))}
      </div>
    </section>
  );
}

export default Page; // Exporting the Page component as the default export

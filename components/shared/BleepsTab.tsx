import { fetchUserPosts } from "@/lib/actions/user.actions"; // Importing fetchUserPosts action from user actions
import { redirect } from "next/navigation"; // Importing redirect function from Next.js navigation utilities
import BleepCard from "../cards/BleepCard"; // Importing BleepCard component
import { fetchCommunityPosts } from "@/lib/actions/community.actions"; // Importing fetchCommunityPosts action from community actions

interface Props {
  currentUserId: string; // Current user's ID
  accountId: string; // Account ID (user or community ID)
  accountType: string; // Type of account ('User' or 'Community')
}

const BleepsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  let result: any;

  // Fetch posts based on account type (User or Community)
  if (accountType === 'Community') {
    result = await fetchCommunityPosts(accountId); // Fetch community posts
  } else {
    result = await fetchUserPosts(accountId); // Fetch user posts
  }

  // If result is falsy, redirect to '/'
  if (!result) redirect('/');

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.bleeps.map((bleep: any) => ( // Mapping over bleeps in result
        <BleepCard
          key={bleep._id} // Setting key for each BleepCard instance
          id={bleep._id} // Bleep ID
          currentUserId={currentUserId} // Current user's ID passed down
          parentId={bleep.parentId} // Parent ID of the bleep (if exists)
          content={bleep.text} // Bleep content
          file={bleep?.file} // Optional file associated with the bleep
          author={ // Determining author based on account type
            accountType === 'User' ? // If accountType is 'User'
              { name: result.name, image: result.image, id: result.id } : // Use result's user info
              { name: bleep.author.name, image: bleep.author.image, id: bleep.author.id } // Otherwise, use bleep's author info
          }
          community={bleep.community} // Passing community information associated with the bleep
          createdAt={bleep.createdAt} // Bleep creation timestamp
          comments={bleep.children} // Comments associated with the bleep
        />
      ))}
    </section>
  );
}

export default BleepsTab; // Exporting BleepsTab component as default

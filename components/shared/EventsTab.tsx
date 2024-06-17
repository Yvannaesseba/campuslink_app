import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import EventCard from "../cards/EventCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const BleepsTab = async ({currentUserId, accountId, accountType} : Props) => {
  let result: any;

  if(accountType === 'Community') {
    result =await fetchCommunityPosts(accountId);
  } else (
    result = await fetchUserPosts(accountId)
  )


  if(!result) redirect('/')

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.bleeps.map((bleep: any) => (
        <EventCard  
        key={bleep._id}
        id={bleep._id}
        currentUserId={currentUserId}
        parentId={bleep.parentId}
        content={bleep.text}
        author={accountType === 'User'
        ? {name: result.name, image: result.image, id: result.id}:
          {name: bleep.author.name, image: bleep.author.image, id: bleep.author.id}
        }
        community={bleep.community} //todo
        createdAt={bleep.createdAt}
        comments={bleep.children}
        />
      ))}
    </section>
  )
}

export default BleepsTab;
import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import BleepCard from "../cards/BleepCard";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const BleepsTab = async ({currentUserId, accountId, accountType} : Props) => {
  let result = await fetchUserPosts(accountId);

  if(!result) redirect('/')

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.bleeps.map((bleep: any) => (
        <BleepCard  
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
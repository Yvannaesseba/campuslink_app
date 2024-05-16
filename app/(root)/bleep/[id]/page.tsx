import BleepCard from "@/components/cards/BleepCard";
import { fetchBleepById } from "@/lib/actions/bleep.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Comment from "@/components/forms/Comment";



const Page = async ({ params } : {params: { id: string}}) => {
  if(!params.id) return null;

  const user = await currentUser();
  if(!user) return null;

  const userInfo = await fetchUser(user.id)
  if(!userInfo?.onboarded) redirect('/onboarding')
  
    const bleep = await fetchBleepById(params.id);
    
  return (
    <section className="relative">
    <div>
    <BleepCard  
          key={bleep._id}
          id={bleep._id}
          currentUserId={user?.id || ""}
          parentId={bleep.parentId}
          content={bleep.text}
          author={bleep.author}
          community={bleep.community}
          createdAt={bleep.createdAt}
          comments={bleep.children}
          />
    </div>

    <div className="mt-7">
      <Comment 
      bleepId={bleep.id}
      currentUserImg={userInfo.image}
      currentUserId={JSON.stringify(userInfo._id)}
      />
    </div>
    <div className="mt-10">
      {bleep.children.map((childItem: any) => (
        <BleepCard  
          key={childItem._id}
          id={childItem._id}
          currentUserId={childItem?.id || ""}
          parentId={childItem.parentId}
          content={childItem.text}
          author={childItem.author}
          community={childItem.community}
          createdAt={childItem.createdAt}
          comments={childItem.children}
          isComment
          />
      ))}
    </div>
  </section>
  )

}

export default Page;
import EventCard from "@/components/cards/BleepCard";
import { fetchEventById } from "@/lib/actions/bleep.actions";
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
  
    const event = await fetchEventById(params.id);
    
  return (
    <section className="relative">
    <div>
    <EventCard  
          key={event._id}
          id={event._id}
          currentUserId={user?.id || ""}
          parentId={event.parentId}
          content={event.text}
          author={event.author}
          community={event.community}
          createdAt={event.createdAt}
          comments={event.children}
          />
    </div>

    <div className="mt-7">
      <Comment 
      bleepId={event.id}
      currentUserImg={userInfo.image}
      currentUserId={JSON.stringify(userInfo._id)}
      />
    </div>
    <div className="mt-10">
      {event.children.map((childItem: any) => (
        <Card  
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
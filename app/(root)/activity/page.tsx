import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

async function Page(): Promise<JSX.Element | null> {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Get user's activity
  const activity = await getActivity(userInfo._id);

  return (
    <section>
      <h1 className="head-text mb-10">Your Recent Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/bleep/${activity.parentId}`}>
                <article className="activity-card flex items-center gap-4 p-4 rounded-md bg-white shadow-md">
                  <Image
                    src={activity.author.image}
                    alt="Profile Picture"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {activity.author.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Replied to your bleep
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/empty-activity.svg"
              alt="Empty Activity"
              width={200}
              height={200}
              className="object-contain"
            />
            <p className="text-lg text-gray-600">
              It's quiet here... Why not start a conversation?
            </p>
          </div>
        )}
      </section>
    </section>
  );
}

export default Page;

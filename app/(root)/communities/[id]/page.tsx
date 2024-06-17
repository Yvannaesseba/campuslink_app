import { currentUser } from "@clerk/nextjs";
import Image from "next/image";

import { communityTabs } from "@/constants";
import { fetchCommunityDetails } from "@/lib/actions/community.actions";

import UserCard from "@/components/cards/UserCard";
import BleepsTab from "@/components/shared/BleepsTab";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const communityDetails = await fetchCommunityDetails(params.id);

  return (
    <section>
      <ProfileHeader
        accountId={communityDetails.id}
        authUserId={user.id}
        name={communityDetails.name}
        username={communityDetails.username}
        imgUrl={communityDetails.image}
        bio={communityDetails.bio}
        type="Community"
      />
      <div className="mt-9">
        <Tabs defaultValue="bleeps" className="w-full">
          <TabsList className="tab">
            {communityTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <div className="flex items-center">
                  <Image
                    src={tab.icon}
                    alt={tab.label}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                  <p className="max-sm:hidden ml-2">{tab.label}</p>
                  {tab.label === "Bleeps" && (
                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                      {communityDetails?.bleeps?.length}
                    </p>
                  )}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="bleeps" className="w-full text-light-1">
            <BleepsTab
              currentUserId={user.id}
              accountId={communityDetails._id}
              accountType="Community"
            />
          </TabsContent>

          <TabsContent value="members" className="w-full text-light-1">
            <section className="mt-9 flex flex-col gap-10">
              <h2 className="text-2xl font-bold mb-4">
                Meet the Members of {communityDetails.name}:
              </h2>
              {communityDetails?.members.map((member: any) => (
                <UserCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  username={member.username}
                  imgUrl={member.image}
                  personType="User"
                />
              ))}
            </section>
          </TabsContent>

          <TabsContent value="requests" className="w-full text-light-1">
            <div className="mt-9 flex flex-col items-center">
              <Image
                src="/join-community.png"
                alt="Join Community"
                width={300}
                height={200}
                className="object-contain"
              />
              <p className="mt-4 text-lg text-gray-600">
                Ready to join {communityDetails.name}? Start engaging with the
                community today!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

export default Page;

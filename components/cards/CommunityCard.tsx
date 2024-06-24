import Image from "next/image"; // Importing Image component from Next.js for optimized image rendering
import Link from "next/link"; // Importing Link component from Next.js for client-side navigation

import { Button } from "../ui/button"; // Importing Button component

interface Props {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
  members: {
    image: string;
  }[];
}

function CommunityCard({ id, name, username, imgUrl, bio, members }: Props) {
  return (
    <article className='community-card'> {/* Container for the community card */}
      <div className='flex flex-wrap items-center gap-3'> {/* Top section: community logo, name, and username */}
        {/* Link to the community page */}
        <Link href={`/communities/${id}`} className='relative h-12 w-12'>
          {/* Community logo displayed as a circular image */}
          <Image
            src={imgUrl}
            alt='community_logo'
            fill
            className='rounded-full object-cover'
          />
        </Link>

        <div>
          {/* Link to the community page */}
          <Link href={`/communities/${id}`}>
            {/* Community name */}
            <h4 className='text-base-semibold text-light-1'>{name}</h4>
          </Link>
          {/* Community username */}
          <p className='text-small-medium text-gray-1'>@{username}</p>
        </div>
      </div>

      {/* Community bio */}
      <p className='mt-4 text-subtle-medium text-gray-1'>{bio}</p>

      <div className='mt-5 flex flex-wrap items-center justify-between gap-3'> {/* Bottom section: View button and members */}
        <Link href={`/communities/${id}`}>
          {/* Button to view the community */}
          <Button size='sm' className='community-card_btn'>
            View
          </Button>
        </Link>

        {/* Displaying members' avatars */}
        {members.length > 0 && (
          <div className='flex items-center'>
            {members.map((member, index) => (
              <Image
                key={index}
                src={member.image}
                alt={`user_${index}`}
                width={28}
                height={28}
                className={`${index !== 0 && "-ml-2"} rounded-full object-cover`}
              />
            ))}
            {/* Displaying additional users count if more than 3 */}
            {members.length > 3 && (
              <p className='ml-1 text-subtle-medium text-gray-1'>
                {members.length}+ Users
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default CommunityCard; // Exporting CommunityCard component as default

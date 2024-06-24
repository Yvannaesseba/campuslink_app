import Image from "next/image"; // Importing Image component from Next.js for optimized image rendering
import { Button } from "../ui/button"; // Importing Button component
import { useRouter } from "next/navigation"; // Importing useRouter hook from Next.js for client-side navigation

interface Props {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  personType: string;
}

const UserCard = ({ id, name, username, imgUrl, personType }: Props) => {
  const router = useRouter(); // Initializing useRouter hook for client-side navigation

  return (
    <article className="user-card"> {/* Container for the user card */}
      <div className="user-card_avatar"> {/* Section containing user avatar and details */}
        {/* User avatar displayed as a rounded image */}
        <Image 
          src={imgUrl}
          alt="logo"
          width={48}
          height={48}
          className="rounded-full"
        />

        <div className="flex-1 text-ellipsis"> {/* Section for user name and username */}
          {/* User name */}
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          {/* User username */}
          <p className="text-small-medium text-gray-1">{username}</p>
        </div>
      </div>

      {/* Button to view user profile */}
      <Button className="user-card_btn" onClick={() => router.push(`/profile/${id}`)}>
        View
      </Button>
    </article>
  );
}

export default UserCard; // Exporting UserCard component as default

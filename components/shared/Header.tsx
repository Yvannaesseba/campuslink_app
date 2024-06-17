import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <link href="/events" className="w-36">
          <Image
          src="/assets/images/logo.svg" width={128} height={38}
          alt="Evently logo"
          />
        </link>
      </div>
    </header>
  )
}
export default Header
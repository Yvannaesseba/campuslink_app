import { ClerkProvider } from "@clerk/nextjs"; // Importing ClerkProvider to wrap the application with Clerk for authentication
import { Inter } from "next/font/google"; // Importing the Inter font from Google Fonts using Next.js
import '../globals.css'; // Importing global CSS styles

// Metadata for the application
export const metadata = {
  title: 'CampusLink', // Title of the web application
  description: 'A Social Media platform for the ICT-University' // Description of the web application
};

// Loading the Inter font with the latin subset
const inter = Inter({ subsets: ["latin"] });

// RootLayout component that wraps the entire application
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Wrapping the application with ClerkProvider for authentication support
    <ClerkProvider>
      <html lang="en"> {/* Setting the language of the document to English */}
        <body className={`${inter.className} bg-light-1`}> {/* Applying the Inter font and background color */}
          <div className="w-full flex justify-center items-center min-h-screen">
            {children} {/* Rendering the child components */}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}

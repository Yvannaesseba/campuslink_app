import React from "react"; // Importing React library for JSX syntax
import type { Metadata } from "next"; // Importing Metadata type from Next.js for defining page metadata
import { Inter } from "next/font/google"; // Importing Inter font from Google Fonts for typography
import "../globals.css"; // Importing global styles

import { ClerkProvider } from "@clerk/nextjs"; // Importing ClerkProvider from Clerk's Next.js package for authentication

import Topbar from "@/components/shared/Topbar"; // Importing Topbar component
import LeftSidebar from "@/components/shared/LeftSidebar"; // Importing LeftSidebar component
import RightSidebar from "@/components/shared/RightSidebar"; // Importing RightSidebar component
import Bottombar from "@/components/shared/Bottombar"; // Importing Bottombar component

const inter = Inter({ subsets: ["latin"] }); // Initializing Inter font with Latin subset

export const metadata: Metadata = {
  title: "CampusLink", // Page title for metadata
  description: "CampusLink-ICTU", // Page description for metadata
};

// Functional component RootLayout to define the layout structure
export default function RootLayout({
  children, // Props for children components
}: {
  children: React.ReactNode; // Children components passed as React nodes
}) {
  return (
    <ClerkProvider> {/* ClerkProvider wraps the entire application for authentication */}
      <html lang="en"> {/* Setting the language attribute for the HTML */}
        <body className={inter.className}> {/* Setting the font class for the body */}
          <Topbar /> {/* Render the top navigation bar component */}

          <main className="flex flex-row"> {/* Main content area with flex row layout */}
            <LeftSidebar /> {/* Render the left sidebar component */}

            <section className="main-container"> {/* Main content section */}
              <div className="w-full max-w-4xl">
                {children} {/* Render children components passed to RootLayout */}
              </div>
            </section>

            <RightSidebar /> {/* Render the right sidebar component */}
          </main>

          <Bottombar /> {/* Render the bottom navigation bar component */}
        </body>
      </html>
    </ClerkProvider>
  );
}

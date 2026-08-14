# CampusLink

**A university-focused social networking platform for communication and community engagement**

*Individual BSc Software Engineering Final Project | The ICT University | 2024*

## Overview

CampusLink is a university-focused social networking web application developed as my final-year BSc Software Engineering project.

The project explored how a dedicated platform could support communication and community interaction within a university environment. Users can create profiles, share and interact with posts, find other users, and participate in interest-based communities.

The project covered the software development process from requirements gathering and system design through to implementation and testing.

---

## The Problem

General social media platforms support communication, but they are not designed specifically around the structure and needs of a university community.

CampusLink was designed as a dedicated environment where university members could connect, share information and participate in communities within a campus-focused platform.

---

## Key Features

The application includes:

- User registration and authentication
- User profiles and profile editing
- Home/news feed
- Creating and viewing posts
- Commenting on posts
- User search
- Community search
- Community creation and management
- Joining communities
- Adding community members
- Viewing posts within individual communities

---

## Requirements and System Design

Before implementation, I carried out requirements analysis to understand the communication needs of potential university users.

The project included:

- Functional and non-functional requirements
- Use cases
- Class diagrams
- Sequence diagrams
- System design specifications
- Implementation and testing

This process helped translate the initial problem into defined system requirements before development.

---

## Technologies

- **Next.js** — application framework
- **React** — user interface
- **MongoDB** — data storage
- **Clerk** — authentication and user management

---

## Project Structure

```text
campuslink_app/
├── app/              # Application pages and routes
├── components/       # Reusable interface components
├── constants/        # Application constants
├── hooks/            # Custom hooks
├── lib/              # Shared application logic
├── public/           # Static assets
├── middleware.ts
├── package.json
└── README.md
```

---

## What I Learned

CampusLink gave me experience of developing a larger application from requirements through to implementation.

The project strengthened my understanding of:

- translating user needs into system requirements;
- designing a system before implementation;
- building reusable web components;
- integrating authentication and data storage;
- structuring a full-stack web application;
- testing and documenting a software project.

---

## Limitations and Improvements

CampusLink was developed as an undergraduate final-year project rather than a production social networking platform.

If I revisited the project, I would focus on:

- expanding automated testing;
- strengthening input validation and error handling;
- reviewing accessibility and responsive design;
- improving technical documentation;
- reviewing dependencies and deployment configuration.

---

## Running Locally

Clone the repository:

```bash
git clone https://github.com/Yvannaesseba/campuslink_app.git
cd campuslink_app
```

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will normally be available at `localhost:3000`.

Some functionality requires the appropriate environment variables for services such as authentication and database access.

---

## Author

**Emmanuelle Yvanna Esseba Ayangma**  
BSc Software Engineering — The ICT University
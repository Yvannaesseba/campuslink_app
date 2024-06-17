"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Event from "../models/event.model";
import Community from "../models/community.model";

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts that have no parent (top-level bleeps) (a bleep that is not a comment/reply).
  const postsQuery = Event.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    });

  // Count the total number of top-level posts (bleeps) i.e., bleeps that are not comments.
  const totalPostsCount = await Event.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

interface Params {
  text: string,
  author: string,
  venue: string,
  description: string,
  date: Date,
  image: string,
  communityId: string | null,
  path: string,
}

export async function createEvent({ text, author,venue,description,date, communityId, path }: Params
) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdEvent = await Event.create({
      text,
      author,
      venue,
      description,
      date,
      image,
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { events: createdEvent._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { events: createdEvent._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create event: ${error.message}`);
  }
}

async function fetchAllChildEvents(eventId: string): Promise<any[]> {
  const childEvents = await Event.find({ parentId: eventId });

  const descendantEvents = [];
  for (const childEvent of childEvents) {
    const descendants = await fetchAllChildEvents(childEvent._id);
    descendantEvents.push(childEvent, ...descendants);
  }

  return descendantEvents;
}

export async function deleteEvent(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the bleep to be deleted (the main bleep)
    const mainEvent = await Event.findById(id).populate("author community");

    if (!mainEvent) {
      throw new Error("Event not found");
    }

    // Fetch all child threads and their descendants recursively
    const descendantEvents = await fetchAllChildEvents(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantEventIds = [
      id,
      ...descendantEvents.map((event) => event._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantEvents.map((event) => event.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainEvent.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantEvents.map((event) => event.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainEvent.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Event.deleteMany({ _id: { $in: descendantEventIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { bleeps: { $in: descendantEventIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { events: { $in: descendantEventIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete event: ${error.message}`);
  }
}

export async function fetchEventById(eventId: string) {
  connectToDB();

  try {
    const event = await Event.findById(eventId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Populate the author field with _id and username
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      }) // Populate the community field with _id and name
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Event, // The model of the nested children (assuming it's the same "Thread" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return event;
  } catch (err) {
    console.error("Error while fetching bleep:", err);
    throw new Error("Unable to fetch bleep");
  }
}

export async function addCommentToEvent(
  eventId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    // Find the original thread by its ID
    const originalEvent = await Event.findById(eventId);

    if (!originalEvent) {
      throw new Error("Bleep not found");
    }

    // Create the new comment thread
    const commentBleep = new Event({
      text: commentText,
      author: userId,
      parentId: eventId, // Set the parentId to the original thread's ID
    });

    // Save the comment thread to the database
    const savedCommentBleep = await commentEvent.save();

    // Add the comment bleep's ID to the original thread's children array
    originalEvent.children.push(savedCommentEvent._id);

    // Save the updated original thread to the database
    await originalEvent.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}
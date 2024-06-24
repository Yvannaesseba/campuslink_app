"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import Bleep from "../models/bleep.model";
import Community from "../models/community.model";

export async function fetchPosts({
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
}: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
}) {
  connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts that have no parent (top-level bleeps) (a bleep that is not a comment/reply).
  // If searchString is provided, filter posts by content.
  const postsQuery = Bleep.find({
    parentId: { $in: [null, undefined] },
    text: { $regex: searchString, $options: "i" }, // Case-insensitive search
  })
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
  const totalPostsCount = await Bleep.countDocuments({
    parentId: { $in: [null, undefined] },
    text: { $regex: searchString, $options: "i" }, // Case-insensitive search
  });

  const posts = await postsQuery.exec();
  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

interface Params {
  text: string;
  file?: [];
  author: string;
  communityId: string | null;
  path: string;
}

export async function createBleep({
  text,
  author,
  communityId,
  path,
  file,
}: Params) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdBleep = await Bleep.create({
      text,
      file,
      author,
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { bleeps: createdBleep._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { bleeps: createdBleep._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create bleep: ${error.message}`);
  }
}

async function fetchAllChildBleeps(bleepId: string): Promise<any[]> {
  const childBleeps = await Bleep.find({ parentId: bleepId });

  const descendantBleeps = [];
  for (const childBleep of childBleeps) {
    const descendants = await fetchAllChildBleeps(childBleep._id);
    descendantBleeps.push(childBleep, ...descendants);
  }

  return descendantBleeps;
}

export async function deleteBleep(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the bleep to be deleted (the main bleep)
    const mainBleep = await Bleep.findById(id).populate("author community");

    if (!mainBleep) {
      throw new Error("Bleep not found");
    }

    // Fetch all child threads and their descendants recursively
    const descendantBleeps = await fetchAllChildBleeps(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantBleepIds = [
      id,
      ...descendantBleeps.map((bleep) => bleep._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantBleeps.map((bleep) => bleep.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainBleep.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantBleeps.map((bleep) => bleep.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainBleep.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Bleep.deleteMany({ _id: { $in: descendantBleepIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { bleeps: { $in: descendantBleepIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { bleeps: { $in: descendantBleepIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete bleep: ${error.message}`);
  }
}

export async function fetchBleepById(bleepId: string) {
  connectToDB();

  try {
    const bleep = await Bleep.findById(bleepId)
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
            model: Bleep, // The model of the nested children (assuming it's the same "Thread" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return bleep;
  } catch (err) {
    console.error("Error while fetching bleep:", err);
    throw new Error("Unable to fetch bleep");
  }
}

export async function addCommentToBleep(
  bleepId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    // Find the original thread by its ID
    const originalBleep = await Bleep.findById(bleepId);

    if (!originalBleep) {
      throw new Error("Bleep not found");
    }

    // Create the new comment thread
    const commentBleep = new Bleep({
      text: commentText,
      author: userId,
      parentId: bleepId, // Set the parentId to the original thread's ID
    });

    // Save the comment thread to the database
    const savedCommentBleep = await commentBleep.save();

    // Add the comment bleep's ID to the original thread's children array
    originalBleep.children.push(savedCommentBleep._id);

    // Save the updated original thread to the database
    await originalBleep.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}
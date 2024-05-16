"use server"

import { connectToDB } from "../mongoose";
import Bleep from "../models/bleep.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import { skip } from "node:test";

interface Params {
 text: string,
 author:string,
 communityId: string | null,
 path: string ,
}

export async function createBleep ({text, author, communityId, path}: Params) {
  try {
    connectToDB();

    const createdBleep= await Bleep.create({
      text,
      author,
      //community: communityId,
     community: null,
    });
  
    //Update user model
    await User.findByIdAndUpdate( author, {
      $push: { bleeps: createdBleep._id}
    })
  
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating bleep:${error.message}`)
  }
} 

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB ()  ;

  // Calculate the number of posts to skip 
  const skipAmount = (pageNumber - 1) * pageSize;

  // Fetch the posts that have no parents (top-level bleeps....)
  const postsQuery = Bleep.find({ parentId : { $in: [null, undefined]}})
  .sort ({ createdAt: 'desc'})
  .skip(skipAmount)
  .limit(pageSize)
  .populate({path: 'author', model: User})
  .populate({
    path: 'children',
    populate :{
      path: 'author',
      model: User,
      select: "_id name parentId image"
    }
  })

  const totalPostsCount = await Bleep.countDocuments({ parentId: { $in: [null, undefined ]} })

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length; 
  return {posts, isNext};
}

export async function fetchBleepById(id: string) {
  connectToDB();

  try{

    //TODO: Populate Community
    const bleep = await Bleep.findById(id)
      .populate({
        path: 'author',
        model : User,
        select: "_id id name image"
      })
      .populate({
        path: 'children',
        populate: [
          {
            path:'author',
            model: User,
            select: "_id id name parentId image"
          },
          {
            path: 'children',
            model: Bleep,
            populate: {
              path: 'author',
              model: User,
              select: "_id id name parentId image"
            }
          }
        ]
      }).exec();
      return bleep;
  } catch (error: any) {
    throw new Error(`Error fetching bleep: {error.message}`)
  }
}

export async function addCommentToBleep(
  bleepId: string,
  commentText: string,
  userId: string,
  path: string,
) {
  connectToDB();

  try {
    //Find the original bleep by its ID
    const originalBleep = await Bleep.findById(bleepId);

    if(!originalBleep) { 
      throw new Error("Bleep not found")
    }

    // Create a new Bleep with the comment text
    const commentBleep = new Bleep({
      text: commentText,
      author: userId,
      parentId: bleepId,
    })

    // Save the new Bleep
    const savedCommentBleep = await commentBleep.save();

    //Update the original bleep to indicate the new comment
    originalBleep.children.push(savedCommentBleep._id);

    //Save the original bleep
    await originalBleep.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment to bleep: $(error.message)`)
  }
}
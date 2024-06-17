"use server"
import Event from "../models/event.model"
import { FilterQuery, SortOrder } from "mongoose";
import Bleep from "../models/bleep.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import Community from "../models/community.model"
import { handleError } from '@/lib/utils'
export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User
    .findOne({ id: userId})
    //.populate({
    // path: 'communities',
    //  model: Community
    //})
  } catch (error:any) {
    throw new Error(`Failed to fetch user: ${error.message}`)
  }
}

interface Params{
  username: string;
  name: string;
  bio: string;
  image: string;
  userId: string;
  path: string;
}

export async function updateUser
  ({userId,
    username,
    name,
    bio,
    image,
    path,
  } :Params ): Promise<void> {
  try{
    connectToDB();

    await User.findOneAndUpdate(
      {id: userId },
      { 
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true}
    );
  
    if(path === '/profile/edit') {
      revalidatePath(path);
    }
  }  catch(error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`)
  }
  }

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    // Find all bleeps authored by user with the given userId 
    const bleeps = await User.findOne ({ id: userId })
    .populate({
      path: 'bleeps',
      model: Bleep,
      populate: [
        {
          path:"community",
          model: Community,
          select: "name id image _id", // Select the "name " and "_id" fields from the "Community" model
        },
        {
        path: 'children',
        model: Bleep,
        populate: {
          path: 'author',
          model: User,
          select: 'name image id',
        },
      },
      ],
    });

    return bleeps;
  } catch (error:any) {
    throw new Error(`Failed to fetch user posts: ${error.message}`)
  }
}

export async function fetchUsers({ 
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc"
} : {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder
}) {
  try{
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i")

    const query: FilterQuery<typeof User>= {
      id: {$ne: userId}
    }

    if(searchString.trim() !== '') {
      query.$or = [
        {username: {$regex: regex} },
        {name: {$regex: regex}}
      ]
    }

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
    .sort(sortOptions)
    .skip(skipAmount)
    .limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return { users , isNext};
  } catch (error: any){
    throw new Error(`Failed to fetch users: ${error.message}`)
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB();

    // find all bleeps created by the user
    const userBleeps = await Bleep.find({ author: userId});

    // Collect all the child bleep ids (replies) from the 'children' field
    const childBleepsIds = userBleeps.reduce((acc, userBleep) => {
      return acc.concat(userBleep.children)
    }, [])

    const replies = await Bleep.find({
      _id: {$in: childBleepsIds  },
      author: { $ne: userId}
    }).populate({
      path: 'author',
      model: User,
      select: 'name image _id'
    })

    return replies;
  } catch (error: any) {
    throw new Error(`Failed to fetch activity: ${error.message}`)
  }
}
import mongoose from "mongoose";

const bleepSchema = new mongoose.Schema({
text: { type: String, required: true},
author: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true
},
community: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Community',
},
createdAt: {
type: Date,
default: Date.now
},
parentId: {
type: String
},
children: [
{
type: mongoose.Schema.Types.ObjectId,
ref: 'Bleep'
}
],
});

const Bleep = mongoose.models.Bleep || mongoose.model("Bleep", bleepSchema);

export default Bleep;
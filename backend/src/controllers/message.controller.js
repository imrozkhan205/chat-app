import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
// This function fetches all users except the currently logged-in user from the database.
// The password field is excluded from the response.
// The response is returned as a JSON array of users.
// If an error occurs, it is logged, and a 500 error is returned.
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    // ne = not equal
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myID = req.user._id;

    const messages = await Message.find({
        $or:[
            {senderId:myID, receiverId:userToChatId},
            {senderId: userToChatId, receiverId:myID}
        ]
    })
    res.status(200).json(messages)
  } catch (error) {
    console.log("Error in getMessages controller:", error.message);
    res.status(500).json({message:"Internal Server Error"})
    
  }
};

export const sendMessage = async(req,res)=>{
    try {
        const {text, image} = req.body;
        const{id: receiverId} = req.params;
        const senderId = req.user._id; //our ID
        // checking if the user is uploading an image
        let imageUrl;
        if(image){
            //upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        // create a message
        const newMessage = new Message({
            senderId, //us
            receiverId,
            text,
            image: imageUrl,
        });
        // save it to the DB
        await newMessage.save();
        //todo: realtime functionality goes here => socket.io

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({message:"Internal Server Error"})
        
    }
};
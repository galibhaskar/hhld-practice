import Conversation from "../models/chat.model.js";

export const addMsgsToConversation = async (participants, msg) => {
  try {
    console.log(participants);

    console.log(msg);

    // Find conversation by participants
    let conversation = await Conversation.findOne({
      users: { $all: participants },
    });

    // If conversation doesn't exist, create a new one
    if (!conversation) {
      conversation = await Conversation.create({ users: participants });
    }
    // Add msg to the conversation
    conversation.msgs.push(msg);

    await conversation.save();

    console.log("Message published to conversation");
  } catch (error) {
    console.log("Error adding message to conversation: " + error.message);
  }
};

export const getMsgsofConversation = async (req, res) => {
  try {
    const { sender, receiver } = req.query;

    console.log("sender:", sender);

    console.log("receiver:", receiver);

    const participants = [sender, receiver];

    console.log(participants);

    const conversation = await Conversation.findOne({
      users: { $all: participants },
    });

    console.log(conversation);

    if (!conversation) {
      return res.status(200).json([]);
    }

    res.status(200).json(conversation.msgs);
  } catch (error) {
    console.log("error in get msgs of conversation", error.message);

    res.status(500).send("error in fetching messages");
  }
};

const Messages = require("../models/messageModel");
const messageDb = 'messages'
const { MongoClient, ObjectId } = require('mongodb');

const messageCollectionDb = 'messages'


module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const client = await MongoClient.connect(process.env.MONGO_URL);
    const msgcollection = client.db(messageDb).collection(messageCollectionDb);
    const messages = await msgcollection.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    console.log(messages)

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const client = await MongoClient.connect(process.env.MONGO_URL);
    const msgcollection = client.db(messageDb).collection(messageCollectionDb);

    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    await msgcollection.insertOne(data);

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

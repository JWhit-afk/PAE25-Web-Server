/**
 * @file database.ts
 * @author Jacob Whitbourn
 * @brief Initializes the database and provides the functions for operations on the database
 * @version 1.0.0
 * @date 2024-5-12
 * 
 */

import { MongoClient, ObjectId } from "mongodb";

// connects to the database (needs to be running before)
const database = new MongoClient("mongodb://0.0.0.0:27017/PAE25").db()
//const database = new MongoClient("mongodb://localhost:27017/PAE25").db()

// function for setting up the database -> operation functions await this function to complete
const database_initialisation = (async () => {
// create the validator schemes for each table 
    // creates chat table
    await database.createCollection("chats", {
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: [
                  'name',
                  'userId',
                  'promptIds',
                  'replyIds'
                ],
                properties: {
                  name: {
                    bsonType: 'string'
                  },
                  userId: {
                    bsonType: 'objectId'
                  },
                  promptIds: {
                    bsonType: 'array',
                    description: 'array of message IDs'
                  },
                  replyIds: {
                    bsonType: 'array',
                    description: 'array of message IDs'
                  }
                }
              }
        }
    })

    // creates message table
    .then(async () => {
        await database.createCollection("message", {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: [
                        'content'
                    ],
                    properties: {
                        content: {
                        bsonType: 'string'
                        }
                    }
                    }
                }
            })
    })

    // creates student table
    .then(async () => {
        await database.createCollection("user", {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: [
                      'name',
                      'chats',
                      'username',
                      'password'
                    ],
                    properties: {
                      name: {
                        bsonType: 'string'
                      },
                      chats: {
                        bsonType: 'array',
                        description: 'array of chat ids'
                      },
                      username: {
                        bsonType: 'string'
                      },
                      password: {
                        bsonType: 'string'
                      }
                    }
                  }
            }
        })
    })
})();

// enum of the DBCollections -> cleaner and more consistent access than raw string
const enum DBCollections {
  chats = "chats",
  message = "message",
  user = "user"
};

// enum of DB results
export const enum DBResult {
  DBSuccess,
  DBUserAdded,
  DBUserNotAdded,
  DBUserNotFound,
  DBRecordNotFound
};

export const add_user = async (name: string, username: string, password: string) => {
  await database_initialisation;
  return database.collection(DBCollections.user).insertOne(
    {
      name: name,
      chats: [],
      username: username,
      password: password
    }
  )
  .then ((userDocument => userDocument || DBResult.DBUserNotAdded))
}

export const get_user_document = async (username: string) => {
  await database_initialisation;
  return database.collection(DBCollections.user).findOne(
    {
      username: username
    }
  )
  .then ((userDocument) => userDocument || DBResult.DBUserNotFound)
}

export const get_message_document = async (messageID: any) => {
  await database_initialisation;
  return database.collection(DBCollections.message).findOne(messageID)
  .then((messageDocument) => messageDocument || DBResult.DBRecordNotFound)
};

// returns te promptIDs and replyIDs contained in the chat
export const get_chat_document = async (chatID: ObjectId) => {
  console.log(chatID)
  await database_initialisation;
  console.log(chatID)
  return database.collection(DBCollections.chats).findOne({
    _id: new ObjectId(chatID)
  })
    .then((chatDocument => chatDocument || DBResult.DBRecordNotFound));
};
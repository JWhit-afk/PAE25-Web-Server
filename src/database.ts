/**
 * @file database.ts
 * @author Jacob Whitbourn
 * @brief Initializes the database and provides the functions for operations on the database
 * @version 1.0.0
 * @date 2024-5-12
 * 
 */

import { MongoClient } from "mongodb";

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
                  'studentId',
                  'promptIds',
                  'replyIds'
                ],
                properties: {
                  name: {
                    bsonType: 'string'
                  },
                  studentId: {
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
        await database.createCollection("student", {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: [
                      'name',
                      'chats',
                      'supervisor'
                    ],
                    properties: {
                      name: {
                        bsonType: 'string'
                      },
                      chats: {
                        bsonType: 'array',
                        description: 'array of chat ids'
                      },
                      supervisor: {
                        bsonType: 'objectId'
                      }
                    }
                  }
            }
        })
    })

    // creates supervisor table
    .then(async () => {
        await database.createCollection("supervisor", {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: [
                      'name',
                      'studentIds'
                    ],
                    properties: {
                      name: {
                        bsonType: 'string'
                      },
                      studentIds: {
                        bsonType: 'array',
                        description: 'array of studentIds supervised'
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
  student = "student",
  supervisor = "supervisor"
};

// enum of DB results
export const enum DBResult {
  DBSuccess,
  DBRecordNotFound
};


export const get_message_document = async (messageID: any) => {
  await database_initialisation;
  return database.collection(DBCollections.message).findOne(messageID)
  .then((messageDocument) => messageDocument || DBResult.DBRecordNotFound)
};

// returns te promptIDs and replyIDs contained in the chat
export const get_chat_document = async (chatID: any) => {
  await database_initialisation;
  return database.collection(DBCollections.chats).findOne(chatID)
    .then((chatDocument => chatDocument || DBResult.DBRecordNotFound));
};
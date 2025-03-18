/**
 * @file database.ts
 * @author Jacob Whitbourn
 * @brief Initializes the database and provides the functions for operations on the database
 * @version 1.0.0
 * @date 2024-5-12
 * 
 */

import { Document, MongoClient, ObjectId, UpdateFilter } from "mongodb";

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
                  'chatLog'
                ],
                properties: {
                  name: {
                    bsonType: 'string'
                  },
                  chatLog: {
                    bsonType: 'array',
                    description: 'array of message IDs'
                  }
                }
              }
        }
    })

    // creates student table
    .then(async () => {
        await database.createCollection("user", {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: [
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
  user = "user"
};

// enum of DB results
export const enum DBResult {
  DBSuccess,
  DBDocumentUpdateError,
  DBUserAdded,
  DBUserNotAdded,
  DBUserNotFound,
  DBRecordNotFound
};

export const add_user = async (username: string, password: string) => {
  await database_initialisation;
  return database.collection(DBCollections.user).insertOne({
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

export const create_new_chat = async (name:string, username: string) => {
  await database_initialisation;
  // create the document
  return await database.collection(DBCollections.chats).insertOne({
    name: name,
    chatLog: []
  })
  // find the user that created it and append the new chat to their list
  .then((result) => {
    let pushop: Document= {
      "$push": {chats: result.insertedId}
    }
    if (result != null) {
      database.collection(DBCollections.user).findOneAndUpdate({
        username: username
      }, 
      pushop )
      return new ObjectId(result.insertedId)
    } else {
      return DBResult.DBDocumentUpdateError
    }}
  ) 
}

// returns te chat doc
export const get_chat_document = async (chatID: ObjectId) => {
  await database_initialisation;
  return database.collection(DBCollections.chats).findOne({
    _id: new ObjectId(chatID)
  })
    .then((chatDocument => chatDocument || DBResult.DBRecordNotFound));
};

// updates a chat document with the full chat log
export const update_chat_log = async (chatID: ObjectId, chatLog) => {
  await database_initialisation;
  let result = database.collection(DBCollections.chats).findOneAndUpdate({
    _id: new ObjectId(chatID)
  },{
    "$set": {chatLog: chatLog}
  })
  if (result != null) {
    return DBResult.DBSuccess
  } else {
    return DBResult.DBRecordNotFound
  }
}

export const update_chat_name = async (chatID: ObjectId, new_name: string) => {
  console.log(new_name)
  await database_initialisation;
  let result = database.collection(DBCollections.chats).findOneAndUpdate({
    _id: new ObjectId(chatID)
  },{
    "$set": {name: new_name}
  })
  if (result != null) {
    return DBResult.DBSuccess
  } else {
    return DBResult.DBRecordNotFound
  }
}
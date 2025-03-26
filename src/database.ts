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
        await database.createCollection("student", {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: [
                      'name',
                      'chats',
                      'task',
                      'answer',
                      'feedback',
                      'grade',
                      'model_feedback',
                      'model_grade',
                      'username',
                      'password'
                    ],
                    properties: {
                      last_login: {
                        bsonType: 'date'
                      },
                      name: {
                        bsonType: 'string'
                      },
                      chats: {
                        bsonType: 'array',
                        description: 'array of chat ids'
                      },
                      task: {
                        bsonType: 'string',
                        description: 'The task assigned by the supervisor'
                      },
                      answer: {
                        bsonType: 'string',
                        description: 'The students answer to the task'
                      },
                      feedback: {
                        bsonType: 'string',
                        description: 'The supervisor feedback'
                      },
                      grade: {
                        bsonType: 'string',
                        description: 'The supervisor grade'
                      },
                      model_feedback: {
                        bsonType: 'string',
                        description: 'The models feedback'
                      },
                      model_grade: {
                        bsonType: 'string',
                        description: 'The models grade'
                      },
                      supervisor: {
                        bsonType: "objectId",
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

    // create supervisor table
    .then(async () => {
      await database.createCollection("supervisor", {
          validator: {
              $jsonSchema: {
                  bsonType: 'object',
                  required: [
                    'name',
                    'students',
                    'username',
                    'password'
                  ],
                  properties: {
                    last_login: {
                      bsonType: 'date'
                    },
                    name: {
                      bsonType: 'string'
                    },
                    students: {
                      bsonType: 'array',
                      description: 'array of student ids'
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
  student = "student",
  supervisor = "supervisor",
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

export const add_student = async (name: string, username: string, password: string) => {
  await database_initialisation;
  return database.collection(DBCollections.student).insertOne({
      last_login: new Date(),
      name: name,
      chats: [],
      task: "In python, write a small function that will remove all empty items in a list of strings. Then it must print the length of the new list and how many items were removed",
      answer: "",
      feedback: "",
      grade: "",
      model_feedback: "",
      model_grade: "",
      username: username,
      password: password
    }
  )
  .then ((userDocument => userDocument || DBResult.DBUserNotAdded))
}

export const add_supervisor = async (name: string, username: string, password: string) => {
  await database_initialisation;
  return database.collection(DBCollections.supervisor).insertOne({
      last_login: new Date(),
      name: name,
      students: [],
      username: username,
      password: password
    }
  )
  .then ((userDocument => userDocument || DBResult.DBUserNotAdded))
}

export const get_student_document = async (username: string) => {
  await database_initialisation;
  return database.collection(DBCollections.student).findOne(
    {
      username: username
    }
  )
  .then ((userDocument) => userDocument || DBResult.DBUserNotFound)
}

export const get_student_document_id = async (id: ObjectId) => {
  await database_initialisation;
  return database.collection(DBCollections.student).findOne(
    {
      _id: id
    }
  )
  .then ((userDocument) => userDocument || DBResult.DBUserNotFound)
}

export const assign_student_task = async (student_id: string, task) => {
  await database_initialisation;
  let result = await database.collection(DBCollections.student).findOneAndUpdate({
    _id: new ObjectId(student_id)
  },{
    "$set": {task: task}
  })
  if (result != null) {
    return DBResult.DBSuccess
  } else {
    return DBResult.DBRecordNotFound
  }
}

export const submit_student_answer = async (username: string, answer) => {
  await database_initialisation;
  let result = await database.collection(DBCollections.student).findOneAndUpdate({
    username: username
  },{
    "$set": {answer: answer}
  })
  if (result != null) {
    return DBResult.DBSuccess
  } else {
    return DBResult.DBRecordNotFound
  }
}

export const submit_supervisor_feedback = async (student_id: string, feedback) => {
  await database_initialisation;
  let result = await database.collection(DBCollections.student).findOneAndUpdate({
    _id: new ObjectId(student_id)
  },{
    "$set": {feedback: feedback}
  })
  if (result != null) {
    return DBResult.DBSuccess
  } else {
    return DBResult.DBRecordNotFound
  }
}

export const submit_supervisor_grade = async (student_id: string, grade) => {
  await database_initialisation;
  let result = await database.collection(DBCollections.student).findOneAndUpdate({
    _id: new ObjectId(student_id)
  },{
    "$set": {grade: grade}
  })
  if (result != null) {
    return DBResult.DBSuccess
  } else {
    return DBResult.DBRecordNotFound
  }
}

export const submit_model_feedback = async (username: string, feedback) => {
  await database_initialisation;
  let result = await database.collection(DBCollections.student).findOneAndUpdate({
    username: username
  },{
    "$set": {model_feedback: feedback}
  })
  if (result != null) {
    return DBResult.DBSuccess
  } else {
    return DBResult.DBRecordNotFound
  }
}

export const submit_model_grade = async (username: string, grade) => {
await database_initialisation;
  let result = await database.collection(DBCollections.student).findOneAndUpdate({
    username: username
  },{
    "$set": {model_grade: grade}
  })
  if (result != null) {
    return DBResult.DBSuccess
  } else {
    return DBResult.DBRecordNotFound
  }
}

export const get_supervisor_document = async (username: string) => {
  await database_initialisation;
  return database.collection(DBCollections.supervisor).findOne(
    {
      username: username
    }
  )
  .then ((userDocument) => userDocument || DBResult.DBUserNotFound)
}

export const remove_supervisor= async (supervisor_id: ObjectId) => {
  await database_initialisation;
  return database.collection(DBCollections.supervisor).findOneAndDelete({
    _id: new ObjectId(supervisor_id)
  })
  .then ((removedDoc) => removedDoc || DBResult.DBDocumentUpdateError)
}

export const add_student_to_supervisor = async (student_id: ObjectId, supervisor_username: string) => {
  await database_initialisation;
  console.log(student_id + " " + supervisor_username)
  let pushop: Document= {
    "$push": {students: student_id}
  }
  return database.collection(DBCollections.supervisor).findOneAndUpdate({
    username: supervisor_username
  },
    pushop
  )
  .then ((updatedDoc) => updatedDoc || DBResult.DBDocumentUpdateError)
}

export const remove_student = async (student_id: ObjectId) => {
  await database_initialisation;
  // remove from supervisor
  let pullop: Document= {
    "$pull": {students: new ObjectId(student_id)}
  }
  await database.collection(DBCollections.supervisor).findOneAndUpdate({
    students: new ObjectId(student_id)
  },
    pullop
  )
  // then delete
  return database.collection(DBCollections.student).findOneAndDelete({
      _id: student_id
  })
  .then ((removedDoc) => removedDoc || DBResult.DBSuccess)
}

export const create_new_chat = async (name:string, username: string) => {
  await database_initialisation;
  // create the document
  return await database.collection(DBCollections.chats).insertOne({
    name: name,
    chatLog: []
  })
  // find the student that created it and append the new chat to their list
  .then((result) => {
    let pushop: Document= {
      "$push": {chats: result.insertedId}
    }
    if (result != null) {
      database.collection(DBCollections.student).findOneAndUpdate({
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

export const update_last_login = async (userID: ObjectId, student: boolean) => {
  await database_initialisation;
  let result
  if (student) {
    result = await database.collection(DBCollections.student).findOneAndUpdate({
      _id: new ObjectId(userID)
    },{
      "$set": {last_login: new Date()}
    })
  } else {
    // then a supervisor
    result = await database.collection(DBCollections.supervisor).findOneAndUpdate({
      _id: new ObjectId(userID)
    },{
      "$set": {last_login: new Date()}
    })
  }
  if (result != null) {
    return DBResult.DBSuccess
  } else {
    return DBResult.DBRecordNotFound
  }
}

// runs 1x per day -> removes user that have not logged in for a year
setTimeout(async () => {
  await database_initialisation;
  await database.collection("users").deleteMany({
    lastLogin: {
      $lt: (new Date(new Date().setFullYear(new Date().getFullYear() - 1)))
    }
  })
}, 86400000)
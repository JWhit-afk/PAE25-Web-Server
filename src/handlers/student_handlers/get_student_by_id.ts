import { ObjectId } from "mongodb"
import {interface_status, interface_result} from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { DBResult, get_student_document_id } from "../../database"

// TODO: password is raw -> needs encrypting (possibly with bcrypt?)
/**
 * Gets users information
 * @param data - data.id
 * @returns data.name, data.chatIds / interface success / interface failure w/ reason
 */
export const get_student_handler_by_id = async (data: any) => {
    
    // check if username is present in DB
    let userDoc = await get_student_document_id(new ObjectId(data.id))
    if (userDoc == DBResult.DBUserNotFound) {    
        return {
            id: -1,
            reply: interface_status.userNotFound
        }
    }


    // if checks clear -> send relevant info linked to user:
    return {
        id: -1,
        reply: interface_status.success,
        data: {
            id: userDoc._id,
            name: userDoc.name,
            username: userDoc.username,
            chatIds: userDoc.chats,
            task: userDoc.task,
            answer: userDoc.answer,
            feedback: userDoc.feedback,
            grade: userDoc.grade,
            model_grade: userDoc.model_grade,
            model_feedback: userDoc.model_feedback
        }
    }
    
    
}
import {interface_status, interface_result} from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { DBResult, get_student_document, update_last_login } from "../../database"

/**
 * Gets users information
 * @param data - data.username, data.password
 * @returns data.name, data.chatIds / interface success / interface failure w/ reason
 */
export const get_student_handler = async (data: any) => {
    
    // check if username is present in DB
    let userDoc = await get_student_document(data.username)
    if (userDoc == DBResult.DBUserNotFound) {
        // check if they are a supervisor
        
        return {
            id: -1,
            reply: interface_status.userNotFound
        }
    }

    // check if password is correct
    if (userDoc.password != data.password) {
        return {
            id: -1,
            reply: interface_status.userPasswordIncorrect
        }
    }

    // as the password has been confimed -> must be the real user -> update last login
    await update_last_login(userDoc._id, true)

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
            model_feedback: userDoc.model_feedback,
            model_grade: userDoc.model_grade,
            grade: userDoc.grade,
        }
    }
    
    
}
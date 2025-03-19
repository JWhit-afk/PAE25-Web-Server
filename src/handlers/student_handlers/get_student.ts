import {interface_status, interface_result} from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { DBResult, get_student_document } from "../../database"

// TODO: password is raw -> needs encrypting (possibly with bcrypt?)
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

    // if checks clear -> send relevant info linked to user:
    return {
        id: -1,
        reply: interface_status.success,
        data: {
            id: userDoc._id,
            name: userDoc.name,
            username: userDoc.username,
            chatIds: userDoc.chats
        }
    }
    
    
}
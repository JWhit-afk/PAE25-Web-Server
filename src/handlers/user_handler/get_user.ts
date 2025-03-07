import {interface_status, interface_result} from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { DBResult, get_user_document } from "../../database"

// TODO: password is raw -> needs encrypting (possibly with bcrypt?)
/**
 * Gets users information
 * @param data - data.username, data.password
 * @returns data.name, data.chatIds / interface success / interface failure w/ reason
 */
export const get_user_handler = async (data: any) => {
    
    // check if username is present in DB
    let userDoc = await get_user_document(data.username)
    if (userDoc == DBResult.DBUserNotFound) {
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
            name: userDoc.name,
            chatIds: userDoc.chats
        }
    }
    
    
}
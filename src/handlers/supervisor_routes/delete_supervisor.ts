import {interface_status, interface_result} from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { DBResult, get_supervisor_document, remove_student, remove_supervisor, update_last_login } from "../../database"

/**
 * Remove supervisor information from db
 * @param data - data.username, data.password
 * @returns interface success / interface failure
 */
export const delete_supervisor_handler = async (data: any) => {
    
    // check if username is present in DB
    let userDoc = await get_supervisor_document(data.username)
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

    // if checks clear -> perform delete actions
    // first remove from supervisor list
    await remove_supervisor(userDoc._id)

    return {
        id: -1,
        reply: interface_status.success,
    }
    
    
}
import {interface_status, interface_result} from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { DBResult, get_student_document, remove_student, update_last_login } from "../../database"

/**
 * Remove student information from db
 * @param data - data.username, data.password
 * @returns interface success / interface failure
 */
export const delete_student_handler = async (data: any) => {
    
    // check if username is present in DB
    let userDoc = await get_student_document(data.username)
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
    await remove_student(userDoc._id)

    return {
        id: -1,
        reply: interface_status.success,
    }
    
    
}
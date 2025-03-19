import {interface_status, interface_result} from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { DBResult, get_student_document } from "../../database"

// TODO: password is raw -> needs encrypting (possibly with bcrypt?)
/**
 * Gets users information
 * @param data - data.username
 * @returns interface success / interface failure
 */
export const check_student_user_route = async (data: any) => {
    
    // check if username is present in DB
    let userDoc = await get_student_document(data.username)
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
            id: userDoc._id
        }
    }
    
    
}
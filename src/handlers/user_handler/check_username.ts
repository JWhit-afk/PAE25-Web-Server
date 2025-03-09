import {interface_status, interface_result} from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { DBResult, get_user_document } from "../../database"

/**
 * Checks if username is present in db
 * @param data - data.username
 * @returns no data -> interface_status.userAlreadyExists || interface_status.userNotFound
 */
export const check_username_handler = async (data: any) => {
    
    // check if username is present in DB
    let userDoc = await get_user_document(data.username)
    if (userDoc == DBResult.DBUserNotFound) {
        return {
            id: -1,
            reply: interface_status.userNotFound
        }
    }

    return {
        id: -1,
        reply: interface_status.userAlreadyExists
    }
    
    
}
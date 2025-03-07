import {interface_status, interface_result} from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { add_user, DBResult, find_user } from "../../database"

// TODO: password is raw -> needs encrypting (possibly with bcrypt?)
/**
 * Adds user to database, after passing validation tests
 * @param data - data.name, data.username, data.password
 * @returns no data / interface success / interface failure w/ reason
 */
export const add_user_handler = async (data: any) => {
    
    // first check user is not already in the database
    if (await find_user(data.username) != DBResult.DBUserNotFound) {
        return {
            id: -1,
            reply: interface_status.userAlreadyExists,
        }
    }

    // if clear add to database
    await add_user(data.name, data.username, data.password)

    return {
        id: -1,
        reply: interface_status.success
    }
}
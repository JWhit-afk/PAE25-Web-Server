import {interface_status, interface_result} from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { add_user } from "../../database"

// TODO: password is raw -> needs encrypting (possibly with bcrypt?)
/**
 * Adds user to database, after passing validation tests
 * @param data - data.username, data.password
 * @returns no data / interface success / interface failure w/ reason
 */
export const add_user_handler = async (data: any) => {
    // checks should be done client side -> assume all clear:

    let result = await add_user(data.username, data.password)

    if (result.acknowledged) {
        return {
            id: -1,
            reply: interface_status.success
        }
    } else {
        return {
            id: -1,
            reply: interface_status.failure
        }
    }
}
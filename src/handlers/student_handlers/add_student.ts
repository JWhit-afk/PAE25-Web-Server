import {interface_status, interface_result} from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { add_student } from "../../database"

// TODO: password is raw -> needs encrypting (possibly with bcrypt?)
/**
 * Adds user to database, after passing validation tests
 * @param data - data.name, data.username, data.password
 * @returns no data / interface success / interface failure
 */
export const add_student_handler = async (data: any) => {
    // checks should be done client side -> assume all clear:

    console.log("adding student")
    let result = await add_student(data.name, data.username, data.password)

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
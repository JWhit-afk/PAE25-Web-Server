import { interface_status } from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { add_supervisor } from "../../database"

/**
 * Adds a supervisor to the db
 * @param data - data.username
 * @returns no data -> interface_status.userAlreadyExists || interface_status.userNotFound
 */
export const add_supervisor_handler = async (data: any) => {
    // checks should be done client side -> assume all clear:

    console.log("adding student")
    let result = await add_supervisor(data.name, data.username, data.password)

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
import { interface_status } from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { add_supervisor, DBResult, get_supervisor_document } from "../../database"

/**
 * verifies a user is a supervisor
 * @param data - data.username
 * @returns no data -> interface_status.success || interface_status.userNotFound
 */
export const verify_supervisor_handler = async (data: any) => {
    if (await get_supervisor_document(data.username) != DBResult.DBUserNotFound) {
        return {
            id: -1,
            reply: interface_status.success
        }
    } else {
        return {
            id: -1,
            reply: interface_status.userNotFound
        }
    }
}
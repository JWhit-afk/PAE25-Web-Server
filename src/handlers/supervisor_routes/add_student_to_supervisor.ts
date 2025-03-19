import { interface_status } from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { add_student_to_supervisor, DBResult, get_student_document } from "../../database"

/**
 * Assign a student to a supervisor and update db
 * @param data - data.student_username, data.supervisor_username
 * @returns interface success / interface failure
 */
export const add_student_to_supervisor_handler = async (data: any) => {
    let studentDoc = await get_student_document(data.student_username)

    if (studentDoc == DBResult.DBUserNotFound) {
        return {
            id: -1,
            reply: interface_status.userNotFound
        }
    }

    if (await add_student_to_supervisor(studentDoc._id, data.supervisor_username) == DBResult.DBDocumentUpdateError) {
        return {
            id: -1,
            reply: interface_status.userUpdateError
        }
    }

    return {
        id: -1,
        reply: interface_status.success
    }
}
import { ObjectId } from "mongodb"
import { interface_status } from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { DBResult, get_student_document_id, get_supervisor_document } from "../../database"

/**
 * verifies a user is a supervisor
 * @param data - data.username
 * @returns no data -> interface_status.success || interface_status.userNotFound
 */
export const get_supervisors_students = async (data: any) => {
    let userDoc = await get_supervisor_document(data.username)
    if (userDoc == DBResult.DBUserNotFound) {
        return {
            id: -1,
            reply: interface_status.userNotFound
        }
    }

    let names: string[] = []
    for (let id of userDoc.students) {
        console.log(userDoc.students)
        let student = await get_student_document_id(id)
        if (student == DBResult.DBUserNotFound) {
            return {
                id: -1,
                reply: interface_status.userNotFound
            }
        }
        names.push(student.username)
    }

    return {
        id: -1,
        reply: interface_status.success,
        data: {
            names: names,
            studentIds: userDoc.students
        }
    }
}
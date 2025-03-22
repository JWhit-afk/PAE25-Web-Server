import { ObjectId } from "mongodb"
import {interface_status, interface_result} from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { assign_student_task, DBResult, get_student_document_id } from "../../database"

/**
 * Assign student a task
 * @param data - data.student_id, data.task
 * @returns data.name, data.chatIds / interface success / interface failure w/ reason
 */
export const assign_student_task_handler = async (data: any) => {
    
    let response = await assign_student_task(data.student_id, data.task)

    if (response == DBResult.DBRecordNotFound) {
        return {
            id: -1,
            reply: interface_status.userUpdateError
        }
    }

    // if checks clear -> send relevant info linked to user:
    return {
        id: -1,
        reply: interface_status.success
    }
    
}
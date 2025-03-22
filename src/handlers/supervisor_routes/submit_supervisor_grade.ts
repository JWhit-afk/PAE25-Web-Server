import { ObjectId } from "mongodb"
import {interface_status, interface_result} from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { DBResult, submit_supervisor_grade } from "../../database"

/**
 * Submit a supervisors grade
 * @param data - data.student_id, data.grade
 * @returns data.name, data.chatIds / interface success / interface failure w/ reason
 */
export const submit_supervisor_grade_handler = async (data: any) => {
    
    let response = await submit_supervisor_grade(data.student_id, data.grade)

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
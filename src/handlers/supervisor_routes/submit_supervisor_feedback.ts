import { ObjectId } from "mongodb"
import {interface_status, interface_result} from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { DBResult, submit_supervisor_feedback } from "../../database"

/**
 * Submit a supervisors feedback
 * @param data - data.student_id, data.feedback
 * @returns data.name, data.chatIds / interface success / interface failure w/ reason
 */
export const submit_supervisor_feedback_handler = async (data: any) => {
    
    let response = await submit_supervisor_feedback(data.student_id, data.feedback)

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
import {interface_status, interface_result, interface_route} from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { DBResult, submit_model_feedback, submit_model_grade, submit_student_answer } from "../../database"
import { send_model_request } from "../../model_connection"

/**
 * Submits a Q+A to the model to be marked
 * @param data - data.username, data.question, data.answer
 * @returns data.name, data.chatIds / interface success / interface failure w/ reason
 */
export const submit_model_marking_handler = async (data: any) => {
    console.log(data.username)
    let response = await send_model_request(interface_route.submitModelMarking, {question: data.question, answer: data.answer})

    // process the model_response which has format: {feedback: <>, grade: <>}
    let model_response = response.data.marking

    // record the students answer
    if (await submit_student_answer(data.username, data.answer) != DBResult.DBSuccess) {
        return {
            id: -1,
            reply: interface_status.failure
        }
    }

    // update student record with feedback from model
    if (await submit_model_feedback(data.username, model_response.feedback) != DBResult.DBSuccess) {
        return {
            id: -1,
            reply: interface_status.failure
        }
    }
    if (await submit_model_grade(data.username, model_response.grade) != DBResult.DBSuccess) {
        return {
            id: -1,
            reply: interface_status.failure
        }
    }

    // send data back to client
    return {
        id: -1,
        reply: interface_status.success,
        data: {
            model_feedback: model_response.feedback,
            model_grade: model_response.grade,
        }
    }
    
}
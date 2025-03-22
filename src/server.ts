/**
 * @file interface.ts
 * @author Jacob Whitbourn
 * @brief Main server script -> handles the clients requests and sends requests to model 
 * @version 2.0.0
 * @date 2024-10-2
 * 
 */

import WebSocket, { WebSocketServer } from "ws"
import { interface_result, interface_route } from "../../PAE25-Web-Server-Interface/shared_interface"
import { get_chat_log_handler } from "./handlers/chat_handlers/get_chat_log"
import { get_student_handler } from "./handlers/student_handlers/get_student";
import { get_student_chats_handler } from "./handlers/student_handlers/get_students_chats";
import { add_chat_handler } from "./handlers/chat_handlers/add_chat";
import { check_username_handler } from "./handlers/check_username";
import { add_student_handler } from "./handlers/student_handlers/add_student";
import { submit_message_handler } from "./handlers/model_handlers/submit_message";
import { add_supervisor_handler } from "./handlers/supervisor_routes/add_supervisor";
import { verify_supervisor_handler } from "./handlers/supervisor_routes/verify_supervisor";
import { check_student_user_route } from "./handlers/student_handlers/check_student_user";
import { add_student_to_supervisor_handler } from "./handlers/supervisor_routes/add_student_to_supervisor";
import { get_supervisors_students } from "./handlers/supervisor_routes/get_supervisors_students";
import { get_supervisor_handler } from "./handlers/supervisor_routes/get_supervisor";
import { get_student_handler_by_id } from "./handlers/student_handlers/get_student_by_id";
import { assign_student_task_handler } from "./handlers/student_handlers/assign_student_task";
import { submit_supervisor_feedback_handler } from "./handlers/supervisor_routes/submit_supervisor_feedback";
import { submit_supervisor_grade_handler } from "./handlers/supervisor_routes/submit_supervisor_grade";
import { submit_model_marking_handler } from "./handlers/model_handlers/submit_marking";

// maps the shared interface_route to the function that handles the request
const interface_route_handlers = new Map<any, any>([
    [interface_route.getChatLog, get_chat_log_handler],
    [interface_route.createChat, add_chat_handler],

    // student routes
    [interface_route.createStudent, add_student_handler],
    [interface_route.getStudent, get_student_handler],
    [interface_route.getStudentById, get_student_handler_by_id],
    [interface_route.getStudentChats, get_student_chats_handler],
    [interface_route.checkStudentUser, check_student_user_route],
    [interface_route.assignStudentTask, assign_student_task_handler],

    // supervisor routes
    [interface_route.createSupervisor, add_supervisor_handler],
    [interface_route.getSupervisor, get_supervisor_handler],
    [interface_route.verifySupervisor, verify_supervisor_handler],
    [interface_route.addStudentToSupervisor, add_student_to_supervisor_handler],
    [interface_route.getSupervisorStudents, get_supervisors_students],
    [interface_route.submitSupervisorFeedback, submit_supervisor_feedback_handler],
    [interface_route.submitSupervisorGrade, submit_supervisor_grade_handler],

    // model routes
    [interface_route.submitModelMarking, submit_model_marking_handler],
    [interface_route.submitModelMessage, submit_message_handler],
    
    // general routes
    [interface_route.checkUsername, check_username_handler],
]);

/**
 * Handle the next request sent by the client through the interface
 * @param request the request sent by the client
 * @returns interface_result with the status of the interface request and any data requested (if successful)
 */
export const handle_client_request = async (request: any) :Promise<interface_result> => {
    // get the requested route and apply it to the sent data
    return interface_route_handlers.get(request.route)(request.data)
}


// Start the websocket server (on default port as suggested on WS)
const websocket_server = new WebSocketServer({ port: 8080 });
// handle connections -> called when a connection is attempted
websocket_server.on("connection", (client_connection: WebSocket) => {
    // when data is received on the connection -> construct the og object from JSON -> pass to relevant handler
    console.log("User connected")
    client_connection.on("message", async (message: string) => {
        let request = JSON.parse(message)
        console.log("Handling ", request)
        handle_client_request(request)
        .then((result) => {
            // then construct response by adding request id back in send final result to client
            let response: interface_result = {
                id: request.id,
                reply: result.reply,
                data: result.data
            }
            console.log("Sending ", response)
            client_connection.send(JSON.stringify(response))
        })
    })
})
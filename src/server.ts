/**
 * @file interface.ts
 * @author Jacob Whitbourn
 * @brief Main server script -> handles the clients requests
 * @version 1.0.0
 * @date 2024-10-2
 * 
 */

import WebSocket, { WebSocketServer } from "ws"
import { interface_result, interface_route } from "../../PAE25-Web-Server-Interface/shared_interface"
import { get_chat_log_handler } from "./handlers/chat_handlers/get_chat_log"
import { get_chat_name_handler } from "./handlers/chat_handlers/get_chat_name"


// maps the shared interface_route to the function that handles the request
const interface_route_handlers = new Map<any, any>([
    [interface_route.getChatLog, get_chat_log_handler],
    [interface_route.getChatName, get_chat_name_handler]
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
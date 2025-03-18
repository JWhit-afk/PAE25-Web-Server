import { interface_request, interface_result, interface_route } from "../../PAE25-Web-Server-Interface/shared_interface";

// to resolve sending model responses
const open_requests = new Map<number, Function>();

// connect to the python websocket on port 8765
// same promise resolve as on client
let websocket_open_resolver;
let ensure_websocket_open = new Promise(resolve => websocket_open_resolver = resolve)
const websocket_client = new WebSocket("ws://localhost:8765") // localhost as model should be run on same device 
websocket_client.onopen = (event) => websocket_open_resolver()

var next_request_id = 0;
/**
 * Sends a request to the model over websocket to the python websocket hosting the model
 */
export const send_model_request = async (route: interface_route, data: any): Promise<interface_result> => {
    await ensure_websocket_open
    console.log("Sending Model Message")

    let request: interface_request = {
        id: next_request_id,
        route: route,
        data: data
    }
    // send the request as JSON
    websocket_client.send(JSON.stringify(request))

    return new Promise((resolve) => {
        open_requests.set(next_request_id++, resolve)
    })
}

// get any received data and resolve any dangling promises
websocket_client.onmessage = (event) => {
    console.log("receiving: ", event.data)
    // get the received response 
    let response = JSON.parse(event.data)

    // call the necessary resolver to satisfy the promise
    open_requests.get(parseInt(response.id))(response)

    // remove the resolver from open requests as it is now closed
    open_requests.delete(parseInt(response.id))
}
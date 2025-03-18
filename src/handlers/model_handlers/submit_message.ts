import { interface_status, interface_result, interface_route } from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { DBResult, get_chat_document, update_chat_log, update_chat_name } from "../../database"
import { send_model_request } from "../../model_connection"
/**
 * XYZ does ZXY
 * @param data - data.chatID, data.prompt
 * @returns data.1 (type) ... data.n (type)
 */
export const submit_message_handler = async (data: any) => {
    // first get the chatlog
    let chatDocument = await get_chat_document(data.chatID)

    if (chatDocument == DBResult.DBRecordNotFound) {
        return {
            id: -1,
            reply: interface_status.failure
        }
    }

    let new_chat = false, chat_log

    let chatLog = chatDocument.chatLog
    if (chatLog.length == 0) {
        new_chat = true
        chat_log = []
    }

    // send new message to model recieve the full chat log
    let reply = await send_model_request(
        interface_route.submitModelMessage,
        {
        new_chat: new_chat,
        chat_log: chatDocument.chatLog,
        message: data.prompt
    })

    // update the chat log in the db
    if (await update_chat_log(data.chatID, reply.data.chat_log) == DBResult.DBRecordNotFound) {
        return {
            id: -1,
            reply: interface_status.failure
        }
    }

    // update the name of the chat if its new
    if (new_chat) {
        if (await update_chat_name(data.chatID, reply.data.new_name) == DBResult.DBSuccess) {
            return {
                id: -1,
                reply: interface_status.failure,
                data: {
                    updated_name: true
                }
            }
        }
    }

    return {
        id: -1,
        reply: interface_status.success
    }
}
import {interface_status, interface_result} from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { DBResult, get_chat_document } from "../../database"

/**
 * Returns the chat name of the chatID requested
 * @param data - data.chatID (DB objectID)
 * @returns data.chatName (string)
 */
export const get_chat_name_handler = async (data: any) => {
    let response: interface_result = {reply: interface_status.failure}
    let chatDocument = await get_chat_document(data.chatID)

    if (chatDocument == DBResult.DBRecordNotFound) {
        return response
    }

    return {
        reply: interface_status.success,
        data: {
            chatName: chatDocument.name
        }
    }

}
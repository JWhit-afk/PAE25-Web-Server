import {interface_status, interface_result} from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { create_new_chat, DBResult } from "../../database"
/**
 * Adds a new chat to the database assigned to a user
 * @param data - data.name (string) the chat name, data.username (string)
 * @returns data.chatId - the id of the new chat
 */
export const add_chat_handler = async (data: any) => {
    
    let newChatId = await create_new_chat(data.name, data.username)

    if (newChatId == DBResult.DBDocumentUpdateError) {
        return {
            id: -1,
            reply: interface_status.userUpdateError,
        }
    }

    return {
        id: -1,
        reply: interface_status.success,
        data: {
            chatId: newChatId
        }
    }
}
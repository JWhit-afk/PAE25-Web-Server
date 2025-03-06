import { interface_status, interface_result } from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { DBResult, get_chat_document, get_message_document } from "../../database"

/**
 * Returns the chat strings of the chatID requested
 * @param data - data.chatID (DB objectID)
 * @returns data.prompts (string) data.replies (string)
 */
export const get_chat_log_handler = async (data: any) => {
    let response = {reply: interface_status.failure}
    let chatDocument = await get_chat_document(data.chatID)
    
    if (chatDocument == DBResult.DBRecordNotFound) {
        return response
    } 

    let prompts: string[] = []
    let replies: string[] = []

    for (let id of chatDocument.promptIds) {
        let messageDocument = await get_message_document(id)
        if (messageDocument == DBResult.DBRecordNotFound) {
            return response
        }
        prompts.push(messageDocument.content)
    }
    for (let id of chatDocument.replyIds) {
        let messageDocument = await get_message_document(id)
        if (messageDocument == DBResult.DBRecordNotFound) {
            return response
        }
        replies.push(messageDocument.content)
    }

    return {
        id: -1,
        reply: interface_status.success,
        data: {
            prompts: prompts,
            replies: replies
        }
    }
}
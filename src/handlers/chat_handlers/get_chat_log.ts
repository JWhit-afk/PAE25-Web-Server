import { interface_status, interface_result } from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { DBResult, get_chat_document } from "../../database"

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

    // get the chat log minus the system prompt
    chatDocument.chatLog.shift()
    let chatLog = chatDocument.chatLog

    let prompts: string[] = []
    let replies: string[] = []

    let n = 0
    for (let message of chatLog) {
        if (n % 2 == 0) {
            // then its a prompt
            console.log(message)
            prompts.push(message.content)
        } else {
            // then its a reply
            console.log(message)
            replies.push(message.content)
        }
        n++
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
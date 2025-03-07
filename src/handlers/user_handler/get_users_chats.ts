import {interface_status, interface_result} from "../../../../PAE25-Web-Server-Interface/shared_interface"
import { DBResult, get_chat_document, get_user_document } from "../../database"
/**
 * Gets the array of the users open chats
 * @param data - data.username (string)
 * @returns data.chatIds (array[objectIds]), names (str[])
 */
export const get_user_chats_handler = async (data: any) => {
    
    // get doc by username
    let userDocument = await get_user_document(data.username)

    // simple existence check
    if (userDocument == DBResult.DBUserNotFound) {
        return {
            id: -1,
            reply: interface_status.userNotFound
        }
    }

    let names:string[] = []
    // get the names of the chats
    for (let chatID of userDocument.chats) {
        let chatDoc = await get_chat_document(chatID)
        if (chatDoc == DBResult.DBRecordNotFound) {
            return {
                id: -1,
                reply: interface_status.error
            }
        } else {
            names.push(chatDoc.name)
        }
    }

    return {
        id: -1,
        reply: interface_status.success,
        data: {
            names: names,
            chatIds: userDocument.chats
        }
    }
}
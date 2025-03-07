import {interface_status, interface_result} from "../../../PAE25-Web-Server-Interface/shared_interface"
/**
 * XYZ does ZXY
 * @param data - data.1 (type) ... data.n (type)
 * @returns data.1 (type) ... data.n (type)
 */
export const EXAMPLE_handler = async (data: any) => {
    let response = {id: -1, reply: interface_status.failure}
    // ....


    return response
}
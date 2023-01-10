import {Method} from "./Method";

export class Endpoint {

    title?: string
    version?: string
    path?: string
    description?: string

    summary?: string
    methods?: Method[] = []

}

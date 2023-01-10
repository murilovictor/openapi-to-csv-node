import {Field} from "./Field";
import {StatusCode} from "./StatusCode";

export class Method {

    method?: string
    description?: string
    summary?: string
    status?: StatusCode[] = []

}

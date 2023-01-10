import {Field} from "../model/Field";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import {Endpoint} from "../model/Endpoint";
import {Method} from "../model/Method";
import jsonpath from "jsonpath";
import {StatusCode} from "../model/StatusCode";

export class OpenapiService {

    async processOpenapi(body: any, openapiService: OpenapiService, onlyRequired: any,
                         statusCodeExport: string[]) {
        let schema: any = await $RefParser.dereference(body)
        let paths = schema.paths;
        let info = schema.info;

        let endpoints: Endpoint[] = []

        for (const [pathKey, pathValue] of Object.entries(paths)) {

            let endpoint: Endpoint = new Endpoint()
            endpoint.path = pathKey

            for (const [methodKey, methodValue] of Object.entries(pathValue)) {
                let responses = methodValue.responses;

                endpoint.description = methodValue.description
                endpoint.summary = methodValue.summary
                endpoint.title = info.title
                endpoint.version = info.version

                let method: Method = new Method()
                method.method = methodKey
                method.description = methodValue.description
                method.summary = methodValue.summary

                for (const [responseKey, responseValue] of Object.entries(responses)) {
                    let statusCode: StatusCode = new StatusCode()
                    statusCode.status = responseKey
                    // @ts-ignore
                    statusCode.description = responseValue?.description

                    if (statusCodeExport.includes(responseKey)) {
                        await walkingSchema(responseValue)
                            .then(fields => {
                                if (fields.length > 0) {
                                    if (onlyRequired == 'true') {
                                        statusCode.fields = fields
                                            .filter(value => value.required == true)
                                    } else {
                                        statusCode.fields = fields
                                    }
                                    method.status.push(statusCode)
                                } else {
                                    console.log('deu ruim')
                                }


                            }, reason => console.error(reason))
                    } else {
                        console.warn(`Status Code ['${responseKey}'] not in [${statusCodeExport}]`)
                    }

                }
                endpoint.methods.push(method)
                endpoints.push(endpoint)
            }

        }
        return endpoints;
    }

}

async function walkingSchema(responseValue): Promise<Field[]> {
    let schema = jsonpath.query(responseValue, '$..schema')[0]

    if (schema) {
        console.log(responseValue)
        return await walking(schema, '')
    } else {
        console.log('No body. ', responseValue)
        return Promise.all([{
            fieldName: 'no body',
            currentPath: 'no body'
        }])
    }
}

async function walking(schema: any, currentPath: string, fields: Field[] = [], requiredFields?: Set<string>) {
    let objectType = schema.type

    if (objectType == 'array') {
        await walking(schema.items, `${currentPath}[0]`, fields, new Set<string>(schema.required))
    } else if (objectType == 'object') {
        let properties = schema.properties
        for (const [key, value] of Object.entries(properties)) {
            await walking(value, `${currentPath}.${key}`, fields, new Set<string>(schema.required))
        }
    } else {
        let arr = currentPath.split('.');
        let fieldName = arr[arr.length - 1];
        fields.push({
            fieldName: fieldName,
            currentPath: currentPath,
            type: schema.type,
            description: schema.description,
            maxLength: schema.maxLength,
            minLength: schema.minLength,
            required: requiredFields ? requiredFields.has(fieldName) : false,
            pattern: schema.pattern,
            example: schema.example,
            enum: schema.enum,
            format: schema.format
        })
    }
    return fields;
}

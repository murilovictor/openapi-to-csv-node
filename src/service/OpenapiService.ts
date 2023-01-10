import {Field} from "../model/Field";
import $RefParser from "@apidevtools/json-schema-ref-parser";
import {Endpoint} from "../model/Endpoint";
import {Method} from "../model/Method";
import {CsvTemplate} from "../model/CsvTemplate";
import fs from "fs";
import * as csv from "fast-csv";

export class OpenapiService {
    async walking(schema: any): Promise<Field[]> {
        return await walking(schema, '')
    }

    async processOpenapi(body: any, openapiService: OpenapiService, onlyRequired: any) {
        let schema: any = await $RefParser.dereference(body)
        let paths = schema.paths;
        let info = schema.info;

        let endpoints: Endpoint[] = []

        for (let pathKey in paths) {
            let pathValue = paths[pathKey];

            for (let methodKey in pathValue) {
                let methodValue = pathValue[methodKey]
                let responses = methodValue.responses;


                let endpoint: Endpoint = new Endpoint()
                endpoint.path = pathKey
                endpoint.description = methodValue.description
                endpoint.summary = methodValue.summary
                endpoint.title = info.title
                endpoint.version = info.version

                let method: Method = new Method()
                method.method = methodKey
                method.description = methodValue.description
                method.summary = methodValue.summary

                for (let responseKey in responses) {
                    let responseValue = responses[responseKey]

                    if (responseKey == '200' || responseKey == '201') {

                        let schemaChild = responseValue.content['application/json'].schema

                        await openapiService.walking(schemaChild)
                            .then(fields => {
                                if (onlyRequired == 'true') {
                                    method.fields = fields
                                        .filter(value => value.required == true)
                                } else {
                                    method.fields = fields
                                }
                            }, reason => console.error(reason))

                        console.log(responseValue)
                        // @ts-ignore
                        endpoint.methods.push(method)
                    } else {
                        console.log('Status Code [' + responseKey + '] not in [200, 201]')
                    }

                }

                endpoints.push(endpoint)
            }

        }
        return endpoints;
    }

    exportToCsv(endpoints: Endpoint[], exportToCsvFlag: any, title: string, version: string) {

        let csvTemplates: CsvTemplate[] = []

        endpoints.forEach(endpoint => {
            endpoint.methods?.forEach(method => {
                method.fields?.forEach(field => {
                    csvTemplates.push({
                        title: endpoint.title,
                        version: endpoint.version,
                        path: endpoint.path,

                        method: method.method,
                        descriptionEndpoint: method.description,
                        summaryEndpoint: method.summary,

                        fieldName: field.fieldName,
                        currentPath: field.currentPath,
                        descriptionField: field.description,
                        example: field.example,
                        required: field.required ? 'SIM' : 'NÃO',
                        exampleModel: field.enum?.join(', ')
                    })
                })
            })

        })

        const stream = fs.createWriteStream(`out/${title} - ${version} - ${new Date().getTime()}.csv`);

        csv
            .write(csvTemplates, {headers: true})
            .pipe(stream)
            .on('finish', () => {
                console.log('Data written to CSV file');
            });
    }

}

const walking = async (schema: any, currentPath: string, fields: Field[] = [], requiredFields?: Set<string>) => {
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

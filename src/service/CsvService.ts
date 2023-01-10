import {Endpoint} from "../model/Endpoint";
import {CsvTemplate} from "../model/CsvTemplate";
import fs from "fs";
import * as csv from "fast-csv";

export class CsvService {

    exportToCsv(endpoints: Endpoint[], exportToCsvFlag: any, title: string, version: string) {

        let csvTemplates: CsvTemplate[] = []

        endpoints.forEach(endpoint => {
            endpoint.methods?.forEach(method => {
                method.status.forEach(statusCode => {
                    statusCode.fields?.forEach(field => {
                        csvTemplates.push({
                            title: normalize(endpoint.title),
                            version: endpoint.version,
                            path: endpoint.path,

                            method: method.method + ' - ' + statusCode.status,
                            descriptionEndpoint: normalize(method.description),
                            summaryEndpoint: normalize(method.summary),

                            fieldName: field.fieldName,
                            currentPath: field.currentPath,
                            descriptionField: normalize(field.description),
                            example: normalize(field.example),
                            required: field.required ? 'SIM' : 'NÃO',
                            exampleModel: field.enum?.join(', ')
                        })
                    })
                })
            })
        })

        const stream = fs.createWriteStream(`out/${title} - ${version} - ${new Date().getTime()}.csv`);

        csv
            .write(csvTemplates.sort(sortByPath), {
                headers: true,
                delimiter: ';',
                includeEndRowDelimiter: true
            })
            .pipe(stream)
            .on('finish', () => {
                console.log('Data written to CSV file');
            });
    }

}

const sortByPath = (a, b) => parseFloat(b.path) - parseFloat(a.path)

const normalize = (str: any) => {
    if (str) {
        return str.toString().replace(/\n/g, '')
    }

    return ''
}

import {Request, Response} from "express";
import {OpenapiService} from "../service/OpenapiService";
import {CsvService} from "../service/CsvService";

import fs from "fs";
import path from "path";

class OpenapiController {
    async handle(request: Request, response: Response) {
        let openapiService = new OpenapiService()
        let csvService = new CsvService()

        let body: any = request.body;
        let title: any = request.body.tags[0].name;
        let version: any = request.body.info.version;
        let onlyRequired: any = request.query.onlyRequired || 'false'
        let exportToCsvFlag: any = request.query.exportToCsv || 'false'
        let statusCodeExport: string[] = request.query.statusCodeExport?.toString().split(',').map(value => value.toString().trim()) || ['200']

        let endpoints = await openapiService.processOpenapi(body, openapiService, onlyRequired, statusCodeExport);

        if (exportToCsvFlag == 'true') {
            csvService.exportToCsv(endpoints, title, version);
        }

        response.status(200).json(endpoints)
    }


    async processFiles(request: Request, response: Response) {

        const dirPath = request.query.dirPath as string
        const onlyRequired: any = request.query.onlyRequired || 'false'
        const statusCodeExport: string[] = request.query.statusCodeExport?.toString().split(',').map(value => value.toString().trim()) || ['200']

        let openapiService = new OpenapiService()
        let csvService = new CsvService()

        const files = fs.readdirSync(dirPath);

        for (const file of files) {
            const jsonObject = JSON.parse(fs.readFileSync(path.join(dirPath, file), 'utf8'));

            let title: any = jsonObject.tags[0].name;
            let version: any = jsonObject.info.version;

            let endpoints = await openapiService.processOpenapi(jsonObject, openapiService, onlyRequired, statusCodeExport);

            csvService.exportToCsv(endpoints, title, version);

        }
        response.json({"status": `${files.length} successfully processed files`})
    }
}

export {OpenapiController};

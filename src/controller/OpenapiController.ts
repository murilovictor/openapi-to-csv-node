import {Request, Response} from "express";
import {OpenapiService} from "../service/OpenapiService";
import {CsvService} from "../service/CsvService";

class OpenapiController {
    async handle(request: Request, response: Response) {
        let openapiService = new OpenapiService()
        let csvService = new CsvService()

        let body: any = request.body;
        let title: any = request.body.info.title;
        let version: any = request.body.info.version;
        let onlyRequired: any = request.query.onlyRequired || 'false'
        let exportToCsvFlag: any = request.query.exportToCsv || 'false'
        let statusCodeExport: string[] = request.query.statusCodeExport?.toString().split(',').map(value => value.toString().trim()) || ['200']

        let endpoints = await openapiService.processOpenapi(body, openapiService, onlyRequired, statusCodeExport);

        if (exportToCsvFlag == 'true') {
            csvService.exportToCsv(endpoints, exportToCsvFlag, title, version);
        }

        response.status(200).json(endpoints)
    }
}

export {OpenapiController};

import {Request, Response} from "express";
import {OpenapiService} from "../service/OpenapiService";

class OpenapiController {
    async handle(request: Request, response: Response) {
        let openapiService = new OpenapiService()

        let body: any = request.body;
        let title: any = request.body.info.title;
        let version: any = request.body.info.version;
        let onlyRequired: any = request.query.onlyRequired || 'false'
        let exportToCsvFlag: any = request.query.exportToCsv || 'false'

        let endpoints = await openapiService.processOpenapi(body, openapiService, onlyRequired);

        if (exportToCsvFlag == 'true') {
            openapiService.exportToCsv(endpoints, exportToCsvFlag, title, version);
        }

        response.status(200).json(endpoints)
    }
}

export {OpenapiController};

import {Router} from "express";
import {OpenapiController} from "./controller/OpenapiController";

const router = Router();

const openapiController = new OpenapiController();

router.post("/openapi/toCsv", openapiController.handle);
router.get("/openapi/convertFromPath", openapiController.processFiles);

export {router};

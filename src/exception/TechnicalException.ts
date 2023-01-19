export class TechnicalException extends Error{
    constructor(args: any){
        super(args);
        this.name = "TechnicalException"
    }
}

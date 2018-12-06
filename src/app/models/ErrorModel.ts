export class ErrorModel {
    description: string;
    errorCode: string;

    static fromResponse(resp: any): ErrorModel {
        let model = new ErrorModel();
        model.description = resp.error.description;
        model.errorCode = resp.error.err_code;
        return model;
    }
}
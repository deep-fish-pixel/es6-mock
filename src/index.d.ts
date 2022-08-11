interface Es6MockParams {
    dir: string
    path: string
    app: object
    hotServer: object
}
interface Validate {
    // Validate param header
    header: any,
    // Validate param required、 type or format
    param: any,
    // Validate request method post|get|put|delete
    method: string
}

declare function es6Mock(config: Es6MockParams): (request: any, response: any, next: () => any) => any;
export default es6Mock;
export function delay(time: number): void;
export function validate(validates: Validate): boolean;
export const request: any;
export const response: any;
export function getRequest(): any;
export function getResponse(): any;


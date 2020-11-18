export type DIDUrl = string;

export type ParsedDIDUrl = {
    methodName: string;
    methodSpecificId: string;
    urlPath?: Array<string>;
    query?: Record<string, any>;
    fragment?: string;
};

export type DIDUrl = string;

export type ParsedDIDUrl = {
    methodName?: string;
    methodSpecificId?: string;
    urlPath?: string;
    query?: Record<string, any>;
    fragment?: string;
};

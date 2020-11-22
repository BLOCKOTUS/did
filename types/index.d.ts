export type DIDUrl = string;

export type ParsedDIDUrl = {
    methodName: string;
    methodSpecificId: string;
    urlPath?: Array<string>;
    query?: Record<string, any>;
    fragment?: string;
};

type VerificationMethodBase = {
    id: string;
    type: string;
    controller: string;
};

type PublicKeyBase = {
    id: string;
    type: string;
    controller: string;
};

export type VerificationMethod = VerificationMethodBase;

export type Service = {
    id: string;
    type: string;
    serviceEndpoint: string;
};

export type PublicKey = PublicKeyBase;

export type DidDocument = {
    '@context': string;
    id: string;
    controller?: string;
    verificationMethod?: Array<VerificationMethod>;
    publicKey?: Array<PublicKey>;
    serivce?: Array<Service>;
};
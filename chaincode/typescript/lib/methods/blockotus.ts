import type { Context } from 'fabric-contract-api';
import type { ParsedDIDUrl } from "../../../../types";

/**
 * Entry point of the method. 
 * Invoke a service.
 */
export const blockotus = async (ctx: Context, parsedDidUrl: ParsedDIDUrl) => {
  // split the methodSpecificId by `:`
  const methodSpecificIdSpitted = parsedDidUrl.methodSpecificId.split(':');

  // extract the organ - he is named at the first position (job:jlskj7s78s979-8asdasdf-asd::sdfsdf) => job
  const organ = methodSpecificIdSpitted[0];
  methodSpecificIdSpitted.shift();

  // construct the organSpecificId - refering to an en entry of a specific organ
  const organSpecificId = methodSpecificIdSpitted.join(':');

  // construct the subject of the DID request
  const subject = { organ, organSpecificId };

  // get the service from the query parameter
  // the design choice is to have one service per organ
  const service = parsedDidUrl.query.service;
  if (!service) { throw new Error('Service parameter is required.'); }

  return requestService({ ctx, service, subject, parsedDidUrl });
}

/**
 * Invoke the service / organ.
 */
const requestService = async (
  {
    ctx,
    service,
    subject,
    parsedDidUrl,
  }: {
    ctx: Context,
    service: string,
    subject: { organ: string, organSpecificId: string },
    parsedDidUrl: ParsedDIDUrl,
  }): Promise<string> => {
  const rawDidRequest = await ctx.stub.invokeChaincode(service, ['didRequest', JSON.stringify(subject), JSON.stringify(parsedDidUrl)], 'mychannel');
  if (rawDidRequest.status !== 200) { throw new Error(rawDidRequest.message); }
  return rawDidRequest.payload.toString();
}

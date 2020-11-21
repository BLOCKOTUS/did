import type { ParsedDIDUrl } from "../../../../types";

export const blockotus = async (parsedDidUrl: ParsedDIDUrl) => {
  // split the methodSpecificId by `-`
  const methodSpecificIdSpitted = parsedDidUrl.methodSpecificId.split(':');

  // extract the organ - he is named at the first position (job-jlskj7s78s979-8asdasdf-asd::sdfsdf) => job
  const organ = methodSpecificIdSpitted[0];
  methodSpecificIdSpitted.shift();

  // construct the organSpecificId - refering to an en entry of a specific organ
  const organSpecificId = methodSpecificIdSpitted.join(':');

  console.log('BLOCKOTUS', JSON.stringify(parsedDidUrl));
  console.log('organ', organ);
  console.log('organSpecificId', organSpecificId);
}
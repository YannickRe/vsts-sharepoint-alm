import { ISpAlmOptions } from "../../sp-alm";
import * as spauth from 'node-sp-auth';
import * as rm from 'typed-rest-client/RestClient';
import * as authHelper from "../utils/authHelper";
import { IAppInfo } from "../utils/IAppInfo";

export async function add(spAlmOptions: ISpAlmOptions, fileName: string, fileContents: Buffer, overwriteExisting: boolean): Promise<any> {
    try {
        if (!fileName) {
            throw new Error("fileName argument is required");
        }
        if (!fileContents) {
            throw new Error("fileContents argument is required");
        }

        let authResponse = await authHelper.getAuth(spAlmOptions);
        let client = new rm.RestClient("vsts-sharepointalm");
        authResponse.requestOptions.additionalHeaders["binaryStringRequestBody"] = true;

        let result = await client.create(`${spAlmOptions.spSiteUrl}/_api/web/tenantappcatalog/AvailableApps/Add(overwrite=${overwriteExisting}, url='${fileName}')`, fileContents, authResponse.requestOptions);    
        if (result.statusCode !== 200 || result.result["odata.error"]) {
            throw new Error(`Action 'Add' failed on package '${fileName}'. StatusCode: ${result.statusCode}. Result: ${result.result}. @odata.error: ${result.result["odata.error"]}.`);
        }
    } catch(e) {
        if (e instanceof Error)
        {
            throw e.message;
        }
    }
}
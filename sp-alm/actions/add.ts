import { ISpAlmOptions } from "../../sp-alm";
import * as spauth from 'node-sp-auth';
import * as authHelper from "../utils/authHelper";
import { IAppInfo } from "../utils/IAppInfo";
import { IAddedAppInfo } from "../utils/IAddedAppInfo";
import * as rp from 'request-promise';
import { RequestResponse } from "../utils/RequestResponse";

export async function add(spAlmOptions: ISpAlmOptions, fileName: string, fileContents: Buffer, overwriteExisting: boolean): Promise<IAddedAppInfo> {
    try {
        if (!fileName) {
            throw new Error("fileName argument is required");
        }
        if (!fileContents) {
            throw new Error("fileContents argument is required");
        }

        let authResponse = await authHelper.getAuth(spAlmOptions);
        authResponse.requestOptions.additionalHeaders["binaryStringRequestBody"] = true;

        let apiUrl = `${spAlmOptions.spSiteUrl}/_api/web/tenantappcatalog/Add(overwrite=${overwriteExisting}, url='${fileName}')`;
        let headers = authResponse.requestOptions.additionalHeaders;

        let result = <RequestResponse>(await rp.post(apiUrl, { headers, body: fileContents, resolveWithFullResponse: true }));
        if (result.statusCode !== 200) {
            throw new Error(`Action 'Add' failed on package '${fileName}'. StatusCode: ${result.statusMessage}.`);
        }
        return <IAddedAppInfo>JSON.parse(result.body);
    } catch(e) {
        if (e instanceof Error)
        {
            throw e.message;
        }
    }
}
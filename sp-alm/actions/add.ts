import { ISpAlmOptions } from "../../sp-alm";
import * as spauth from 'node-sp-auth';
import * as authHelper from "../utils/authHelper";
import * as rp from 'request-promise-native';
import { IResponse, IAddedAppInfo } from "../utils";

export async function add(spAlmOptions: ISpAlmOptions, fileName: string, fileContents: Buffer, overwriteExisting: boolean): Promise<IAddedAppInfo> {
    try {
        if (!fileName) {
            throw new Error("fileName argument is required");
        }
        if (!fileContents) {
            throw new Error("fileContents argument is required");
        }

        let authResponse = await authHelper.getAuth(spAlmOptions);
        authResponse["binaryStringRequestBody"] = true;
        let apiUrl = `${spAlmOptions.spSiteUrl}/_api/web/tenantappcatalog/Add(overwrite=${overwriteExisting}, url='${fileName}')`;
        let result = (await rp.post(apiUrl, { headers: authResponse, body: fileContents, resolveWithFullResponse: true })) as IResponse;
        if (result.statusCode !== 200) {
            throw new Error(`Action 'Add' failed on package '${fileName}'. StatusCode: ${result.statusMessage}.`);
        }
        return JSON.parse(result.body) as IAddedAppInfo;
    } catch(e) {
        if (e instanceof Error)
        {
            throw e.message;
        }
    }
}
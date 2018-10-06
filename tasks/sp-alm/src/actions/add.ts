import { post } from 'request-promise-native';
import { RequestResponse } from "request";
import { IAddedAppInfo } from "../IAddedAppInfo";
import { ISpAlmOptions } from "../ISpAlmOptions";
import { getAuth } from "../authHelper";

export async function add(spAlmOptions: ISpAlmOptions, fileName: string, fileContents: Buffer, overwriteExisting: boolean, useTenantCatalog: boolean): Promise<IAddedAppInfo> {
    if (!fileName) {
        throw new Error("fileName argument is required");
    }
    if (!fileContents) {
        throw new Error("fileContents argument is required");
    }
    let authResponse = await getAuth(spAlmOptions);
    authResponse["binaryStringRequestBody"] = true;
    let apiUrl = `${spAlmOptions.spSiteUrl}/_api/web/${useTenantCatalog ? 'tenantappcatalog' : 'sitecollectionappcatalog'}/Add(overwrite=${overwriteExisting}, url='${fileName}')`;
    let result:RequestResponse = await post(apiUrl, { headers: authResponse, body: fileContents, resolveWithFullResponse: true, simple: false });
    if (result.statusCode !== 200) {
        throw new Error(`Action 'Add' failed for package '${fileName}' on url '${spAlmOptions.spSiteUrl}'. StatusCode: ${result.statusMessage}.`);
    }
    return JSON.parse(result.body) as IAddedAppInfo;
}
import { ISpAlmOptions } from "../../sp-alm";
import * as spauth from 'node-sp-auth';
import * as authHelper from "../utils/authHelper";
import * as rp from 'request-promise-native';
import { RequestResponse } from "request";

export async function deploy(spAlmOptions: ISpAlmOptions, packageId:string, skipFeatureDeployment:boolean): Promise<void> {
    if (!packageId) {
        throw new Error("packageId argument is required");
    }

    let authResponse = await authHelper.getAuth(spAlmOptions);
    let apiUrl = `${spAlmOptions.spSiteUrl}/_api/web/tenantappcatalog/AvailableApps/GetById('${packageId}')/Deploy`;
    let result:RequestResponse = await rp.post(apiUrl, { headers: authResponse, body: JSON.stringify({ "skipFeatureDeployment": skipFeatureDeployment }), resolveWithFullResponse: true, simple: false });
    if (result.statusCode !== 200) {
        throw new Error(`Action 'Deploy' failed for package '${packageId}' on url '${spAlmOptions.spSiteUrl}'. StatusCode: ${result.statusCode}. Result: ${result.statusMessage}.`);
    }
}
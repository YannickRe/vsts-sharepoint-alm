import { ISpAlmOptions } from "../../sp-alm";
import * as spauth from 'node-sp-auth';
import * as authHelper from "../utils/authHelper";
import { IAppInfo } from "../utils/IAppInfo";
import * as rp from 'request-promise-native';
import { RequestResponse } from "request";

export async function uninstall(spAlmOptions: ISpAlmOptions, packageId:string): Promise<void> {
    if (!packageId) {
        throw new Error("packageId argument is required");
    }

    let authResponse = await authHelper.getAuth(spAlmOptions);
    let apiUrl = `${spAlmOptions.spSiteUrl}/_api/web/tenantappcatalog/AvailableApps/GetById('${packageId}')/Uninstall`;
    let result:RequestResponse = await rp.post(apiUrl, { headers: authResponse, resolveWithFullResponse: true, simple: false });       
    if (result.statusCode !== 200) {
        throw new Error(`Action 'Uninstall' failed for package '${packageId}' on url '${spAlmOptions.spSiteUrl}'. StatusCode: ${result.statusCode}. Result: ${result.statusMessage}.`);
    }
}
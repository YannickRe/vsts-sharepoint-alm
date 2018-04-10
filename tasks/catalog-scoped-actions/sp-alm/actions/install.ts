import { ISpAlmOptions } from "../../sp-alm";
import * as spauth from 'node-sp-auth';
import * as authHelper from "../utils/authHelper";
import { IAppInfo } from "../utils/IAppInfo";
import * as rp from 'request-promise-native';
import { RequestResponse } from "request";

export async function install(spAlmOptions: ISpAlmOptions, packageId:string, useTenantCatalog: boolean): Promise<void> {
    if (!packageId) {
        throw new Error("packageId argument is required");
    }

    let authResponse = await authHelper.getAuth(spAlmOptions);
    let apiUrl = `${spAlmOptions.spSiteUrl}/_api/web/${useTenantCatalog ? 'tenantappcatalog' : 'sitecollectionappcatalog'}/AvailableApps/GetById('${packageId}')/Install`;
    let result:RequestResponse = await rp.post(apiUrl, { headers: authResponse, resolveWithFullResponse: true, simple: false });       
    if (result.statusCode !== 200) {
        throw new Error(`Action 'Install' failed for package '${packageId}' on url '${spAlmOptions.spSiteUrl}'. StatusCode: ${result.statusCode}. Result: ${result.statusMessage}.`);
    }
}
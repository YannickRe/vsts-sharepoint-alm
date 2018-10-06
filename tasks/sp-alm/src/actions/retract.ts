import { ISpAlmOptions } from "../ISpAlmOptions";
import { getAuth } from "../authHelper";
import { post } from 'request-promise-native';
import { RequestResponse } from "request";

export async function retract(spAlmOptions: ISpAlmOptions, packageId:string, useTenantCatalog: boolean): Promise<void> {
    if (!packageId) {
        throw new Error("packageId argument is required");
    }

    let authResponse = await getAuth(spAlmOptions);
    let apiUrl = `${spAlmOptions.spSiteUrl}/_api/web/${useTenantCatalog ? 'tenantappcatalog' : 'sitecollectionappcatalog'}/AvailableApps/GetById('${packageId}')/Retract`;
    let result:RequestResponse = await post(apiUrl, { headers: authResponse, resolveWithFullResponse: true, simple: false });       
    if (result.statusCode !== 200) {
        throw new Error(`Action 'Retract' failed for package '${packageId}' on url '${spAlmOptions.spSiteUrl}'. StatusCode: ${result.statusCode}. Result: ${result.statusMessage}.`);
    }
}
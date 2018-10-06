import { post } from 'request-promise-native';
import { RequestResponse } from "request";
import { ISpAlmOptions } from "../ISpAlmOptions";
import { getAuth } from "../authHelper";

export async function deploy(spAlmOptions: ISpAlmOptions, packageId:string, skipFeatureDeployment:boolean, useTenantCatalog: boolean): Promise<void> {
    if (!packageId) {
        throw new Error("packageId argument is required");
    }

    let authResponse = await getAuth(spAlmOptions);
    let apiUrl = `${spAlmOptions.spSiteUrl}/_api/web/${useTenantCatalog ? 'tenantappcatalog' : 'sitecollectionappcatalog'}/AvailableApps/GetById('${packageId}')/Deploy`;
    let result:RequestResponse = await post(apiUrl, { headers: authResponse, body: JSON.stringify({ "skipFeatureDeployment": skipFeatureDeployment }), resolveWithFullResponse: true, simple: false });
    if (result.statusCode !== 200) {
        throw new Error(`Action 'Deploy' failed for package '${packageId}' on url '${spAlmOptions.spSiteUrl}'. StatusCode: ${result.statusCode}. Result: ${result.statusMessage}.`);
    }
}
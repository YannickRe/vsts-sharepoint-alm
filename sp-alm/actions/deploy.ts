import { ISpAlmOptions } from "../../sp-alm";
import * as spauth from 'node-sp-auth';
import * as authHelper from "../utils/authHelper";
import * as rp from 'request-promise-native';
import { IResponse } from "../utils";

export async function deploy(spAlmOptions: ISpAlmOptions, packageId:string, skipFeatureDeployment:boolean): Promise<void> {
    try {
        if (!packageId) {
            throw new Error("packageId argument is required");
        }

        let authResponse = await authHelper.getAuth(spAlmOptions);
        let apiUrl = `${spAlmOptions.spSiteUrl}/_api/web/tenantappcatalog/AvailableApps/GetById('${packageId}')/Deploy`;
        let result = (await rp.post(apiUrl, { headers: authResponse, body: JSON.stringify({ "skipFeatureDeployment": skipFeatureDeployment }), resolveWithFullResponse: true })) as IResponse;
        if (result.statusCode !== 200) {
            throw new Error(`Action 'Deploy' failed on package '${packageId}'. StatusCode: ${result.statusCode}. Result: ${result.statusMessage}.`);
        }
    } catch(e) {
        if (e instanceof Error)
        {
            throw e.message;
        }
    }
}
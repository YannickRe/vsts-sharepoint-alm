import { ISpAlmOptions } from "../../sp-alm";
import * as spauth from 'node-sp-auth';
import * as authHelper from "../utils/authHelper";
import { IAppInfo } from "../utils/IAppInfo";
import * as rp from 'request-promise-native';
import { IResponse } from "../utils";

export async function install(spAlmOptions: ISpAlmOptions, packageId:string): Promise<void> {
    try {
        if (!packageId) {
            throw new Error("packageId argument is required");
        }

        let authResponse = await authHelper.getAuth(spAlmOptions);
        let apiUrl = `${spAlmOptions.spSiteUrl}/_api/web/tenantappcatalog/AvailableApps/GetById('${packageId}')/Install`;
        let result = (await rp.post(apiUrl, { headers: authResponse, resolveWithFullResponse: true })) as IResponse;       
        if (result.statusCode !== 200) {
            throw new Error(`Action 'Install' failed on package '${packageId}'. StatusCode: ${result.statusCode}. Result: ${result.statusMessage}.`);
        }
    } catch(e) {
        if (e instanceof Error)
        {
            throw e.message;
        }
    }
}
import { ISpAlmOptions } from "../../sp-alm";
import * as spauth from 'node-sp-auth';
import * as rm from 'typed-rest-client/RestClient';
import * as authHelper from "../utils/authHelper";
import { IAppInfo } from "../utils/IAppInfo";

export async function deploy(spAlmOptions: ISpAlmOptions, packageId:string, skipFeatureDeployment:boolean): Promise<void> {
    try {
        if (!packageId) {
            throw new Error("packageId argument is required");
        }

        let authResponse = await authHelper.getAuth(spAlmOptions);
        let client = new rm.RestClient("vsts-sharepointalm");
        let result = await client.create(`${spAlmOptions.spSiteUrl}/_api/web/tenantappcatalog/AvailableApps/GetById('${packageId}')/Deploy`, { "skipFeatureDeployment": skipFeatureDeployment }, authResponse.requestOptions);    
        if (result.statusCode !== 200 || result.result["odata.error"]) {
            throw new Error(`Action 'Deploy' failed on package '${packageId}'. StatusCode: ${result.statusCode}. Result: ${result.result}. @odata.error: ${result.result["odata.error"]}.`);
        }
    } catch(e) {
        if (e instanceof Error)
        {
            throw e.message;
        }
    }
}
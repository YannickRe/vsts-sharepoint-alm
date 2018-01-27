import { ISpAlmOptions } from "../index";
import * as spauth from 'node-sp-auth';
import { IAuthResponse } from "node-sp-auth";
import * as rp from 'request-promise-native';
import { IResponse, IHeaders, IFormDigestValue } from "../utils";

export async function getAuth(spAlmOptions: ISpAlmOptions) : Promise<IHeaders>
{
    let authResult = await spauth.getAuth(spAlmOptions.spSiteUrl, {
        username: spAlmOptions.spUsername,
        password: spAlmOptions.spPassword
    });
    let headers = authResult.headers;
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json';

    let formDigestValue = await _getRequestDigestValue(spAlmOptions.spSiteUrl, headers);
    headers["X-RequestDigest"] = formDigestValue;

    return headers;
}

async function _getRequestDigestValue(spSiteUrl:string, headers:IHeaders): Promise<string> {
    let apiUrl = `${spSiteUrl}/_api/contextinfo?$select=FormDigestValue`;
    let result = (await rp.post(apiUrl, { headers: headers, resolveWithFullResponse: true })) as IResponse;
    if (result.statusCode !== 200) {
        throw new Error(`GetDigestValue failed. StatusCode: ${result.statusCode}. Result: ${result.statusMessage}.`);
    }
    let responseObject = JSON.parse(result.body) as IFormDigestValue;
    return responseObject.FormDigestValue;
}
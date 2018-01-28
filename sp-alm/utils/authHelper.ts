import { ISpAlmOptions } from "../index";
import * as spauth from 'node-sp-auth';
import { IAuthResponse } from "node-sp-auth";
import * as rp from 'request-promise-native';
import { IFormDigestValue } from "../utils";
import { Headers, RequestResponse } from 'request';

export async function getAuth(spAlmOptions: ISpAlmOptions) : Promise<Headers>
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

async function _getRequestDigestValue(spSiteUrl:string, headers:Headers): Promise<string> {
    let apiUrl = `${spSiteUrl}/_api/contextinfo?$select=FormDigestValue`;
    let result:RequestResponse = await rp.post(apiUrl, { headers: headers, resolveWithFullResponse: true, simple: false });
    if (result.statusCode !== 200) {
        throw new Error(`GetDigestValue failed. StatusCode: ${result.statusCode}. Result: ${result.statusMessage}.`);
    }
    let responseObject:IFormDigestValue = JSON.parse(result.body);
    return responseObject.FormDigestValue;
}
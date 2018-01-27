import { ISpAlmOptions } from "../index";
import * as spauth from 'node-sp-auth';
import { IAuthResponse } from "node-sp-auth";
import * as rm from 'typed-rest-client/RestClient';
import {IFormDigestValue } from "./IFormDigestValue";

export interface IAuthInfo {
    requestOptions: rm.IRequestOptions;
    options?: {
        [key: string]: any;
    };
}

export async function getAuth(spAlmOptions: ISpAlmOptions) : Promise<IAuthInfo>
{
    let authResult = await spauth.getAuth(spAlmOptions.spSiteUrl, {
        username: spAlmOptions.spUsername,
        password: spAlmOptions.spPassword
    });
    authResult.headers['Accept'] = 'application/json;odata=verbose';
    authResult.headers['Content-Type'] = 'application/json';

    let requestInfo = {
        requestOptions: {
            additionalHeaders: authResult.headers
        },
        options: authResult.options
    };

    let formDigestValue = await _getRequestDigestValue(spAlmOptions.spSiteUrl, requestInfo.requestOptions);
    requestInfo.requestOptions.additionalHeaders["X-RequestDigest"] = formDigestValue;

    return requestInfo;
}

async function _getRequestDigestValue(spSiteUrl:string, requestOptions:rm.IRequestOptions): Promise<string> {
    let client = new rm.RestClient("vsts-sharepointalm");

    let result = await client.create<IFormDigestValue>(`${spSiteUrl}/_api/contextinfo?$select=FormDigestValue`, undefined, requestOptions);    
    if (result.statusCode !== 200 || result.result["odata.error"]) {
        throw new Error(`GetDigestValue failed. StatusCode: ${result.statusCode}. Result: ${result.result}. @odata.error: ${result.result["odata.error"]}.`);
    }

    return result.result.FormDigestValue;
}
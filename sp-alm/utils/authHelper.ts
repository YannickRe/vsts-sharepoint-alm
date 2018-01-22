import { ISpAlmOptions } from "../index";
import * as spauth from 'node-sp-auth';
import { IAuthResponse } from "node-sp-auth";
import * as rm from 'typed-rest-client/RestClient';

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

    return {
        requestOptions: {
            additionalHeaders: authResult.headers
        },
        options: authResult.options
    };
}
import * as spauth from 'node-sp-auth';
import { IAuthOptions, IUserCredentials, IOnlineAddinCredentials } from "node-sp-auth";
import { post } from 'request-promise-native';
import { Headers, RequestResponse } from 'request';
import { getEndpointAuthorizationParameter } from 'vsts-task-lib/task';
import { IFormDigestValue } from "./IFormDigestValue";
import { ISpAlmOptions } from "./ISpAlmOptions";

export async function getAuth(spAlmOptions: ISpAlmOptions) : Promise<Headers>
{
    let authResult = await spauth.getAuth(spAlmOptions.spSiteUrl, spAlmOptions.spAuthOptions);
    let headers = authResult.headers;
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json';

    let formDigestValue = await _getRequestDigestValue(spAlmOptions.spSiteUrl, headers);
    headers["X-RequestDigest"] = formDigestValue;

    return headers;
}

async function _getRequestDigestValue(spSiteUrl:string, headers:Headers): Promise<string> {
    let apiUrl = `${spSiteUrl}/_api/contextinfo?$select=FormDigestValue`;
    let result:RequestResponse = await post(apiUrl, { headers: headers, resolveWithFullResponse: true, simple: false });
    if (result.statusCode !== 200) {
        throw new Error(`GetDigestValue failed. StatusCode: ${result.statusCode}. Result: ${result.statusMessage}.`);
    }
    let responseObject:IFormDigestValue = JSON.parse(result.body);
    return responseObject.FormDigestValue;
}

export function getVstsAuthenticationValues(appCatalogAuthType:string, appCatalogConnection:string): IAuthOptions {
    let authOptions:IAuthOptions;
    if (appCatalogAuthType === "UsernamePassword")
    {
        console.log("Parsing UsernamePassword");
        let appCatalogUsername: string = getEndpointAuthorizationParameter(appCatalogConnection, "username", false);
        let appCatalogPassword: string = getEndpointAuthorizationParameter(appCatalogConnection, "password", false);
        authOptions = <IUserCredentials>{
            username: appCatalogUsername,
            password: appCatalogPassword
        };
        console.log(`Username: ${appCatalogUsername}`);
    }
    else if (appCatalogAuthType === "Token")
    {
        console.log("Parsing Token");
        let appCatalogClientId: string = getEndpointAuthorizationParameter(appCatalogConnection, "clientid", false);
        let appCatalogClientSecret: string = getEndpointAuthorizationParameter(appCatalogConnection, "apitoken", false);
        authOptions = <IOnlineAddinCredentials>{
            clientId: appCatalogClientId,
            clientSecret: appCatalogClientSecret
        };
        console.log(`ClientId: ${appCatalogClientId}`);
    }
    return authOptions;
}

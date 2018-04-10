import * as fs from "fs";
import * as actions from './actions';
import { IAddedAppInfo } from "./utils/IAddedAppInfo";
import { IAuthOptions } from "node-sp-auth";

export interface ISpAlmOptions {
    spSiteUrl: string;
    spAuthOptions: IAuthOptions;
}

export class spAlm {
    private _spAlmOptions: ISpAlmOptions;
    
    public constructor(spAlmOptions: ISpAlmOptions)
    {
        this._spAlmOptions = spAlmOptions;

        if (!this._spAlmOptions.spAuthOptions) {
            throw "spAuthOptions is required";
        }

        if (!this._spAlmOptions.spSiteUrl) {
            throw "SharePoint Site Url is required";
        }
    }

    public async add(fileName: string, fileContents: Buffer, overwriteExisting: boolean, useTenantCatalog: boolean): Promise<IAddedAppInfo> {
        return await actions.add(this._spAlmOptions, fileName, fileContents, overwriteExisting, useTenantCatalog);
    }

    public async deploy(packageId:string, skipFeatureDeployment:boolean, useTenantCatalog: boolean): Promise<void> {
        await actions.deploy(this._spAlmOptions, packageId, skipFeatureDeployment, useTenantCatalog);
    }

    public async retract(packageId:string, useTenantCatalog: boolean): Promise<void> {
        await actions.retract(this._spAlmOptions, packageId, useTenantCatalog);
    }

    public async remove(packageId:string, useTenantCatalog: boolean): Promise<void> {
        await actions.remove(this._spAlmOptions, packageId, useTenantCatalog);
    }

    public async install(packageId:string, overwriteSpSiteUrls:string[], useTenantCatalog: boolean): Promise<void> {
        await this.taskWrapper(packageId, overwriteSpSiteUrls, actions.install, useTenantCatalog);
    }

    public async uninstall(packageId:string, overwriteSpSiteUrls:string[], useTenantCatalog: boolean): Promise<void> {
        await this.taskWrapper(packageId, overwriteSpSiteUrls, actions.uninstall, useTenantCatalog);
    }

    public async upgrade(packageId:string, overwriteSpSiteUrls:string[], useTenantCatalog: boolean): Promise<void> {
        await this.taskWrapper(packageId, overwriteSpSiteUrls, actions.upgrade, useTenantCatalog);
    }

    private async taskWrapper(packageId:string, overwriteSpSiteUrls:string[], action:(spAlmOptions: ISpAlmOptions, packageId:string, useTenantCatalog: boolean) => Promise<void>, useTenantCatalog: boolean): Promise<void> {
        if (overwriteSpSiteUrls.length > 0)
        {
            let errors:string[] = [];
            for (let i = 0; i < overwriteSpSiteUrls.length; i++) { 
                try
                {
                    let spSiteUrl = overwriteSpSiteUrls[i];
                    console.log(`Performing action on ${spSiteUrl}`);
                    let opt = {...this._spAlmOptions};
                    opt.spSiteUrl = spSiteUrl;
                    await action(opt, packageId, useTenantCatalog);
                } catch(e) {
                    if (e instanceof Error)
                    {
                        errors.push(e.message);
                    }
                    else {
                        errors.push(e);
                    }
                }
            }
            if (errors.length > 0)
            {
                throw new Error(errors.join('\n'));
            }
        }
        else
        {
            await action(this._spAlmOptions, packageId, useTenantCatalog);
        }
    }
}
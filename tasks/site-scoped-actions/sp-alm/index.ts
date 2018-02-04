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

    public async add(fileName: string, fileContents: Buffer, overwriteExisting: boolean): Promise<IAddedAppInfo> {
        return await actions.add(this._spAlmOptions, fileName, fileContents, overwriteExisting);
    }

    public async deploy(packageId:string, skipFeatureDeployment:boolean): Promise<void> {
        await actions.deploy(this._spAlmOptions, packageId, skipFeatureDeployment);
    }

    public async retract(packageId:string): Promise<void> {
        await actions.retract(this._spAlmOptions, packageId);
    }

    public async remove(packageId:string): Promise<void> {
        await actions.remove(this._spAlmOptions, packageId);
    }

    public async install(packageId:string, overwriteSpSiteUrls:string[]): Promise<void> {
        await this.taskWrapper(packageId, overwriteSpSiteUrls, actions.install);
    }

    public async uninstall(packageId:string, overwriteSpSiteUrls:string[]): Promise<void> {
        await this.taskWrapper(packageId, overwriteSpSiteUrls, actions.uninstall);
    }

    public async upgrade(packageId:string, overwriteSpSiteUrls:string[]): Promise<void> {
        await this.taskWrapper(packageId, overwriteSpSiteUrls, actions.upgrade);
    }

    private async taskWrapper(packageId:string, overwriteSpSiteUrls:string[], action:(spAlmOptions: ISpAlmOptions, packageId:string) => Promise<void>): Promise<void> {
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
                    await action(opt, packageId);
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
            await action(this._spAlmOptions, packageId);
        }
    }
}
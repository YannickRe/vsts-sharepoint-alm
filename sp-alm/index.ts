import * as fs from "fs";
import * as actions from './actions';
import { IAddedAppInfo } from "./utils/IAddedAppInfo";

export interface ISpAlmOptions {
    spSiteUrl: string;
    spUsername: string;
    spPassword: string;
}

export class spAlm {
    private _spAlmOptions: ISpAlmOptions;
    
    public constructor(spAlmOptions: ISpAlmOptions)
    {
        this._spAlmOptions = spAlmOptions;

        if (!this._spAlmOptions.spUsername) {
            throw "Username is required";
        }

        if (!this._spAlmOptions.spPassword) {
            throw "Password is required";
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
            overwriteSpSiteUrls.forEach(async spSiteUrl => {
                try
                {
                    let opt = this._spAlmOptions;
                    opt.spSiteUrl = spSiteUrl;
                    await action(opt, packageId);
                } catch(e) {
                    if (e instanceof Error)
                    {
                        errors.push(e.message);
                    }
                }
            });

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
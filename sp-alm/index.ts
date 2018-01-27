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

    public async add(fileName: string, fileContents: Buffer, overwriteExisting: boolean): Promise<IAddedAppInfo>
    {
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

    public async install(packageId:string): Promise<void> {
        await actions.install(this._spAlmOptions, packageId);
    }

    public async uninstall(packageId:string): Promise<void> {
        await actions.uninstall(this._spAlmOptions, packageId);
    }

    public async upgrade(packageId:string): Promise<void> {
        await actions.upgrade(this._spAlmOptions, packageId);
    }
}
import * as path from 'path';
import * as tl from 'vsts-task-lib/task';
import { spAlm } from './sp-alm';

tl.setResourcePath(path.join(__dirname, 'task.json'));

async function main(): Promise<void> {
	let action = tl.getInput('action', true);
	let appCatalogConnection: string = tl.getInput('appCatalogConnection', true);
	let appCatalogUrl: string = tl.getEndpointUrl(appCatalogConnection, false);
	let appCatalogUsername: string = tl.getEndpointAuthorizationParameter(appCatalogConnection, "username", false);
	let appCatalogPassword: string = tl.getEndpointAuthorizationParameter(appCatalogConnection, "password", false);
	let appFilePath: string = (action === "Add") ? tl.getPathInput('appFilePath', true, false).trim() : "";
	let overwriteExisting: boolean = (action === "Add") ? tl.getBoolInput("overwriteExisting", true) : false;
	let packageIdOut: string = (action === "Add") ? tl.getInput("packageIdOut", true) : "";
	let skipFeatureDeployment: boolean = (action === "Deploy") ? tl.getBoolInput("skipFeatureDeployment", true) : true;
	let packageIdIn: string = (action !== "Add") ? tl.getInput("packageIdIn", true) : "";

	console.log(`Action: ${action}`);
	console.log(`SharePoint App Catalog Connection: ${appCatalogConnection}`);
	console.log(`SharePoint App Catalog Url: ${appCatalogUrl}`);

	let almUtil = new spAlm({
		spSiteUrl: appCatalogUrl,
		spUsername: appCatalogUsername,
		spPassword: appCatalogPassword
	});

	switch(action)
	{
		case "Add": {
			console.log(`SharePoint App Package File Path: ${appFilePath}`);
			console.log(`Overwrite Existing Package: ${overwriteExisting}`);
			console.log(`Package Id Variable: ${packageIdOut}`);
			// let result = await almUtil.add();
			// tl.setVariable(packageIdOut, result, false);
			break;
		}
		case "Deploy": {
			console.log(`Package Id: ${packageIdIn}`);
			console.log(`Skip Feature Deployment: ${skipFeatureDeployment}`);
			await almUtil.deploy(packageIdIn, skipFeatureDeployment);
			break;
		}
		case "Retract": {
			console.log(`Package Id: ${packageIdIn}`);
			await almUtil.retract(packageIdIn);
			break;
		}
		case "Remove": {
			console.log(`Package Id: ${packageIdIn}`);
			await almUtil.remove(packageIdIn);
			break;
		}
	}

	console.log("Action completed");
}

main()
	.then((result) => tl.setResult(tl.TaskResult.Succeeded, ""))
	.catch((error) => tl.setResult(tl.TaskResult.Failed, error));
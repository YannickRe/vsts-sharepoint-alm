import appInsights from './sp-alm/utils/appInsightsHelper';
import * as path from 'path';
import * as tl from 'vsts-task-lib/task';
import * as fs from 'fs';
import { spAlm } from './sp-alm';
import * as authHelper from "./sp-alm/utils/authHelper";

tl.setResourcePath(path.join(__dirname, 'task.json'));

async function main(): Promise<void> {
	let action = tl.getInput('action', true);
	let appCatalogConnection: string = tl.getInput('appCatalogConnection', true);
	let appCatalogUrl: string = tl.getEndpointUrl(appCatalogConnection, false);
	let appCatalogAuthType: string = tl.getEndpointAuthorizationScheme(appCatalogConnection, false);
	let appFilePath: string = (action === "Add") ? tl.getPathInput('appFilePath', true, false).trim() : "";
	let overwriteExisting: boolean = (action === "Add") ? tl.getBoolInput("overwriteExisting", true) : false;
	let packageIdOut: string = (action === "Add") ? tl.getInput("packageIdOut", true) : "";
	let skipFeatureDeployment: boolean = (action === "Deploy") ? tl.getBoolInput("skipFeatureDeployment", true) : true;
	let packageIdIn: string = (action !== "Add") ? tl.getInput("packageIdIn", true) : "";

	appInsights.trackEvent({
		name: action,
		properties: {
			"scope": "tenant",
			"action": action,
			"authType": appCatalogAuthType,
			"collection": tl.getVariable("system.collectionId"), 
			"projectId": tl.getVariable("system.teamProjectId")
		}
	});

	console.log(`Action: ${action}`);
	console.log(`SharePoint App Catalog Connection: ${appCatalogConnection}`);
	console.log(`SharePoint App Catalog Connection Type: ${appCatalogAuthType}`);
	console.log(`SharePoint App Catalog Url: ${appCatalogUrl}`);

	let authOptions = authHelper.getVstsAuthenticationValues(appCatalogAuthType, appCatalogConnection);
	let almUtil = new spAlm({
		spSiteUrl: appCatalogUrl,
		spAuthOptions: authOptions
	});

	switch(action)
	{
		case "Add": {
			console.log(`SharePoint App Package File Path: ${appFilePath}`);
			console.log(`Overwrite Existing Package: ${overwriteExisting}`);
			console.log(`Package Id Variable: ${packageIdOut}`);

			if (!tl.exist(appFilePath) || !tl.stats(appFilePath).isFile()){
				throw `File '${appFilePath}' couldn't be found.`;
			}
			let fileName = path.basename(appFilePath);
			let fileContents = fs.readFileSync(appFilePath);

			let result = await almUtil.add(fileName, fileContents, overwriteExisting);
			tl.setVariable(packageIdOut, result.UniqueId, false);
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

try
{
	var action = tl.getInput('action', true);
	let appCatalogConnection: string = tl.getInput('appCatalogConnection', true);
	let appCatalogAuthType: string = tl.getEndpointAuthorizationScheme(appCatalogConnection, false);

	main()
	.then((result) => { tl.setResult(tl.TaskResult.Succeeded, "");})
	.catch((error) => {
		appInsights.trackException({ exception: <Error>error, properties: {
			"failed": "true", 
			"scope": "tenant",
			"action": action,
			"authType": appCatalogAuthType,
			"collection": tl.getVariable("system.collectionId"), 
			"projectId": tl.getVariable("system.teamProjectId")
		} });

		tl.setResult(tl.TaskResult.Failed, error);
	});
}
finally{
	appInsights.flush();
}
import * as path from 'path';
import * as tl from 'vsts-task-lib/task';
import * as fs from 'fs';
import { SpAlm, getVstsAuthenticationValues, getTelemetryClient } from '../sp-alm';

async function main(): Promise<void> {
	let action = tl.getInput('action', true);
	let spSiteConnection: string = tl.getInput('spSiteConnection', true);
	let spSiteUrl: string = tl.getEndpointUrl(spSiteConnection, false);
	let spSiteAuthType: string = tl.getEndpointAuthorizationScheme(spSiteConnection, false);
	let appFilePath: string = (action === "Add") ? tl.getPathInput('appFilePath', true, false).trim() : "";
	let overwriteExisting: boolean = (action === "Add") ? tl.getBoolInput("overwriteExisting", true) : false;
	let packageIdOut: string = (action === "Add") ? tl.getInput("packageIdOut", true) : "";
	let skipFeatureDeployment: boolean = (action === "Deploy") ? tl.getBoolInput("skipFeatureDeployment", true) : true;
	let packageIdIn: string = (action !== "Add") ? tl.getInput("packageIdIn", true) : "";
	let useTenantCatalog: boolean = tl.getBoolInput("useTenantCatalog", true);
	let appInsights = getTelemetryClient();

	appInsights.trackEvent({
		name: action,
		properties: {
			"scope": "catalog",
			"action": action,
			"authType": spSiteAuthType,
			"useTenantCatalog": useTenantCatalog ? "true" : "false",
			"collection": tl.getVariable("system.collectionId"), 
			"projectId": tl.getVariable("system.teamProjectId")
		}
	});

	console.log(`Action: ${action}`);
	console.log(`SharePoint Site Connection: ${spSiteConnection}`);
	console.log(`SharePoint Site Connection Type: ${spSiteAuthType}`);
	console.log(`SharePoint Site Url: ${spSiteUrl}`);

	let authOptions = getVstsAuthenticationValues(spSiteAuthType, spSiteConnection);
	let almUtil = new SpAlm({
		spSiteUrl: spSiteUrl,
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

			let result = await almUtil.add(fileName, fileContents, overwriteExisting, useTenantCatalog);
			tl.setVariable(packageIdOut, result.UniqueId, false);
			break;
		}
		case "Deploy": {
			console.log(`Package Id: ${packageIdIn}`);
			console.log(`Skip Feature Deployment: ${skipFeatureDeployment}`);
			await almUtil.deploy(packageIdIn, skipFeatureDeployment, useTenantCatalog);
			break;
		}
		case "Retract": {
			console.log(`Package Id: ${packageIdIn}`);
			await almUtil.retract(packageIdIn, useTenantCatalog);
			break;
		}
		case "Remove": {
			console.log(`Package Id: ${packageIdIn}`);
			await almUtil.remove(packageIdIn, useTenantCatalog);
			break;
		}
	}
	console.log("Action completed");
}
let appInsights = getTelemetryClient();
try
{
	var action = tl.getInput('action', true);
	var spSiteConnection: string = tl.getInput('spSiteConnection', true);
	let spSiteAuthType: string = tl.getEndpointAuthorizationScheme(spSiteConnection, false);

	main()
	.then((result) => { tl.setResult(tl.TaskResult.Succeeded, "");})
	.catch((error) => {
		appInsights.trackException({ exception: <Error>error, properties: {
			"failed": "true", 
			"scope": "catalog",
			"action": action,
			"authType": spSiteAuthType,
			"collection": tl.getVariable("system.collectionId"), 
			"projectId": tl.getVariable("system.teamProjectId")
		} });

		tl.setResult(tl.TaskResult.Failed, error);
	});
}
finally{
	appInsights.flush();
}
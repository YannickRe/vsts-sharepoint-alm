import * as tl from 'vsts-task-lib/task';
import { SpAlm, getVstsAuthenticationValues, getTelemetryClient } from '../sp-alm';

async function main(): Promise<void> {
	var action = tl.getInput('action', true);
	var spSiteConnection: string = tl.getInput('spSiteConnection', true);
	var spSiteUrl: string = tl.getEndpointUrl(spSiteConnection, false);
	let spSiteAuthType: string = tl.getEndpointAuthorizationScheme(spSiteConnection, false);
	var packageId: string = tl.getInput("packageId", true);
	var overwriteSpSiteUrls: string[] = tl.getDelimitedInput('overwriteSpSiteUrls', '\n', false);
	let useTenantCatalog: boolean = tl.getBoolInput("useTenantCatalog", true);
	let appInsights = getTelemetryClient();

	appInsights.trackEvent({
		name: action,
		properties: {
			"scope": "site",
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
	console.log(`Package Id: ${packageId}`);

	let authOptions = getVstsAuthenticationValues(spSiteAuthType, spSiteConnection);
	let almUtil = new SpAlm({
		spSiteUrl: spSiteUrl,
		spAuthOptions: authOptions
	});

	switch(action)
	{
		case "Install": {
			await almUtil.install(packageId, overwriteSpSiteUrls, useTenantCatalog);
			break;
		}
		case "Uninstall": {
			await almUtil.uninstall(packageId, overwriteSpSiteUrls, useTenantCatalog);
			break;
		}
		case "Upgrade": {
			await almUtil.upgrade(packageId,overwriteSpSiteUrls, useTenantCatalog);
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
			"scope": "site",
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

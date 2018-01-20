var path = require('path')
import * as tl from 'vsts-task-lib/task';

tl.setResourcePath(path.join(__dirname, 'task.json'));

async function main(): Promise<void> {
	var action = tl.getInput('action', true);
	var appCatalogConnection: string = tl.getInput('appCatalogConnection', true);
	var appCatalogUrl: string = tl.getEndpointUrl(appCatalogConnection, false);
	var appCatalogUsername: string = tl.getEndpointAuthorizationParameter(appCatalogConnection, "username", false);
	var appCatalogPassword: string = tl.getEndpointAuthorizationParameter(appCatalogConnection, "password", false);
	var appFilePath: string = (action === "Add") ? tl.getPathInput('appFilePath', true, false).trim() : null;
	var overwriteExisting: boolean = (action === "Add") ? tl.getBoolInput("overwriteExisting", true) : null;
	var packageIdOut: string = (action === "Add") ? tl.getInput("packageIdOut", true) : null;
	var skipFeatureDeployment: boolean = (action === "Deploy") ? tl.getBoolInput("skipFeatureDeployment", true) : null;
	var packageIdIn: string = (action !== "Add") ? tl.getInput("packageIdIn", true) : null;

	console.log(`Action: ${action}`);
	console.log(`App Catalog Connection: ${appCatalogConnection}`);
	console.log(`App Catalog Url: ${appCatalogUrl}`);

	switch(action)
	{
		case "Add": {
			console.log(`App File Path: ${appFilePath}`);
			console.log(`Overwrite Existing Package: ${overwriteExisting}`);
			console.log(`Package Id Out: ${packageIdOut}`);
			break;
		}
		case "Deploy": {
			console.log(`Package Id In: ${packageIdIn}`);
			console.log(`Skip Feature Deployment: ${skipFeatureDeployment}`);
			break;
		}
		case "Retract": {
			console.log(`Package Id In: ${packageIdIn}`);
			break;
		}
		case "Remove": {
			console.log(`Package Id In: ${packageIdIn}`);
			break;
		}
	}

	console.log("Action completed");
}

main()
	.then((result) => tl.setResult(tl.TaskResult.Succeeded, ""))
	.catch((error) => tl.setResult(tl.TaskResult.Failed, error));
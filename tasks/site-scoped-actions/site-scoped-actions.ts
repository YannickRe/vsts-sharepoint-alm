var path = require('path')

import * as tl from 'vsts-task-lib/task';

tl.setResourcePath(path.join(__dirname, 'task.json'));

async function main(): Promise<void> {
	var action = tl.getInput('action', true);
	var spSiteConnection: string = tl.getInput('spSiteConnection', true);
	var spSiteUrl: string = tl.getEndpointUrl(spSiteConnection, false);
	var spSiteUsername: string = tl.getEndpointAuthorizationParameter(spSiteConnection, "username", false);
	var spSitePassword: string = tl.getEndpointAuthorizationParameter(spSiteConnection, "password", false);
	var packageIdIn: string = tl.getInput("packageIdIn", true);

	console.log(`Action: ${action}`);
	console.log(`App Catalog Connection: ${spSiteConnection}`);
	console.log(`App Catalog Url: ${spSiteUrl}`);
	console.log(`Package Id In: ${packageIdIn}`);
}

main()
	.then((result) => tl.setResult(tl.TaskResult.Succeeded, ""))
	.catch((error) => tl.setResult(tl.TaskResult.Failed, error));
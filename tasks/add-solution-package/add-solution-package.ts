var path = require('path')

import * as tl from 'vsts-task-lib/task';

tl.setResourcePath(path.join(__dirname, 'task.json'));

async function main(): Promise<void> {
	// let feedId = tl.getInput("feed");
	// let packageId = tl.getInput("definition");
	// let version = tl.getInput("version");
	// let downloadPath = tl.getInput("downloadPath");
	// let collectionUrl = tl.getVariable("System.TeamFoundationCollectionUri");

	// var accessToken = getAuthToken();
	// var credentialHandler = vsts.getBearerHandler(accessToken);
	// var vssConnection = new vsts.WebApi(collectionUrl, credentialHandler);
	// var coreApi = vssConnection.getCoreApi();

    // await downloadPackage(collectionUrl, credentialHandler, feedId, packageId, version, downloadPath);
    console.log("Adding Package to the App Catalog");
}

main()
	.then((result) => tl.setResult(tl.TaskResult.Succeeded, ""))
	.catch((error) => tl.setResult(tl.TaskResult.Failed, error));
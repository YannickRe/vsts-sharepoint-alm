import * as path from 'path';
import * as tl from 'vsts-task-lib/task';
import { spAlm } from './sp-alm';

tl.setResourcePath(path.join(__dirname, 'task.json'));

async function main(): Promise<void> {
	var action = tl.getInput('action', true);
	var spSiteConnection: string = tl.getInput('spSiteConnection', true);
	var spSiteUrl: string = tl.getEndpointUrl(spSiteConnection, false);
	var spSiteUsername: string = tl.getEndpointAuthorizationParameter(spSiteConnection, "username", false);
	var spSitePassword: string = tl.getEndpointAuthorizationParameter(spSiteConnection, "password", false);
	var packageId: string = tl.getInput("packageId", true);

	console.log(`Action: ${action}`);
	console.log(`App Catalog Connection: ${spSiteConnection}`);
	console.log(`App Catalog Url: ${spSiteUrl}`);
	console.log(`Package Id: ${packageId}`);

	let almUtil = new spAlm({
		spSiteUrl: spSiteUrl,
		spUsername: spSiteUsername,
		spPassword: spSitePassword
	});

	switch(action)
	{
		case "Install": {
			await almUtil.install(packageId);
			break;
		}
		case "Uninstall": {
			await almUtil.uninstall(packageId);
			break;
		}
		case "Upgrade": {
			await almUtil.upgrade(packageId);
			break;
		}
	}
}

main()
	.then((result) => tl.setResult(tl.TaskResult.Succeeded, ""))
	.catch((error) => tl.setResult(tl.TaskResult.Failed, error));
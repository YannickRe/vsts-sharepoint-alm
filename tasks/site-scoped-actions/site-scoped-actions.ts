import * as path from 'path';
import * as tl from 'vsts-task-lib/task';
import { spAlm } from './sp-alm';
import * as authHelper from "./sp-alm/utils/authHelper";

tl.setResourcePath(path.join(__dirname, 'task.json'));

async function main(): Promise<void> {
	var action = tl.getInput('action', true);
	var spSiteConnection: string = tl.getInput('spSiteConnection', true);
	var spSiteUrl: string = tl.getEndpointUrl(spSiteConnection, false);
	let spSiteAuthType: string = tl.getEndpointAuthorizationScheme(spSiteConnection, false);
	var packageId: string = tl.getInput("packageId", true);
	var overwriteSpSiteUrls: string[] = tl.getDelimitedInput('overwriteSpSiteUrls', '\n', false);

	console.log(`Action: ${action}`);
	console.log(`App Catalog Connection: ${spSiteConnection}`);
	console.log(`App Catalog Url: ${spSiteUrl}`);
	console.log(`Package Id: ${packageId}`);

	let authOptions = authHelper.getVstsAuthenticationValues(spSiteAuthType, spSiteConnection);
	let almUtil = new spAlm({
		spSiteUrl: spSiteUrl,
		spAuthOptions: authOptions
	});

	switch(action)
	{
		case "Install": {
			await almUtil.install(packageId, overwriteSpSiteUrls);
			break;
		}
		case "Uninstall": {
			await almUtil.uninstall(packageId, overwriteSpSiteUrls);
			break;
		}
		case "Upgrade": {
			await almUtil.upgrade(packageId,overwriteSpSiteUrls);
			break;
		}
	}
}

main()
	.then((result) => tl.setResult(tl.TaskResult.Succeeded, ""))
	.catch((error) => tl.setResult(tl.TaskResult.Failed, error));
var path = require('path')

import * as tl from 'vsts-task-lib/task';

tl.setResourcePath(path.join(__dirname, 'task.json'));

async function main(): Promise<void> {
    console.log("Executing action in context of the SharePoint Tenant App Catalog");
}

main()
	.then((result) => tl.setResult(tl.TaskResult.Succeeded, ""))
	.catch((error) => tl.setResult(tl.TaskResult.Failed, error));
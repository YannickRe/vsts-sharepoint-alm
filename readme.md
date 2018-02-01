# SharePoint ALM Tasks for Visual Studio Team Services
Build and release tasks that make use of the [SharePoint Application Lifecycle Management API's](https://docs.microsoft.com/en-us/sharepoint/dev/apis/alm-api-for-spfx-add-ins) to manage custom packages on your tenant.

![VSTS-SP-ALM-Tasks](/images/VSTS-SP-ALM-Tasks.png)

## Service Endpoint
The tasks use a custom Service Endpoint connection called "SharePoint Online Site" to connect to SharePoint.
### Token Based Authentication
Uses ClientId and ClientSecret to authenticate to SharePoint.
![SharePoint token based authentication](/images/VSTS-SP-ALM-Tasks-Connection-Token.png)
### Username/Password Authentication
Uses username and password to connect to SharePoint
![SharePoint username/password authentication](/images/VSTS-SP-ALM-Tasks-Connection-UserNamePassword.png)

## Tenant Scoped Actions
### Action: Add
![Tenant Scoped Action: Add](/images/VSTS-SP-ALM-Task-Tenant-Add.png)
Add a SharePoint Framework solution package to the SharePoint tenant App Catalog.
* Connection: site url to the App Catalog
* Path: relative (to the working directory) or absolute path to the SharePoint Framework solution package
* Overwrite if exists: if package already exists in the App Catalog, can it be overwritten or not
* Output variable: name of the variable that will contain the Package Id from the App Catalog, when the task succeeds.

### Action: Deploy
![Tenant Scoped Action: Deploy](/images/VSTS-SP-ALM-Task-Tenant-Deploy.png)
Deploy a SharePoint Framework solution package in the SharePoint tenant App Catalog.
* Connection: site url to the App Catalog
* Id of the package in the App Catalog: can contain the variable from the Add task.
* Tenant wide deployment: wether or not to deploy the package globally. If not, it needs to be installed in each site that needs it.

### Action: Retract
![Tenant Scoped Action: Retract](/images/VSTS-SP-ALM-Task-Tenant-Retract.png)
Retract (reversal of Deploy) a SharePoint Framework solution package in the SharePoint tenant App Catalog.
* Connection: site url to the App Catalog
* Id of the package in the App Catalog: can contain the variable from the Add task.

### Action: Remove
![Tenant Scoped Action: Remove](/images/VSTS-SP-ALM-Task-Tenant-Remove.png)
Remove (reversal of Add) a SharePoint Framework solution package from the SharePoint tenant App Catalog.
* Connection: site url to the App Catalog
* Id of the package in the App Catalog: can contain the variable from the Add task.

## Site Scoped Actions
### Action: Install
![Site Scoped Action: Install](/images/VSTS-SP-ALM-Task-Site-Install.png)
Install a SharePoint Framework solution package that exists in the SharePoint tenant App Catalog, in one or more SharePoint sites.
* Connection: connection to SharePoint
* List of SharePoint site urls
  * Not required, and if empty the package will be installed on the site url of the connection.
  * When filled in, the package will be installed on each provided site url.
* Id of the package in the App Catalog: can contain the variable from the Add task.

### Action: Uninstall
![Site Scoped Action: Uninstall](/images/VSTS-SP-ALM-Task-Site-Uninstall.png)
Uninstall a SharePoint Framework solution package that exists in the SharePoint tenant App Catalog (and is already installed on the sites), from one or more SharePoint sites.
* Connection: connection to SharePoint
* List of SharePoint site urls
  * Not required, and if empty the package will be uninstalled from the site url of the connection.
  * When filled in, the package will be uninstalled on each provided site url.
* Id of the package in the App Catalog: can contain the variable from the Add task.

### Action: Upgrade
![Site Scoped Action: Upgrade](/images/VSTS-SP-ALM-Task-Site-Upgrade.png)
Upgrade a SharePoint Framework solution package that exists in the SharePoint tenant App Catalog (and is already installed on the sites), from one or more SharePoint sites.
* Connection: connection to SharePoint
* List of SharePoint site urls
  * Not required, and if empty the package will be upgraded on the site url of the connection.
  * When filled in, the package will be upgraded on each provided site url.
* Id of the package in the App Catalog: can contain the variable from the Add task.
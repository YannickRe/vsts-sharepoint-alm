import * as appInsights from 'applicationinsights';
const packageJSON = require('../../package.json');

appInsights.setup("0b7f9cdf-a2c4-4d1a-8c18-a3d514725c19")
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setUseDiskRetryCaching(true)
    .setInternalLogging(false, false)
    .start();

appInsights.defaultClient.commonProperties = {
  version: packageJSON.version,
  name: packageJSON.name
};

export default appInsights.defaultClient;
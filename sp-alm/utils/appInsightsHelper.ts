import * as appInsights from 'applicationinsights';
const packageJSON = require('../../package.json');

appInsights.setup("0b7f9cdf-a2c4-4d1a-8c18-a3d514725c19")
    .setAutoDependencyCorrelation(false)
    .setAutoCollectRequests(false)
    .setAutoCollectPerformance(false)
    .setAutoCollectExceptions(false)
    .setAutoCollectDependencies(false)
    .setAutoCollectConsole(false)
    .setUseDiskRetryCaching(false)
    .setInternalLogging(false, false)
    .start();

appInsights.defaultClient.commonProperties = {
  version: packageJSON.version,
  name: packageJSON.name
};

export default appInsights.defaultClient;
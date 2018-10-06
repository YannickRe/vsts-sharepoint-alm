var path = require("path");
var fs = require("fs");
var semver = require('semver');

function getTasks(tasksDir) {
    return fs.readdirSync(tasksDir).filter(function (file) {
        return ["sp-alm", "typings"].indexOf(file.toLowerCase()) < 0
            && fs.statSync(path.join(tasksDir, file)).isDirectory();
    });
}

function bumpJsonFile(extensionJsonPath) {
    console.log("Updating: " + extensionJsonPath);
    var extensionJsonFile = fs.readFileSync(extensionJsonPath);
    var extensionJson = JSON.parse(extensionJsonFile);
    extensionJson.version = semver.inc(extensionJson.version, "patch");
    fs.writeFileSync(extensionJsonPath, JSON.stringify(extensionJson, null, 4));
}

var tasksDir = path.join(__dirname, "./tasks");
var taskNames = getTasks(tasksDir);
taskNames.forEach(function(name) {
    var taskJsonPath = path.join(tasksDir, name, "task.json");
    console.log("Updating: " + taskJsonPath);
    if (fs.existsSync(taskJsonPath)) {
        var taskJsonFile = fs.readFileSync(taskJsonPath);
        var taskJson = JSON.parse(taskJsonFile);
        if (typeof taskJson.version.Patch != 'number') {
            fail(`Error processing '${taskName}'. version.Patch should be a number.`);
        }
        taskJson.version.Patch = taskJson.version.Patch + 1;
        fs.writeFileSync(taskJsonPath, JSON.stringify(taskJson, null, 4));
    }

    bumpJsonFile(path.join(tasksDir, name, "package.json"));
});

bumpJsonFile(path.join(__dirname, 'vsts-extension.json'));
bumpJsonFile(path.join(__dirname, 'vsts-extension-dev.json'));
bumpJsonFile(path.join(__dirname, 'package.json'));
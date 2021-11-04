const fsPromise = require('fs/promises');
const path = require('path');

let newDirPath = path.join(__dirname, 'files-copy');
let srcDirPath = path.join(__dirname, 'files');

fsPromise.mkdir(newDirPath, {recursive : true}).then(() => {

    return fsPromise.readdir(newDirPath);

}).then(existingFiles => {

    return Promise.all(existingFiles.map((fileName) => {
        let pathToFile = path.resolve(newDirPath, fileName);
        return fsPromise.rm(pathToFile, {force: true});
    }))

}).then(() => {
    return fsPromise.readdir(srcDirPath);
}).then((fileNames) => {
    for (const fileName of fileNames) {
        let oldPathToFile = path.resolve(srcDirPath, fileName);
        let newPathToFile = path.resolve(newDirPath, fileName);
        fsPromise.copyFile(oldPathToFile, newPathToFile);
    }
}).catch(err => console.log(err.message));




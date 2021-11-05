const path = require('path');
const fsPromise = require('fs/promises');

const pathToDist = path.join(__dirname, 'project-dist');
const pathToStyles = path.join(__dirname, 'styles');

const absPathToBundle = path.join(pathToDist, 'bundle.css');

fsPromise.writeFile(absPathToBundle, '').then(() => {
    return fsPromise.readdir(pathToStyles, {withFileTypes: true});
}).then((files) => {
    for (const file of files){
        if (file.isFile()){
            let pathToFile = path.resolve(pathToStyles, file.name);
            let ext = path.parse(pathToFile).ext;
            if (ext == '.css'){
                fsPromise.readFile(pathToFile, {encoding: 'utf-8'}).then((data) => {
                    fsPromise.appendFile(absPathToBundle, data + '\n\n');
                }).catch((err) => console.log(err.message));
            }
        }
    }
})
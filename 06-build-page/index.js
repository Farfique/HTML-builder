const path = require('path');
const fsPromise = require('fs/promises');

const pathToDist = path.join(__dirname, 'project-dist');

let assetsDirPath = path.join(__dirname, 'assets');

const pathToIndex = path.join(pathToDist, 'index.html');

const pathToTemplate = path.join(__dirname, 'template.html');
const pathToStyles = path.join(__dirname, 'styles');

const absPathToBundle = path.join(pathToDist, 'style.css');


fsPromise.rm(pathToDist, {force: true, recursive: true}).then(() => {
    return fsPromise.mkdir(pathToDist);
}).then(() => {
    copyDirectory(assetsDirPath, path.join(pathToDist, 'assets'));
    createIndex();
    createStyleBundle();

}).catch((err) => console.log(err.message));



async function copyDirectory(pathToSrc, pathToDist){
    await fsPromise.mkdir(pathToDist, {recursive: true});
    fsPromise.readdir(pathToSrc, {withFileTypes: true}).then((files) => {
        Promise.all(files.map((file) => {
            let pathToFile = path.resolve(pathToSrc, file.name);
            let pathToDistF = path.resolve(pathToDist, file.name);
            if (file.isDirectory()){
                copyDirectory(pathToFile, pathToDistF);
            }
            else if (file.isFile()){
                fsPromise.copyFile(pathToFile, pathToDistF);
            }
        }))
    }).catch((err) => console.log(err.message));
};

async function createIndex(){
    try {
        fsPromise.readFile(pathToTemplate, {encoding: 'utf-8'}).then(async (str) => {

            let regEx = new RegExp('{{[a-z-]*}}', 'g');
            let tags = str.match(regEx);

            return Promise.all(tags.map(async (tag) => {

                let tagName = tag.substring(2, tag.length - 2);
                //arr.push({'name': tagName, 'tag': tags[i]});
                let pathToComponent = path.resolve(__dirname, 'components', tagName + '.html');
                console.log("path to component = ", pathToComponent);
                return fsPromise.readFile(pathToComponent, {encoding: 'utf-8'}).then((component) => {
                    return {'tag': tag, 'component': component};
                }).catch(err => console.log(err.message));

            })).then((arr) => {
                return {'str': str, 'arr': arr};
            });

        }).then((obj) => {

            for (let i = 0; i < obj.arr.length; i++){
                obj.str = obj.str.replace(obj.arr[i].tag, obj.arr[i].component);
            }

            return fsPromise.writeFile(pathToIndex, obj.str);

        }).catch((err) => console.log("err.message"));

    }
    catch(err){
        console.log(err.message);
    }

}

async function createStyleBundle(){


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

}
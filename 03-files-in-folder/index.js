const path = require('path');
const fsPromise = require('fs/promises');
const {stdout} = process;


const pathToFolder = path.join(__dirname, 'secret-folder');



fsPromise.readdir(pathToFolder, { withFileTypes: true }).then((files) => {
    for (const file of files){

        if (file.isFile()){

            let pathToFile = path.resolve(pathToFolder, file.name);

            let parsedObj = path.parse(pathToFile);
            let fileName = parsedObj.name || '';
            let fileExt = (parsedObj.ext && parsedObj.ext.length > 1)? parsedObj.ext.substring(1) : '';
            fsPromise.lstat(pathToFile).then(stat => {
                let str = fileName + " - " + fileExt + ' - ' + stat.size + "b\n";
                stdout.write(str);
            });

        }

    }
})




      

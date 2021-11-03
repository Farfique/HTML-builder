const {stdin, stdout} = process;
const fs = require('fs');
const path = require('path');
const pathToFile = path.join(__dirname, 'myfile.txt');

fs.writeFile(
    pathToFile,
    '',
    (err) => {
        if (err) throw err;
    }
);

stdout.write('Hello, enter your text: \n');

stdin.on('data', data => {
    if (data.toString() == 'exit\n'){
        process.exit();
    }
    else {
        fs.appendFile(
            pathToFile,
            data.toString(),
            err => {
                if (err) throw err;
            }
        );
    }

});

process.on('exit', () => stdout.write('\nBye-bye!\n'));
process.on( "SIGINT", function() {
    process.exit();
  } );
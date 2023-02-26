const fs = require('fs');

fs.writeFile('result.json', JSON.stringify(), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log('The file was saved!');
  });
  
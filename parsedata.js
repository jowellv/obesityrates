var fs = require('fs');
var readline = require('readline');

var outfile = fs.createWriteStream('out.csv');


var filterData = function(filename, callback) {
    var words = {};
    var count = 0;
    var lineReader = readline.createInterface({
        input: fs.createReadStream(filename, 'utf8')
    });
    lineReader.on('line', function(line){
        if((line.indexOf('20+ yrs, age-standardized') != -1 &&
           line.indexOf('obese') != -1 &&
           line.indexOf('both') != -1) ||
           line.indexOf('location_id') != -1) {
            outfile.write(line + '\n');
            count += 1;
        }
    });
    lineReader.on('close', function(){
        outfile.end();
        callback(count);
    });

};

filterData('dataall.csv', function(lines) {
    console.log(lines + ' lines saved')
});

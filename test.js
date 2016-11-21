var os = require("os");
var path = require("path");
var fs = require("fs");
var url = require("url");
var express= require("express");
var q = require('q');
var walk = require('walk');
var logger = require('morgan');
var events = require('events');

var eventEmitter = new events.EventEmitter();
var app = express();
app.use(logger('dev'));
app.use(express.static(__dirname + '/static'));
app.listen(1345, function(){
   console.log("Listening on port 1345");
});
app.get('/', function(req, res){
    console.log("In GET ");
    res.render('index.html');
});
app.get('/files', function(req, res){
    console.log("In GET * 1");
    //var pathname = url.parse(req.url).pathname;
    var filepathinput = req.param('filepathinput');
    var pathname = req.param('filetype');
    console.log("DAta: " + req.param('filepathinput'));
    if(!filepathinput){
        filepathinput= 'E:/RAKESH/';
    }
    console.log("In GET * 2");

    // Print the name of the file for which request is made.
    //pathname = '.'+pathname;
    console.log("Request for " + pathname + " received.");
    console.log("In GET * 3");
    //res.set("Connection", "close");
    var filesarray = [];
    console.log("In GET * 4");
    var filepaths = filepathinput ;
    console.log("file path: " + filepaths);
    filesarray.push({"type" : pathname, "path" : filepaths});
    console.log("In GET * 5");
    traverse(filepaths, pathname, filesarray, req, res);
    console.log("In GET * 6");

   eventEmitter.on('done', function(){
        //console.log("Result: " + JSON.stringify(filesarray[1].file));

       console.log("In GET * 7");
       //res.set("Connection", "close");

       //res.json(filesarray);

       console.log("In GET * 8");

    });
    console.log("In GET * 9");
    //res.json(filesarray);

});


function traverse(initpath, filetype, filesarray, req, res) {
    console.log("In Traverse 1");

    /*fs.readdir("/hjvjhgvbjh", function(err, data){
        if(err){
            console.log(err);
            res.json({Error: "Directory does not exists"});
        }else {
            console.log("Dir exists");
        }
    });*/

    var walker = walk.walk(initpath, {});
    console.log("In Traverse 2");
    console.log("File type: " + filetype);
    walker.on("file", function (root, fileStats, next) {
        fs.readFile(fileStats.name, function () {
            if(!filetype){
            //filesarray[0].type="all";
                filesarray.push({"file": [fileStats.name, path.join(root, fileStats.name)]});
            }else {

                //console.log("In Traverse 3");
                if (path.extname(fileStats.name) == '.'+filetype) {
                    // console.log("In Traverse 4");
                    filesarray.push({"file": [fileStats.name, path.join(root, fileStats.name)]});
                    //console.log("In Traverse 5");
                }
            }
            //console.log("In Traverse 6");
            next();
            //console.log("In Traverse 7");
        });
    });
    walker.on("errors", function (root, nodeStatsArray, next) {
        next();
    });
    walker.on("end", function () {

        console.log("All done");
        console.log("In Traverse 8");
        //eventEmitter.emit('done');
        res.json(filesarray);
        console.log("In Traverse 9");
        return filesarray;
        console.log("In Traverse 10");

    });
}

//var results = traverse('E:/RAKESH/Parks and recreations','.srt');


/*
var array = function (initpath, filetype) {
    var filesarray = [];
   traverse(initpath, filetype, filesarray);
    //promise.then(function(){console.log("FileArray : "+ filesarray);}, function(){console.log("ERROR!!!");});
    //console.log("Finished!!");
    //console.log("FilesArray: "+ filesarray);
    console.log("Finished!!");
    return filesarray;
}
var filesarray = [];
    var traverse = function (initpath, filetype, filesarray) {
        console.log("Traverse called");
        var flag = false;
        fs.readdir(initpath, function(err, checkfiles){
            if(err){
                console.log(err);
            }
            checkfiles.forEach(function(checkfile){
                fs.stat(path.join(initpath, checkfile), function (err, stats) {
                    if(err){
                        console.log(err);

                    }
                    if(stats){
                        if(stats.isDirectory()){
                            flag = true;
                        }
                    }
                });

            });
        });


        if(flag) {
            fs.readdir(initpath, function (err, files) {
                if (err) {
                    console.log(err);
                }
                files.forEach(function (file) {


                    fs.stat(path.join(initpath, file), function (err, stats) {
                        if (err) {
                            // console.log(err);
                        }
                        if (stats) {
                            if (stats.isFile()) {
                                //console.log("File: " + path.join(initpath, file));
                                //console.log("isFile ? " + stats.isFile());
                                //console.log("isDirectory ? " + stats.isDirectory());

                                // console.log("Type: " + path.extname(file));
                                //console.log("Filetype: " + filetype);
                                if (path.extname(file) == filetype) {
                                    var pushArray = [];
                                    pushArray.push(file);
                                    pushArray.push(path.join(initpath, file));
                                    filesarray.push({"file": pushArray});
                                    //console.log("File: " + path.join(initpath, file));
                                }
                            }
                            if (stats.isDirectory()) {
                                traverse(path.join(initpath, file), filetype, filesarray);

                            }
                        }
                    });

                });

            });
        }
        else{


            fs.readdir(initpath, function (err, files) {
                if (err) {
                    console.log(err);
                }
                files.forEach(function (file) {


                    fs.stat(path.join(initpath, file), function (err, stats) {
                        if (err) {
                            // console.log(err);
                        }
                        if (stats) {
                            if (stats.isFile()) {
                                //console.log("File: " + path.join(initpath, file));
                                //console.log("isFile ? " + stats.isFile());
                                //console.log("isDirectory ? " + stats.isDirectory());

                                // console.log("Type: " + path.extname(file));
                                //console.log("Filetype: " + filetype);
                                if (path.extname(file) == filetype) {
                                    var pushArray = [];
                                    pushArray.push(file);
                                    pushArray.push(path.join(initpath, file));
                                    filesarray.push({"file": pushArray});
                                    //console.log("File: " + path.join(initpath, file));
                                }
                            }

                        }
                    });

                });

            });
            return 0;
        }
        //console.log("Finished!!");
    }





//maintraverse('E:/RAKESH', '.mp3');
console.log("array: "+ array('E:/RAKESH/MOVIES/MF/season3','.mp4') );
*/



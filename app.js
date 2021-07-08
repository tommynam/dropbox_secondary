// Import required files/modules
var express = require("express");
var bodyParser = require("body-parser");
var fileUpload = require("express-fileupload");
var fs = require("fs");
const path = require("path");
//Instantiate express object as "app"
var app = express();
//Instantiate Cache object
var Cache = {};

//Directory for upload
var uploadDirectory = __dirname + path.sep + "files";
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var fileNameString = "";


//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));
app.use(express.static("files"));
app.use(express.static("uploaded")); 

//Read file 
function readFile(file) {
    return new Promise((resolve,reject) => {
        fs.readFile(uploadDirectory + path.sep + file, (err, body) => {
            if (err) {
                return reject(err);
            }
            else {
                resolve(body);
            }
        });
    });
}

//WriteFile function
function writeFile(name,body) {
    return new Promise((resolve, reject) => {
        fs.writeFile(uploadDirectory + path.sep + name, body, {flag: "wx"}, (err) => {
            if (err) {
                return reject(err);
            }
            else {
                resolve(name);
            }
        });
    }).then(readFile);
}

//Get method to load up index.html 
app.get("/", (req,res) => {
    fs.createReadStream(__dirname +"/index.html").pipe(res);
    console.log(Cache);
    if (Object.keys(Cache).length >= 1) {
        fileNameString = Object.keys(Cache)[0];
        console.log(fileNameString);
        

        let downloadPath = __dirname + "/files/" + fileNameString;
         console.log(downloadPath);
    }
});

//Post method in order to send file to server
app.post("/files", (req,res) => {
    console.log(req.files.fileName.name);
    console.log(req.files.fileName.data);
    let fileName = req.files.fileName.name;
    fileNameString = fileName;
    let fileBody = req.files.fileName.data;
    Cache[fileName] = writeFile(fileName, fileBody);


    res.send("File uploaded"); 
});

//Get request to download/access file
app.get("/files/:name", (req,res) => {
    console.log("Heya there " + req.params.name)
    res.download(__dirname + "/files/" + req.params.name);
});


//Listens to specified port / Creates the http server / Console logs result
app.listen(8080, (err) => {
    if (err) {
        console.log("Error in running the server");
    }
    else {
        console.log("Listening to port 8080");
    }
});

exports.token = fileNameString;
const async = require('async')
const fs = require('fs')
const osenv = require('osenv')
const path = require('path')

console.log("Successful import of every library")
function getUsersHomeFolder(){
  return osenv.home();
}

function getFilesInFolder(folderPath, cb){
  fs.readdir(folderPath, cb);
}


function inspectAndDescribeFile(filePath, cb){
  let result = {
    file: path.basename(filePath),
    path: filePath, type: ''
  };

  fs.stat(filePath,(err,stat) => {
    if (err){
      cb(err);
    } else {
      if(stat.isFile()){
        result.type = 'file'
      }
      if (stat.isDirectory()){
        result.type = 'directory';
      }
      cb(err, result);
    }
  });
}

function inspectAndDescribeFiles(folderPath, files, cb){
  async.map(files, (file, asyncCb) => {
    let resolvedFilePath = path.resolve(folderPath, file);
    inspectAndDescribeFile(resolvedFilePath,asyncCb);
  },cb);
}

function displayFiles(err, files){
  if (err){
    return alert('Sorry, we could not display your files');
  }
  files.forEach((file) =>{ console.log(file);});
}

function main(){
  let folderPath = getUsersHomeFolder();
  getFilesInFolder(folderPath, (err, files) => {
    if(err){
      return alert('Sorry');
    }
    console.log(typeof(files));
    inspectAndDescribeFiles(folderPath, files,displayFiles);
  });
}

folderPath = getUsersHomeFolder();
const res  = fs.readdir(folderPath,(err, files) => {console.log(files); return files;})

console.log(res)
// main();

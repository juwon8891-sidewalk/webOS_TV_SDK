const promise=require("bluebird"),path=require("path"),fs=promise.promisifyAll(require("fs-extra"));function copyToDirAsync(a,b){return fs.lstatAsync(a).then(function(c){return c.isFile()?fs.copyAsync(a,path.join(b,path.basename(a))):fs.copyAsync(a,b)})}module.exports.copyToDirAsync=copyToDirAsync;

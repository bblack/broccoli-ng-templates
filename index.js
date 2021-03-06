var fs = require('fs')
var path = require('path')
var util = require('util')
var Promise = require('bluebird')
var Writer = require('broccoli-writer')
var walk = require('walk')

module.exports = CompileNgTemplates
CompileNgTemplates.prototype = Object.create(Writer.prototype)
CompileNgTemplates.prototype.constructor = CompileNgTemplates
function CompileNgTemplates (inputTree, dest, opts) {
  if (!(this instanceof CompileNgTemplates)) return new CompileNgTemplates(inputTree, dest);
  opts = opts || {};
  this.inputTree = inputTree;
  this.dest = dest;
  this.moduleName = opts.moduleName || 'templates';
}

CompileNgTemplates.prototype.write = function (readTree, destDir) {
  var self = this;
  return readTree(self.inputTree)
  .then(function(inputTmpDir){
    return new Promise(function(resolve, reject){
      var outPath = path.join(destDir, self.dest)
      var outFileStream = fs.createWriteStream(outPath)
      .on('finish', function(){
        resolve();
      })

      var firstLine = util.format('define(function (require) { var angular = require("angular"); angular.module("%s", []).run(["$templateCache", function($templateCache) {   "use strict";\n', self.moduleName);
      outFileStream.write(firstLine);

      var walker = walk.walk(inputTmpDir, {followLinks: true})
      .on('file', function(root, fileStats, next){
        var inFilePath = path.join(root, fileStats.name)
        var url = '/' + path.relative(inputTmpDir, inFilePath)
        fs.readFile(inFilePath, function(err, data){
          outFileStream.write('$templateCache.put(\'' + url + '\',\n')
          outFileStream.write(util.inspect(data.toString()), function(){
            outFileStream.write('\n);\n')
            next();
          });
        });
      })
      .on('end', function(){
        outFileStream.write(' }])});') // lol
        outFileStream.end()
      })
    })
  })
};

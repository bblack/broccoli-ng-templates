#broccoli-ng-templates
A plugin for [Broccoli](http://github.com/broccolijs/broccoli) that compiles AngularJS templates into a single Javascript module that inserts the templates into angular's `$templateCache` service.

##Usage
At the command prompt:
```sh
npm install broccoli-ng-templates
```
In your Brocfile, given a tree `templates` that represents a directory that contains many HTML templates, and possibly subdirectories that contain more templates:
```js
templates = new compileNgTemplates(templates, 'compiled.js', {moduleName: 'myproject.templates'});
```

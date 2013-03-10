{
	// This file is described here: 
	// http://plovr.com/options.html
    "id" : "webkitjs-objects",
    "paths" : ["../src/org/webkitjs/objects"],
    "mode" : "ADVANCED",
    "level" : "VERBOSE",
    "checks": { // checks are described here: http://code.google.com/p/closure-compiler/wiki/Warnings
    	"checkTypes": "OFF",
    	"checkDebuggerStatement": "WARNING"
    },
    "inputs" : ["./src/org/webkitjs/objects/application.js", "../../sample/js/init.js"], // We start in application.js, but override it in init
    "externs" : "jquery-1.7.js", // from http://code.google.com/p/closure-compiler/source/browse/#svn%2Ftrunk%2Fcontrib%2Fexterns
    "output-file": "../../build/app.js"
    ,"jsdoc-html-output-path": "../" // jsdoc doesnt seem to work for some reason
}


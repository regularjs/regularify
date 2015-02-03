// regularify plugin
var through = require("through");

try{
  var parse = require("regularjs").parse;
}catch(e){
  try{
    var parse = require("regularjs/src/node").parse;
  }catch(e){
    console.error("you need install regularjs local")
  }
}


var DEFAULT_RGL_EXTENSION = ['rgl'];
var DEFAULT_RGLC_EXTENSION = ['rglc'];

function wrap(str, options){
  options =options || {};

  try{
    var code = parse(str, {BEGIN: options.BEGIN, END: options.END}) ;
  }catch(e){
    console.error(e);
    code= "[]";
  }
  code = 'module.exports=' + code + '';
  return code;
}


var rScript = /\<script(?:\>|\s[^>]*\>)([\s\S]+)\<\/script>/;
var rTemplate = /\<template(?:\>|\s[^>]*\>)([\s\S]+)\<\/template>/;
function wrapComponent(str, options){
  var scriptRaw;
  str = str.replace(rScript, function(all, script){
    scriptRaw = script.trim();
    //https://developer.mozilla.org/en-US/docs/Mozilla/Projects/SpiderMonkey/Parser_API
    return "";
  }).trim();


  // TODO: 
  try{
    var code = parse(str, {BEGIN: options.BEGIN, END: options.END}) ;
  }catch(e){
    console.error(e);
    code= "[]";
  }

  code = "var template=" + code + ";" + scriptRaw;
  return code;
}

module.exports = function(option){
  option = option || {};

  if(Array.isArray(option)) option = {extensions: option}

  var rgl = ( option.rgl || [] ).concat( DEFAULT_RGL_EXTENSION );
  var rglc = ( option.rglc || [] ).concat( DEFAULT_RGLC_EXTENSION );
  var BEGIN = option.BEGIN, END = option.END;

  var rglMatch = new RegExp ("\\." + rgl.join("|") + "$")
  var rglcMatch = new RegExp ("\\." + rglc.join("|") + "$")


  return function(file){
    var input = "";
    function write(buffer){
      input += buffer;
    }
    // rgl
    function end(){
      this.queue(wrap(input, {BEGIN: BEGIN, END: END} ));
      this.queue(null);
    }
    // rglc
    function endc(){
      this.queue(wrapComponent(input, {BEGIN: BEGIN, END: END} ));
      this.queue(null);
    }
    var test = rglMatch.test(file);
    if(test) return through(write, end)

    var test = rglcMatch.test(file);
    if(test){
       return through(write, endc)
    }

    return through();
  }
};
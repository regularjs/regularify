var tpl =  require("./index.rgl");
var tpl2 =  require("./index.txt");
var tpl2 =  require("./index.txt");
var Regular = require("regularjs");

var Component3 = require("./component.rglc");


var Component = Regular.extend({
  template: tpl,
  data: {list: ['leeluolee', 'boday']}
})

var Component2 = Regular.extend({
  template: tpl2,
  data: {
    name: "hello"
  }
})


new Component().$inject("#app");
new Component2().$inject("#app");
new Component3({
  data: {
    hello: "name",
    list: ["1", 2, 3]
  }
}).$inject("#app");




# a browserify transform for regularjs



### install

`npm install regularify`

### build script

```javascript


var path = require("path");
var fs = require('fs');

var regularify = require('regularify');
var browserify = require('browserify');


return browserify([path.join(__dirname, './src/index.js')])
  .transform(regularify({
    BEGIN: '{', 
    END: '}',
    rgl: ["html"],
    rglc: ["htmlc"]
  }))
  .bundle()
  .on("error", function(err){
    throw err
  })
  .pipe(fs.createWriteStream( path.join(__dirname ,"./bundle.js")))

```


## transforms


### 1.rgl

transform rgl used to preparse a template string to Regularjs's AST.


__file:`test.rgl`__

```html
<div>{hello}</div> 
{#list list as item}
  <h2>{item}</h2>
{/list}
<div class="col-sm-2">
  content body
</div>

```

will be converted to

```
module.exports = [{"type":"element","tag":"div","children":[{"type":"expression","body":"_c_._sg_('hello', _d_, 1)","constant":false,"setbody":"_c_._ss_('hello',_p_,_d_, '=', 1)"}]},{"type":"text","text":" \n"},{"type":"list","sequence":{"type":"expression","body":"_c_._sg_('list', _d_, 1)","constant":false,"setbody":"_c_._ss_('list',_p_,_d_, '=', 1)"},"variable":"item","body":[{"type":"text","text":"\n  "},{"type":"element","tag":"h2","children":[{"type":"expression","body":"_c_._sg_('item', _d_, 1)","constant":false,"setbody":"_c_._ss_('item',_p_,_d_, '=', 1)"}]},{"type":"text","text":"\n"}]},{"type":"text","text":"\n"},{"type":"element","tag":"div","attrs":[{"type":"attribute","name":"class","value":"col-sm-2"}],"children":[{"type":"text","text":"\n  content body\n"}]}];
```




### rglc

rglc precompile a html fragment to Regularjs's Component.

__Example__


__file: `test.rglc`__

```html
<div>{hello}</div> 
{#list list as item}
  <h2>{item}</h2>
{/list}
<div class="col-sm-2">
  content body
</div>


<script>

var Regular = require("regularjs");

module.exports = Regular.extend({
  template: template
})

</script>
```

will be converted to

```js
var template=[{"type":"element","tag":"div","attrs":[],"children":[{"type":"expression","body":"_c_._sg_('hello', _d_, 1)","constant":false,"setbody":"_c_._ss_('hello',_p_,_d_, '=', 1)"}]},{"type":"text","text":" \n"},{"type":"list","sequence":{"type":"expression","body":"_c_._sg_('list', _d_, 1)","constant":false,"setbody":"_c_._ss_('list',_p_,_d_, '=', 1)"},"variable":"item","body":[{"type":"text","text":"\n  "},{"type":"element","tag":"h2","attrs":[],"children":[{"type":"expression","body":"_c_._sg_('item', _d_, 1)","constant":false,"setbody":"_c_._ss_('item',_p_,_d_, '=', 1)"}]},{"type":"text","text":"\n"}]},{"type":"text","text":"\n"},{"type":"element","tag":"div","attrs":[{"type":"attribute","name":"class","value":"col-sm-2"}],"children":[{"type":"text","text":"\n  content body\n"}]}];

var Regular = require("regularjs");
module.exports = Regular.extend({
  template: template
})
```

`rglc` will inject a variable named template for you which represent the html in same file. 

`rglc` exports a standard Regular Component.


## __option__

1. BEGIN: the BEGIN_TAG for regularjs template, the default is "{"
2. END: the END_TAG for regularjs template, the default is "}"
3. rgl: the custom extension for regularjs's template, the DEFAULT is ['rgl']. passed extensions will concat with DEFAULT EXTENSIONS
3. rglc: the custom extension for regularjs's component, the DEFAULT is ['rglc']. passed extensions will concat with DEFAULT EXTENSIONS




see the [https://github.com/regularjs/regularify/tree/master/example](https://github.com/regularjs/regularify/tree/master/example) folder for help

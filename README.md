# Modular HTML dialog windows
Custom modular HTML dialogs. Don't let the `window.prompt/alert/etc.` functions limit you!
###### Also useful to prevent user mistakenly blocking window dialogs.
### Contents
- `modularDialog.js` - the library itself
- `modularDialog.css` - template for styling the dialog
### Usage
The `Dialog()` functions takes two parameters:
- `parent` - the node to append the dialog to
- `structure` - an object defining the dialog's structure
and what inputs the dialog needs to provide and return (see example below).

Structure xample:
```
{
    title : "<any string>",
    description : "<any string, supports HTML>", --optional
    inputs : { --optional
        "[inputname]" : { ... (input data) },
        "[inputname2]" : { ... (input data) },
        "[inputname3]" : { ... (input data) },
        "[inputname4]" : { ... (input data) }
    },
    options : {
        completeDialog : {
            label : "<any string>",
            callback : () => {}
        },
        abortDialog : {
            label : "<any string>",
            callback : () => {}
        }
    }
}
```
Input data:
```
description : "<any string>" --optional

type : "text|number|checkbox|<whatever else...>"

defaultValue : [default input value]

attributes : { } [all HTML attributes to apply to the input, format: {"attrName" : "attrValue"}]
```

Default options:
- completeDialog - returns an `HTMLCollection<HTMLInputElement>` containing the dialog inputs, so their value can be read
- abortDialog - returns `null`
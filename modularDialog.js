
/*
The Dialog() functions takes an object as parameter, which should define the dialog structure
and what inputs the dialog needs to provide and return (see example below).
Also, useful to prevent user mistakenly blocking window dialogs.

Example:
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

Input data:
    description : "<any string>" --optional
    type : "text|number|checkbox|<whatever else...>" (raw html can be used by setting the next value to true)
    raw : true/false (whether the "type" field contains raw html)
    defaultValue : [default input value]
    attributes : { } [all HTML attributes to apply to the input, format: {"attrName" : "attrValue"}]

Default options:
    completeDialog - calls the callback function, passing an object in which:
        - the keys correspond to the ones in the <inputs> field
        - the values hold the dialog's HTMLInput elements, so that their value can be read
        - NOTE THAT WHEN USING CUSTOM HTML AS AN INPUT'S TYPE, IT IS NOT GUARANTEED
          THAT A VALUE CAN BE EXTRACTED FROM IT, so, for such inputs, the value may be null or undefined
    abortDialog - calls the callback function, passing null

*/
function Dialog(parent, structure) {
    const addhr = () => wrapper.appendChild(document.createElement("hr"))

    const wrapper = document.createElement("div")
    wrapper.className = "dialog-wrapper"
    wrapper.id = `dialog-${crypto.randomUUID()}`

    // Build the title
    if (!isEmptyString(structure.title)) {
        const title = document.createElement("h1")
        title.className = "dialog-title"
        title.innerText = firstLetterUpper(structure.title)
        wrapper.appendChild(title)
    }

    // Build the description
    if (!isEmptyString(structure.description)) {
        const description = document.createElement("p")
        description.className = "dialog-description"
        description.innerHTML = structure.description
        wrapper.appendChild(description)
    }

    if (isObject(structure.inputs)) addhr()

    // Build the input fields
    const inputMap = {} // structure.inputs.[name] -> HTMLInputElement.id
    const inputsClass = `${wrapper.id}-input-field`
    const inputs = document.createElement("div")
    inputs.className = "dialog-inputs-wrapper"
    if (isObject(structure.inputs)) for (const [name, options] of Object.entries(structure.inputs)) {
        const id = `dialog-input-${name}-${crypto.randomUUID()}`
        inputMap[name] = id
        if (options.raw) {
            inputs.innerHTML += options.type
        } else {
            inputs.appendChild(createInputField(id, inputsClass, name, options.description, options.type, options.defaultValue, options.attributes))
        }
    }
    wrapper.appendChild(inputs)

    addhr()

    // Build the option buttons
    const callbackWrapper = (c) => {
        c()
        wrapper.remove()
    }
    const options = document.createElement("div")
    options.className = "dialog-options-wrapper"

    const optionAbort = document.createElement("button")
    optionAbort.className = "dialog-options-button dialog-options-buttonAbort"
    optionAbort.innerText = structure.options.abortDialog.label
    optionAbort.onclick = () => {
        callbackWrapper(() => { structure.options.abortDialog.callback(null) })
    }
    options.appendChild(optionAbort)

    if (isObject(structure.options.completeDialog)) {
        const optionComplete = document.createElement("button")
        optionComplete.className = "dialog-options-button dialog-options-buttonComplete"
        optionComplete.innerText = structure.options.completeDialog.label
        optionComplete.onclick = () => {
            const results = {}
            for (const [name, id] of Object.entries(inputMap)) {
                results[name] = document.getElementById(id)
            }
            callbackWrapper(() => {
                structure.options.completeDialog.callback(results)
            })
        }
        options.appendChild(optionComplete)
    }

    // Wrap options together
    wrapper.appendChild(options)

    // Append the dialog
    parent.appendChild(wrapper)
}

// Utility
/* --------------------------- */

const createInputField = (id, class_string, title_string, description_string, type, default_, attributes) => {
    const wrapper = document.createElement("div")
    wrapper.className = "dialog-input"

    const input = document.createElement("input")
    input.className = `${class_string} dialog-input-field`
    input.type = type
    input.value = !isEmptyString(default_) ? default_ : null
    input.id = id
    if (isObject(attributes)) for (const [k, v] of Object.entries(attributes)) {
        input.setAttribute(k, v)
    }

    const title = document.createElement("h4")
    title.className = "dialog-input-title"
    const titleLabel = document.createElement("label")
    titleLabel.setAttribute("for", input.id)
    titleLabel.innerText = firstLetterUpper(title_string)
    title.appendChild(titleLabel)

    const description = document.createElement("p")
    description.className = "dialog-input-description"
    description.innerText = description_string

    // Build input field
    wrapper.appendChild(title)
    wrapper.appendChild(input)
    if (description_string!=null && !isEmptyString(description_string)) wrapper.appendChild(description)
    // Return the built input field
    return wrapper
}

const isEmptyString = (str) => {return str===undefined || str.replace(/\s/g, '')===""}

const isObject = (obj) => typeof obj === 'object' && obj instanceof Object && !Array.isArray(obj) && obj.constructor !== Date;

const firstLetterUpper = (text) => {return !isEmptyString(text) ? text[0].toUpperCase() + text.substring(1, text.length) : ""}

/* --------------------------- */

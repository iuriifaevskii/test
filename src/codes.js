function getCode(codeString) {
    const regExpValidCode = /\w*/;
    const codeExp = codeString.match(regExpValidCode);
    if (Array.isArray(codeExp)) {
        return codeString.match(regExpValidCode)[0];
    } else {
        return codeString.match(regExpValidCode);
    }
}

function showCodes(validCodes, invalidCodes) {
    if (validCodes && validCodes.length > 0) {
        document.getElementById("validCodes").innerHTML = validCodes;
    }
    if (invalidCodes && validCodes.length > 0) {
        document.getElementById("invalidCodes").innerHTML = invalidCodes;
    }
}

function onLoad() {
    const validCodes = [];
    const invalidCodes = [];
    const items = document.querySelectorAll(".list p");
    const regExpIsNotValid = /is not [a,v]/i
    
    for (let i = 0; i < items.length; i++) {
        if(items[i].innerText && regExpIsNotValid.test(items[i].innerText)) {
            validCodes.push(getCode(items[i].innerText));
        } else {
            invalidCodes.push(getCode(items[i].innerText));
        };
    }
    
    showCodes(validCodes, invalidCodes);
}

onLoad();
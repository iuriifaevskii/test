//https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.5.1/bluebird.min.js
//https://www.jjill.com

const bluebird = document.createElement("script");
bluebird.type = "text/javascript";
bluebird.src = "https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.5.1/bluebird.min.js";
document.head.appendChild(bluebird);


const codes = [
    'NTB0318',
    'PRW0318A',
    'SB031803',
    //'GMA0318',
    //'WW1803C',
    //'CA031801'
]
const codesSuccessful = [];

let authRequestParams = new URLSearchParams();

function _getRequestParams(code) {
    const form = document.querySelector('form#PromotionCodeForm');
    const formParams = new FormData(form);
    const requestParams = new URLSearchParams();
    const token = getToken();
    for (let param of formParams) {
        //if (param[0] !== 'authToken') {
        //    authRequestParams.set(param[0], param[1]);
        //}
        //if (param[0] !== 'requesttype') {
        //    authRequestParams.set(param[0], param[1]);
        //}
        if (code && param[0] === 'promoCode') {
            requestParams.set(param[0], code);
        } else {
            requestParams.set(param[0], param[1]);
        }
        
    }
    requestParams.set('requesttype','ajax');
    requestParams.set('authToken',token);
    return `${requestParams.toString()}`;
}

function getToken() {
    return document.querySelector('#csrf_authToken').getAttribute('value');
}

function _applyCode(code) {
    return fetch (window.location.protocol + '//' + window.location.host + '/AjaxRESTPromotionCodeApply', {
        method: 'POST',
        credentials: 'include',
        body: _getRequestParams(code),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }).then(result => {
        return fetch(window.location.href, {
            credentials: 'include',
        }).then(res => res.text())
    });
}

function _parseTotal(total) {
    const regexp = /\d+([\.,]\d+)?/g;
    if(regexp.test(total)) {
        return parseFloat(total.match(regexp)[0]);
    } else {
        return null;
    };
}

function _codeRemove(code) {
    return fetch (window.location.protocol + '//' + window.location.host + '/AjaxRESTPromotionCodeRemove', {
        method: 'POST',
        credentials: 'include',
        body: _getRequestParams(code),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }).then(result => {
        return fetch(window.location.href, {
            credentials: 'include',
        }).then(res => res.text())
    });
}


function _parseTotalFromRequest(resultHtml) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(resultHtml, "text/html");
    const totalNode = doc.querySelector('span#totalPrice')
    return _parseTotal(totalNode.textContent);
}

function parseCodeName(code) {
    return code.replace(/(\s)/g, "");
}

async function firstApply() {
    const removeCodeLink = document.querySelector('.promo-code-wrapper a.font1');
    const code = document.querySelector('#PromotionCodeForm div span.bold');
    
    if (removeCodeLink && code) {
        const parsedCode = parseCodeName(code.textContent);
        return await removeCode(parsedCode);
    } else {
        return await applyCode();
    }
    /*
    let totalWithCode;
    let totalWitoutCode;

    if (removeCodeLink) {
        console.log(removeCodeLink);
        console.log(parsedCode)
        totalWitoutCode = await removeCode(parsedCode);
        console.log('totalWitoutCode:1', totalWitoutCode)
        //totalWithCode = await applyCode(parsedCode);

        //totalWitoutCode = await removeCode(parsedCode);
        /////////applyCodes(codes, totalWithCode)
    } else {
        totalWitoutCode = await applyCode();
        console.log('totalWitoutCode:2', totalWitoutCode)
        //totalWitoutCode = await removeCode(parsedCode);
    }
    */
}

//let code = 'NTB0318'

function applyCode(code) {
    _applyCode(code).then(resultHtml => {
        console.log('?1', _parseTotalFromRequest(resultHtml))
        return _parseTotalFromRequest(resultHtml)
    });
}

function removeCode(code) {
    _codeRemove(code).then(resultHtml => {
        console.log('?2', _parseTotalFromRequest(resultHtml))
        return _parseTotalFromRequest(resultHtml)
    });
}

async function _compareTotalToGetDiscount(code, totalWithoutCode) {
    const totalWithCode = await _applyCode(code);
    removeCode(code);
    const discount = parseFloat(totalWithoutCode - totalWithCode).toFixed(2);
    if (totalWithCode < totalWithoutCode) {
        codesSuccessful.push({code, discount});
    }
}

async function applyAllCodes(arrayCodes) {
    const total = await firstApply();
    Promise.each(arrayCodes, (item) => {
        return _compareTotalToGetDiscount(item, total);
    });
}

const button = document.createElement('button');
button.innerText = 'INIT SCRIPT';
button.style.position = 'fixed';
button.style.top = '0px';
button.style.left = '0px';
document.body.appendChild(button);
button.addEventListener('click', () => {
    applyAllCodes(codes)
});
const codes = [
    'NTB0318',
    'PRW0318A',
    'SB031803',
    'GMA0318',
    'WW1803C',
    'CA031801'
]

let authRequestParams = new URLSearchParams();

function _applyCode(code) {
    return fetch (window.location.protocol + '//' + window.location.host + '/AjaxRESTPromotionCodeApply', {
        method: 'POST',
        credentials: 'include',
        body: 'orderId=%5BLjava.lang.String%3B%40e8d588bc&taskType=A&URL=&storeId=10101&catalogId=10051&langId=-1&finalView=AjaxOrderItemDisplayView&promoCode=NTB0318&requesttype=ajax&authToken=5770456%252CgJQQDO1HZg%252F28TXjAqcHFQAa4Eas%252FcHB%252F0S6E6qMlak%253D',//_getRequestParams(code),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }).then(result => result.text())
}

function checkApplyResult(code) {
    const regexp = /"promoCode": \["(.*?)"\]/g;
    return regexp.test(code);
}

function _parseTotal(total) {
    const regexp = /\d+([\.,]\d+)?/g;
    if(regexp.test(total)) {
        return parseFloat(total.match(regexp)[0]);
    } else {
        return null;
    };
}

function _codeUpdate(code) {
    return fetch (window.location.protocol + '//' + window.location.host + '/AjaxRESTOrderItemUpdate', {
        method: 'POST',
        credentials: 'include',
        body: _getRequestParams(code),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }).then(result => code)
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
        return _codeUpdate(code).then(result => {
        });
        //result.text()
    });
}

function _parceTotalForCode(code) {
    return fetch (window.location.protocol + '//' + window.location.host + '/OrderSummaryView', {
        method: 'POST',
        credentials: 'include',
        body: _getRequestParams(),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }).then(result => result.text())
}

function _parseTotalFromRequest(code) {
    return _parceTotalForCode(code).then(resultHtml => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(resultHtml, "text/html");
        
        const totalNode = doc.querySelector('span#totalPrice')
        return _parseTotal(totalNode.textContent);
    });
}

function isCodeApplied(doc) {
    const removeCodeLink = doc.querySelector('.promo-code-wrapper a.font1');
    if (removeCodeLink) {
        console.log(removeCodeLink);
        //remove existing code

        //applied
    } else {
        //applied
    }
}

function _getRequestParams(code) {
    const form = document.querySelector('form#PromotionCodeForm');
    const formParams = new FormData(form);
    const requestParams = new URLSearchParams();
    
    for (let param of formParams) {
        if (param[0] !== 'authToken') {
            authRequestParams.set(param[0], param[1]);
        }
        if (param[0] !== 'requesttype') {
            authRequestParams.set(param[0], param[1]);
        }
        if (code && param[0] === 'promoCode') {
            requestParams.set(param[0], code);
        } else {
            requestParams.set(param[0], param[1]);
        }
    }
    console.log(requestParams.toString())
    //if (isDeleteAjax)
    return requestParams.toString();
}
let code = 'NTB0318'
_applyCode(code).then(result => {
    _codeUpdate(code).then(code => {
        if (checkApplyResult(result)) {
            _parseTotalFromRequest(code).then(total => console.log(total))
        }
    });
});

_codeRemove(code).then(result => {
    _codeUpdate(code).then(code => {
        if (checkApplyResult(result)) {
            _parseTotalFromRequest(code).then(total => console.log(total))
        }
    });
});
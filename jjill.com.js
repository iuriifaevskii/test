const Driver = class Driver {
    constructor() {
        //super();
        this.codesSuccessful = [];
        this.TOTAL_SELECTOR = 'span#totalPrice';
        this.FORM_SELECTOR = 'form#PromotionCodeForm';
        this.TOKEN_SELECTOR = '#csrf_authToken';
    }

    _firstApply() {
        const removeCodeLink = document.querySelector('.promo-code-wrapper a.font1');
        const code = document.querySelector('#PromotionCodeForm div span.bold');
        if (removeCodeLink && code) {
            const parsedCode = this._parseCodeName(code.textContent);
            return this._removeCode(parsedCode).then(res => this._applyCode());
        } else {
            return this._applyCode();
        }
    }

    _parseCodeName(code) {
        return code.replace(/(\s)/g, "");
    }

    _toFloat(value) {
        return parseFloat(value).toFixed(2);
    }

    checkCodes(codes) {
        const testCode = codes[0];
        return this._firstApply().then(originalPrice => {
            //return Promise.each(codes, code => {
                return this._applyCode(/*code*/testCode)
                    .then(resopnsefinalPrice => {
                        const finalPrice = this._toFloat(resopnsefinalPrice);
                        const finalDiscount = originalPrice - finalPrice;
                        return this._removeCode(/*code*/testCode)
                            .then(() => {
                                //bus.$emit('code-checked', {code, finalPrice, finalDiscount});
                                if (finalPrice < originalPrice) {
                                    this.codesSuccessful.push({/*code*/code: testCode, finalPrice, finalDiscount});
                                }
                                
                                return Promise.resolve();
                            });
                    //});
            }).then(result => this._chooseBest());
        });
    }

    _chooseBest() {
        const pricesSuccessful = this.codesSuccessful.map(item => item.finalDiscount);
        const maxDiscount = Math.max(...pricesSuccessful);
        const codeObj = this.codesSuccessful.find(item => this._toFloat(item.finalDiscount) === this._toFloat(maxDiscount));
        if (this.codesSuccessful.length > 0) {
            this._applyCode(codeObj.code).then(res => location.reload());
        }
    }

    _getRequestParams(code) {
        const form = document.querySelector(this.FORM_SELECTOR);
        const formParams = new FormData(form);
        const requestParams = new URLSearchParams();
        const token = this._getToken();
        for (let param of formParams) {
            if (code && param[0] === 'promoCode') {
                requestParams.set(param[0], code);
            } else {
                requestParams.set(param[0], param[1]);
            }
        }
        requestParams.set('requesttype', 'ajax');
        requestParams.set('authToken', token);
        return requestParams.toString();
    }

    _getToken() {
        return document.querySelector(this.TOKEN_SELECTOR).getAttribute('value');
    }

    _parseTotalFromHtml(resultHtml) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(resultHtml, "text/html");
        const totalNode = doc.querySelector(this.TOTAL_SELECTOR);
        return this._parseTotal(totalNode.textContent);
    }

    _parseTotal(total) {
        const regexp = /\d+([\.,]\d+)?/g;
        if(regexp.test(total)) {
            return this._toFloat(total.match(regexp)[0]);
        } else {
            return null;
        };
    }

    _applyCode(code) {
        return fetch ('https://www.jjill.com/AjaxRESTPromotionCodeApply', {
            method: 'POST',
            credentials: 'include',
            body: this._getRequestParams(code),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).then(result => {
            return fetch(window.location.href, {
                method: 'GET',
                credentials: 'include',
            }).then(result => result.text())
            .then(resultHtml => this._parseTotalFromHtml(resultHtml))
        });
    }

    _removeCode(code) {
        return fetch ('https://www.jjill.com/AjaxRESTPromotionCodeRemove', {
            method: 'POST',
            credentials: 'include',
            body: this._getRequestParams(code),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).then(result => {
            return fetch(window.location.href, {
                method: 'GET',
                credentials: 'include',
            }).then(res => res.text())
        });
    }
}
const codes = [
    'NTB0318',
    'PRW0318A',
    'SB031803',
];

const button = document.createElement('button');
button.innerText = 'INIT SCRIPT';
button.style.position = 'fixed';
button.style.top = '0px';
button.style.left = '0px';
document.body.appendChild(button);
button.addEventListener('click', () => {
    const driver = new Driver();
    driver.checkCodes(codes)
});
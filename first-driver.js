//https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.5.1/bluebird.min.js
//https://www.swap.com/checkout/shipping/

class Driver {
    constructor() {
        this.codes = [
            'PZ6VXDJ',
            'BIGBOO40',
            '10SPRING',
            'SWAP4HER40',
        ];
        this.codesSuccessful = [];
    }

    _getRequestParams(code) {
        const form = document.querySelector('form#discount-code');
        const formParams = new FormData(form);
        const requestParams = new URLSearchParams();
        for (let param of formParams) {
            if (code && param[0] === 'discount_code') {
               requestParams.set(param[0], code);
            } else {
                requestParams.set(param[0], param[1]);
            }
        }
        return requestParams.toString();
    }

    _parseTotal(total) {
        const regexp = /\d+([\.,]\d+)?/g;
        if(regexp.test(total)) {
            return parseFloat(total.match(regexp)[0]);
        } else {
            return null;
        };
    }

    _applyCode(code) {
        return fetch(window.location.href, {
            method: 'POST',
            credentials: 'include',
            body: this._getRequestParams(code),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).then(result => result.text())
    }

    _parseTotalFromRequest(code) {
        return this._applyCode(code).then(resultHtml => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(resultHtml, "text/html");
            
            const priceNodes = doc.querySelectorAll('.summary-line.item-line')
            const sum = [...priceNodes].map(item => {
                const discountedElement = item.querySelector('.discounted-price');
                if (discountedElement) {
                    return this._parseTotal(discountedElement.textContent);
                } else {
                    let originalPrice = item.querySelector('strong');
                    return this._parseTotal(originalPrice.textContent);
                }
            });
            return sum.reduce((a, b) => a + b, 0);
        })
    }

    async _compareTotalToGetDiscount(code, totalWithoutCode) {
        const totalWithCode = await this._parseTotalFromRequest(code);
        const discount = parseFloat(totalWithoutCode - totalWithCode).toFixed(2);
        if (totalWithCode < totalWithoutCode) {
            this.codesSuccessful.push({code, discount});
        }
    }

    async applyAll() {
        const total = await this._parseTotalFromRequest();
        Promise.each(this.codes, (item) => {
            return this._compareTotalToGetDiscount(item, total)
        }).then(res => {
            if (res) {
                this.chooseBest()
            }
        });
    }

    chooseBest() {
        const pricesSuccessful = this.codesSuccessful.map(item => item.discount);
        const maxDiscount = Math.max(...pricesSuccessful);
        const codeObj = this.codesSuccessful.find(item => item.discount === parseFloat(maxDiscount).toFixed(2));
        if (this.codesSuccessful.length > 0) {
            this._applyCode(codeObj.code).then(res => {
                const input = document.querySelector('#discount-input');
                input.value = codeObj.code;
                console.log(`succesfull code is ${codeObj.code} with discount ${codeObj.discount}`);
                document.querySelector('form#discount-code').submit();
            });
        }
    }
}

const driver = new Driver();

const button = document.createElement('button');
button.innerText = 'INIT SCRIPT';
button.style.position = 'fixed';
button.style.top = '0px';
button.style.left = '0px';
document.body.appendChild(button);
button.addEventListener('click', () => {
    driver.applyAll();
})
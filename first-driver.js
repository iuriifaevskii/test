//https://www.swap.com/checkout/shipping/
//https://www.retailmenot.com/view/swap.com?c=9611041&redemptionChannel=online

class Driver {
    constructor() {
        this.codes = [
            'BEBOLD',
            'bigboo40',
            'SPEND100SAVE20',
            'DOLLARDIG35',
            'SWAP4HER40'
        ];
        this.codesSuccessful = [];
        this.total = 0;
    }

    _getRequestParams(code) {
        const form = document.querySelector('form[id=discount-code]');
        const formParams = new FormData(form);
        const requestParams = new URLSearchParams();
        for (let param of formParams) {
            if (code) {
                if (param[0] === 'discount_code') {
                    requestParams.set(param[0], code);
                } else {
                    requestParams.set(param[0], param[1]);
                }
            } else {
                requestParams.set(param[0], param[1]);
            }
        }
        return requestParams.toString();
    }

    async _applyCode(code) {
        try {
            const html = await fetch(window.location.href, {//'https://www.swap.com/checkout/shipping/', {//window.location.href, {
                method: 'POST',
                credentials: 'include',
                body: this._getRequestParams(code),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });
            return html.text();
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    _parseTotal(total) {
        const regexp = /\d+([\.,]\d+)?/g;
        if(regexp.test(total)) {
            return parseFloat(total.match(regexp)[0]);
        } else {
            return null;
        };
    }

    async _parseTotalFromRequest(code) {
        try {
            const html = await this._applyCode(code);
            const totalStr = document.querySelector('strong[id=order-total]').textContent;
            const totalPrice = this._parseTotal(totalStr);
            return totalPrice;
        } catch (e) {
            return e;
        }
    }

    _BestCode() {
    }

    _maxDiscount() {
    }

    async _compareTotalToGetDiscount(code, totalWithoutCode) {
        try {
            const totalWithCode = await this._parseTotalFromRequest(code);
            const discount = totalWithoutCode - totalWithCode;
            if (totalWithCode < totalWithoutCode) {
                this.codesSuccessful.push({code, discount});
            }
            return this.codesSuccessful;
        } catch (e) {
            return e
        }
    }

    async iterateCodes() {
        this.total = await this._parseTotalFromRequest();
        for (let i = 0; i < this.codes.length; i++) {
            this._compareTotalToGetDiscount(this.codes[i], this.total);
        }
    }

    async storeCodeAndDiscount() {
    }

    successfullCode() {
    }
}

const driver = new Driver();
driver.iterateCodes();

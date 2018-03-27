'use strict';
const BaseDriver = require('../base.js');
const bus = require('../../bus.js');
const Promise = require('bluebird');
const utils = require('../../../utils');
const elemToFloat = utils.format.elemToFloat;
const extractElementFromHTML = utils.DOM.extractElementFromHTML;
const extractFormValues = utils.DOM.extractFormValues;

const BASE_URL = 'https://www.ediblearrangements.com';

const Driver = class Driver extends BaseDriver {
	constructor() {
		super();
		this.TOTAL_SELECTOR = '.footer span ~ .boldText';
        this.APPLIED_CODES_SELECTOR = 'input[name="ctl00$cpBody$rptSale$ctl00$txtCoupon"]';
		this.FORM_SELECTOR = 'form[name="aspnetForm"]';

		this.APPLY_RID_PARAMETER = document.querySelector('table .rInfo').getAttribute('RID');
		
		this.requestData = extractFormValues(this.FORM_SELECTOR);
		this.requestData.params.set('ctl00$cpBody$FruitCartScriptManager', 'ctl00$cpBody$upnlSale|ctl00$cpBody$rptSale$ctl00$btnApplyCoupon');
		this.requestData.params.set('__ASYNCPOST', true);
		this.requestData.params.set('ctl00$cpBody$rptSale$ctl00$btnApplyCoupon.x', 0);
		this.requestData.params.set('ctl00$cpBody$rptSale$ctl00$btnApplyCoupon.y', 0);
    }

    getExistingCodes() {
        const codes = [...document.querySelectorAll(this.APPLIED_CODES_SELECTOR)].map(element => element.defaultValue);
        return {
            codes: codes,
            codeCount: codes.length
        };
    }

	applyCodes(codes) {
		return this.applyCode(codes[0]);
    }

	checkCodes(codes, originalPrice) {
	if (!originalPrice) {
		originalPrice = this._parseTotal();
	}
	return Promise.each(codes, code => {
		return this._applyCode(code)
			.then(resopnseHtml => {
				const finalPrice = this._parseTotal(resopnseHtml);
				const finalDiscount = originalPrice - finalPrice;
				bus.$emit('code-checked', {code, finalPrice, finalDiscount});
			});
		});
	}

	_applyCode(code) {
		this.requestData.params.set('ctl00$cpBody$rptSale$ctl00$txtCoupon', code)
        return fetch(`${this.BASE_URL}/Fruit-Cart.aspx?CRID=${this.APPLY_RID_PARAMETER}`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Accept': 'application/json, text/javascript, */*; q=0.01',
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
                'pragma': 'no-cache',
                'x-microsoftajax': 'Delta=true'
			},
			body: this.requestData.params
		}).then(response => response.text());
	}
	
	_parseTotal(data) {
		let totalElement = null;
		if (data) {
			totalElement = extractElementFromHTML(data, this.TOTAL_SELECTOR);
		} else {
			totalElement = document.querySelector(this.TOTAL_SELECTOR);
		}
		return elemToFloat(totalElement);
	}
};

module.exports = {
	name: 'Edible',
	domain: 'ediblearrangements.com',
	Driver: Driver,
	isOnCartUrl(href) {
		return href.match(/https:\/\/www\.ediblearrangements\.com\/fruit-cart\.aspx/i);
	}
};

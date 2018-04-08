var cartString = sessionStorage.getItem('__fxo-cart__')
var cartJson = JSON.parse(cartString);
var token = sessionStorage.getItem('securityToken');
var products = cartJson.collection.map(item => {
	return {id: item.id, quantity: item.qty}
});


var body = {
    order: {
        coupons: [{couponCode: "TMP821"}],
        fedExAccount: "",//????
        products: cartJson.collection,
        recipients: [
            {
                pickup: {center: null},
                products,
                shippingAccount: cartJson.shippingFedexAccount
            }
        ],
    }
};
//???
fetch('https://api.fedex.com/rate/fedexoffice/v1/orderrates', {
    method: 'OPTIONS',//POST
    credentials: 'include',
	mode:'cors',
    headers: {
        //'Content-Type': '*',
        'Authorization': `Bearer ${token}`,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'authorization,content-type',
        'Connection': 'keep-alive',
    }
}).then(result => {
    console.log('??')
    fetch('https://api.fedex.com/rate/fedexoffice/v1/orderrates', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(body),
    	mode: 'cors',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    }).then(result => result.json())
})





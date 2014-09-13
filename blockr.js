// http://btc.blockr.io/documentation/api
var Blockr = (function() {

    var _coin = "btc";
    var validCoins = ["btc", "btct", "ltc", "dgc", "qrk", "ppc", "mec"];

    function baseUrl() {
        return "http://" + _coin + ".blockr.io/api/v1";
    }

    function request(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                var data;
                if (xhr.status == 200) {
                    try {
                        data = JSON.parse(xhr.responseText);
                    } catch(e) {
                        data = { "status" : "error", "message" : e.toString() };
                    }
                } else {
                    data = { "status" : "error", "message" : xhr.statusText };
                }
                callback(data);
            }
        };
        xhr.send();
    }

    return {
        setCoin : function(coin) {
            if (validCoins.indexOf(coin)!=-1) {
                _coin = coin;
            }
        },
        coin : {
            info : function(callback) { request(baseUrl() + "/coin/info", callback); }
        },
        exchangerate : {
            current : function(callback) { request(baseUrl() + "/exchangerate/current", callback); }
        },
        block : {
            info : function(block, callback) { request(baseUrl() + "/block/info/" + block, callback); },
            txs  : function(block, callback) { request(baseUrl() + "/block/txs/" + block, callback); },
            raw  : function(block, callback) { request(baseUrl() + "/block/raw/" + block, callback); }
        },
        tx : {
            info : function(hash, callback, amount_format) {
                amount_formar = amount_format || "string";
                request(baseUrl() + "/tx/info/" + hash + "?amount_format=" + amount_format, callback);
            },
            raw  : function(hash, callback) { request(baseUrl() + "/tx/raw/" + hash, callback); }
        },
        unconfirmed : {
            info : function(callback) { request(baseUrl() + "/zerotx/info/" + hash, callback); }
        },
        address : {
            info : function(address, callback, confirmations, amount_format) {
                amount_formar = amount_format || "string";
                confirmations = confirmations || 15;
                request(baseUrl() + "/address/info/" + address + "?confirmations=" + confirmations + "&amount_format=" + amount_format, callback);
            },
            balance : function(address, callback, confirmations) {
                confirmations = confirmations || 15;
                request(baseUrl() + "/address/balance/" + address + "?confirmations=" + confirmations, callback);
            },
            txs : function(address, callback) {
                request(baseUrl() + "/address/txs/" + address, callback);
            },
            unspent : function(address, callback, unconfirmed, multisigs) {
                unconfirmed = unconfirmed || 0;
                multisigs = multisigs || 0;
                request(baseUrl() + "/address/unspent/" + address + "?unconfirmed=" + unconfirmed + "&multisigs=" + multisigs, callback);
            },
            unconfirmed : function(address, callback) {
                request(baseUrl() + "/address/unconfirmed/" + address, callback);
            }
        }
    };
})();

// EXAMPLE
Blockr.coin.info(function(o) {
    console.log(o);
});
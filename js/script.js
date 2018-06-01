//Builds Coin API request
function coinApiData(symbol) {
	var apiKey = "&apikey=0D2C1A9D-23FC-4EA0-904A-A37A2C5514D8";
	var period = "/history?period_id=1DAY";
	var startTime = "&time_start=" + moment().subtract(30, 'days').format();
	var limit = "&limit=" + 30;
	var queryURL = "https://rest.coinapi.io/v1/ohlcv/" + symbol + period + startTime + limit + apiKey; 
	var parsedData
	$.ajax({
		url: queryURL,
		method: "GET" 
	}).then(function(response) {
		console.log(response);
		parsedData = parseData(response);
		console.log(parsedData);
		calculateVolatility(parsedData);
		console.log(symbol);
	}).then(function() {

	});
};
function parseData(data) {
	var arr = [];
	for (i=0; i<data.length; i++) {
		arr.push ({
        date: new Date(data[i].time_period_start),
        price: data[i].price_close
   		});
	}
	return arr;
}

var coinObject = [];

//Builds CryptoCompare API request
function cryptoCompareData(symbol1, symbol2, exchange) {
	var limit = "&limit=" + 30;
	var queryURL = "https://min-api.cryptocompare.com/data/histoday?" + "fsym=" + symbol1 + "&tsym=" + symbol2 + limit + "&e=" + exchange + "&tryConversion=false"; 
	var parsedData
	$.ajax({
		url: queryURL,
		method: "GET" 
	}).then(function(response) {
		//parses the data
		parsedData = parseDataCompare(response.Data);
		console.log(parsedData);
		var past = parsedData[0].price;
		var current = parsedData[30].price;
		//calculate volatility
		// calculateVolatility(parsedData);
		//calculate market cap
		//calculate growth rate
		console.log("hello")
		var growthRates = getPercentageChange(past, current);
	}).then(function(response) {
		//build the object
		var key = symbol1;
		var symbol1 = {};
		symbol1[key] = parsedData[0].price;
		growthRates.push(symbol1);
		console.log(growthRates)
	});
};

function parseDataCompare(data) {
	var arr = [];
	for (i=0; i<data.length; i++) {
		arr.push ({
        date: new Date (moment.unix(data[i].time).format("YYYY-MM-DD HH:mm")),
        price: data[i].close,
   		});
	};
	return arr;
};

function getPercentageChange(pastNumber, currentNumber){
       var changeValue = currentNumber - pastNumber;
       return (changeValue / pastNumber) * 100;
   };


function calculateVolatility(data) {
	var arr = []; 
	for (i=0;i<(data.length-1);i++) {
		interdayReturn = (data[i+1].price-data[i].price)/data[i].price;
		arr.push(interdayReturn);
	};
	console.log(arr);
	var stdArr = math.std(arr);
	var annualized = Math.sqrt(365)*stdArr;
	console.log(stdArr);
	console.log(annualized);
};


function calculateMarketCap(symbol1) {
	var queryURL = "https://api.coinmarketcap.com/v2/ticker/?convert=CAD&limit=10&structure=array";
	$.ajax({
		url: queryURL,
		method: "GET" 
	}).then(function(response) {
		var results = response.data;
		console.log(results);
		for (var i=0; i<results.length; i++) {
        if (results[i].symbol === symbol1) {
            console.log (results[i].quotes.CAD.market_cap);
        };
    };
	})
};



//API calls

// calculateMarketCap("LTC");
// coinApiData("KRAKEN_SPOT_BTC_CAD"); 
// coinApiData("KRAKEN_SPOT_ETH_CAD"); 
// coinApiData("KRAKEN_SPOT_XRP_CAD"); 
// cryptoCompareData("LTC","CAD","QUADRIGACX"); 
// cryptoCompareData("BCH","CAD","QUADRIGACX"); 
// cryptoCompareData("BTC","CAD","QUADRIGACX"); 
// cryptoCompareData("BTC","CAD","COINBASE"); // prices all the same
// cryptoCompareData("BTC","CAD","LAKEBTC"); 
// coinApiData("1BTCXE_SPOT_BTC_CAD"); //dates are strange
cryptoCompareData("ETH","CAD","QUADRIGACX"); 

// https://api.quadrigacx.com/public/info

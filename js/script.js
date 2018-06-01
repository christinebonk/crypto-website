var coinArray = [];
var sortedArray;

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
		//build object 
		var obj = {};
		obj["name"] = symbol1;
		//calculate growth and price
		var past = parsedData[0].price;
		var current = parsedData[30].price;
		var growthRates = getPercentageChange(past, current);
		obj["growth"] = growthRates.toFixed(2);
		obj["price"] = current.toFixed(2);
		//calculate volatility
		var volatility = calculateVolatility(parsedData);
		obj["volatility"] = volatility.toFixed(2);
		coinArray.push(obj);
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
	var stdArr = math.std(arr)*100;
	var annualized = Math.sqrt(365)*stdArr;
	return stdArr;
};

function calculateMarketCap(symbol1) {
	var queryURL = "https://api.coinmarketcap.com/v2/ticker/?convert=CAD&limit=10&structure=array";
	$.ajax({
		url: queryURL,
		method: "GET" 
	}).then(function(response) {
		var results = response.data;
		for (var i=0; i<results.length; i++) {
	        if (results[i].symbol === symbol1) {
	        	return cap = results[i].quotes.CAD.market_cap;
        	};
    	};
	});
};

function bubbleSort(arr,parm) {
 var sorted = false;
 while (!sorted) {
   sorted = true;
   for (var i = 0; i < arr.length-1; i++) {
     if (arr[i][parm] > arr[i + 1][parm]) {
       sorted = false;
       var temp = arr[i];
       arr[i] = arr[i + 1];
       arr[i + 1] = temp;
   }
   }
 }
 return arr;
}
   
function buildContainer(arr) {
	for(i=0;i<arr.length;i++) {
		var newCoin = $("<div>")
		var coinName = $("<h3>");
		coinName.text(arr[i].name);
		var coinPrice = $("<p>");
		coinPrice.text("Price: $" + arr[i].price)
		var coinVolatility = $("<p>");
		coinVolatility.text("Volatility: " + arr[i].volatility + "%")
		var coinGrowth = $("<p>");
		coinGrowth.text("Growth: " + arr[i].growth + "%")
		newCoin.append(coinName,coinPrice,coinVolatility,coinGrowth);
		$("#coin-container").append(newCoin);
	}
}

//API calls

// calculateMarketCap("LTC");
// coinApiData("KRAKEN_SPOT_BTC_CAD"); 
// coinApiData("KRAKEN_SPOT_ETH_CAD"); 
// coinApiData("KRAKEN_SPOT_XRP_CAD"); 
cryptoCompareData("LTC","CAD","QUADRIGACX"); 
cryptoCompareData("BCH","CAD","QUADRIGACX"); 
cryptoCompareData("BTC","CAD","QUADRIGACX"); 
// cryptoCompareData("BTC","CAD","COINBASE"); // prices all the same
// cryptoCompareData("BTC","CAD","LAKEBTC"); 
// coinApiData("1BTCXE_SPOT_BTC_CAD"); //dates are strange
cryptoCompareData("ETH","CAD","QUADRIGACX"); 
cryptoCompareData("XRP","CAD","KRAKEN"); 
// https://api.quadrigacx.com/public/info
setTimeout(function(){
	sortedArray = (bubbleSort(coinArray,"volatility")

		)},1000);
setTimeout(function(){
	buildContainer(sortedArray)},1000);

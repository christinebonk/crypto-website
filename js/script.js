//Global Variables
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
		obj["growth"] = parseFloat(growthRates.toFixed(2));
		obj["price"] = parseFloat(current.toFixed(2));
		//calculate volatility
		var volatility = calculateVolatility(parsedData);
		obj["volatility"] = parseFloat(volatility.toFixed(2));
		//mc
		calculateMarketCap(obj, symbol1);
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

function calculateMarketCap(obj, symbol1) {
	var queryURL = "https://api.coinmarketcap.com/v2/ticker/?convert=CAD&limit=10&structure=array";
	$.ajax({
		url: queryURL,
		method: "GET" 
	}).then(function(response) {
		var results = response.data;
		for (var i=0; i<results.length; i++) {
	        if (results[i].symbol === symbol1) {
	        	var cap = results[i].quotes.CAD.market_cap;
	        	obj["market"] = cap;
	        	console.log(obj);
        	};
    	};
	});
};

function bubbleSort(arr,parm) {
 var sorted = false;
 while (!sorted) {
   sorted = true;
   for (var i = 0; i < arr.length-1; i++) {
     if (arr[i][parm] < arr[i + 1][parm]) {
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
	$("#coin-container").empty();
	for(i=0;i<arr.length;i++) {
		var newCoin = $("<div class='coin'>")
		var coinName = arr[i].name;
		console.log(coinName);
			if(coinName == "BTC"){
				newLink = $("<a>").attr("href", "btc.html");
				coinLogo = $("<img>").attr("alt", "coinLogo").attr("src", "assets/images/coinLogos/bitcoin.png").attr("class", "coinLogos");
				newCoin.append(coinLogo);
			}else if(coinName == "ETH"){
				newLink = $("<a>").attr("href", "eth.html");
				coinLogo = $("<img>").attr("alt", "coinLogo").attr("src", "assets/images/coinLogos/ethereum.png").attr("class", "coinLogos");
				newCoin.append(coinLogo);
			}else if(coinName == "LTC"){
				newLink = $("<a>").attr("href", "ltc.html");
				coinLogo = $("<img>").attr("alt", "coinLogo").attr("src", "assets/images/coinLogos/litecoin.png").attr("class", "coinLogos");
				newCoin.append(coinLogo);
			}else if(coinName == "XRP"){
				newLink = $("<a>").attr("href", "xrp.html");
				coinLogo = $("<img>").attr("alt", "coinLogo").attr("src", "assets/images/coinLogos/ripple.png").attr("class", "coinLogos");
				newCoin.append(coinLogo);
			}else if(coinName == "BCH"){
				newLink = $("<a>").attr("href", "bch.html");
				coinLogo = $("<img>").attr("alt", "coinLogo").attr("src", "assets/images/coinLogos/bitcoinCash.png").attr("class", "coinLogos");
				newCoin.append(coinLogo);
			}
		var coinName = $("<h3 class='coin-title'>");
		newLink.html(newCoin);
		coinName.text(arr[i].name);
		var coinPrice = $("<p class='stat-text'>");
		coinPrice.text("Price: $" + arr[i].price)
		var coinVolatility = $("<p class='stat-text'>");
		coinVolatility.text("Volatility: " + arr[i].volatility + "%")
		var coinGrowth = $("<p class='stat-text'>");
		coinGrowth.text("Growth: " + arr[i].growth + "%")
		var coinMarket = $("<p class='stat-text'>");
		coinMarket.text("Market: $" + arr[i].market)
		newCoin.append(coinName,coinPrice,coinVolatility,coinGrowth,coinMarket);
		$("#coin-container").append(newLink);
	}
}

//API calls
cryptoCompareData("LTC","CAD","QUADRIGACX"); 
cryptoCompareData("BCH","CAD","QUADRIGACX"); 
cryptoCompareData("BTC","CAD","QUADRIGACX"); 
cryptoCompareData("ETH","CAD","QUADRIGACX"); 
cryptoCompareData("XRP","CAD","KRAKEN"); 

//Call sort functions
setTimeout(function(){
	sortedArray = (bubbleSort(coinArray,"growth")

		)},1000);
setTimeout(function(){
	buildContainer(sortedArray)},2000);

$("#sort-submit").on("click", function(event) {
	event.preventDefault();
	var sortValue = $("#sort").val().trim();
	console.log(sortValue);
	newArray = bubbleSort(sortedArray, sortValue);
	console.log(newArray)
	setTimeout(function() {
		buildContainer(newArray);
	},1000);
	
});
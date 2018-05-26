var symbols = ["KRAKEN_SPOT_BTC_CAD", "KRAKEN_SPOT_ETH_CAD", "KRAKEN_SPOT_XRP_CAD", "KRAKEN_SPOT_LTC_CAD", "KRAKEN_SPOT_ZEC_CAD", "KRAKEN_SPOT_REP_CAD", "KRAKEN_SPOT_DAO_CAD"];

//Builds API request
function requestCoinData(symbol) {
	var apiKey = "&apikey=0D2C1A9D-23FC-4EA0-904A-A37A2C5514D8";
	var period = "/history?period_id=1DAY";
	var startTime = "&time_start=" + moment().subtract(90, 'days').format();
	var limit = "&limit=" + 90;
	var queryURL = "https://rest.coinapi.io/v1/ohlcv/" + symbol + period + startTime + limit + apiKey; 
	var parsedData
	$.ajax({
		url: queryURL,
		method: "GET" 
	}).then(function(response) {
		var parsedData = parseData(response);
		console.log(parsedData);
	}).then(function() {

	});
};

//Parses API data
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

//Calling function with one symbol 
requestCoinData("KRAKEN_SPOT_BTC_CAD"); 




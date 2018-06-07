
function cryptoCompareData(symbol1, symbol2, exchange) {
	var limit = "&limit=" + 90;
	var queryURL = "https://min-api.cryptocompare.com/data/histoday?" + "fsym=" + symbol1 + "&tsym=" + symbol2 + limit + "&e=" + exchange + "&tryConversion=false"; 
	var parsedData
	$.ajax({
		url: queryURL,
		method: "GET" 
	}).then(function(response) {
      dailyHigh = response.Data['30'].high;
      $("#statHigh").text("$ " + dailyHigh + " CAD");
      parsedData = parseDataCompare(response.Data);
      var past = parsedData[0].value;
		  var current = parsedData[90].value;
      var growthRates = getPercentageChange(past, current)
      $("#statGrowth").text(math.round(growthRates) + " %");
      calculateMarketCap(symbol1);
      var volatility = calculateVolatility(parsedData);
      drawChart(parsedData);
	}).then(function() {

	});
};

function getPercentageChange(pastNumber, currentNumber){
    var changeValue = currentNumber - pastNumber;
    return (changeValue / pastNumber) * 100;
};


function parseDataCompare(data) {
	var arr = [];
	for (i=0; i<data.length; i++) {
		arr.push ({
        date: new Date(moment.unix(data[i].time).format("LL")),
        value: data[i].close
   		});
	}
	return arr;
}



function drawChart(data) {
    var svgWidth = 700, svgHeight = 400;
    var margin = { top: 20, right: 20, bottom: 30, left: 50 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    
    var svg = d3.select('svg')
        .attr("width", svgWidth)
        .attr("height", svgHeight);
        
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var x = d3.scaleTime()
        .rangeRound([0, width]);
    
    var y = d3.scaleLinear()
        .rangeRound([height, 0]);
    
    var line = d3.line()
        .x(function(d) { return x(d.date)})
        .y(function(d) { return y(d.value)})
        x.domain(d3.extent(data, function(d) { return d.date }));
        y.domain(d3.extent(data, function(d) { return d.value }));
    
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .select(".domain")
        .remove();
    
    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Price ($)");
    
    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
}


function makeArticles(type) {
    var queryURL = 'https://newsapi.org/v2/everything?' +
    'q='+ type + '&' +
    'from=2018-01-01&' +
    'sortBy=popularity&' +
    'apiKey=c91847ec964243038db42e65ab4c8169';
   var limit = 3;
   $.ajax({
    url: queryURL,
    method: "GET"
   }).then(function (response) {
    var results = response.articles;
   
            for(var i = 0; i <limit; i++){
      var res=results[i];
      var cryptoDiv = $('<div class="article__item">');
      var cryptImage = $('<img class="article__image">');
      cryptImage.attr("src", res.urlToImage);
      var crypto1 = res.title;
      var crypto2 = res.author;
      var crypto3 = res.description;
      var crypto4 = res.url;
      var link = $('<a class>').attr('href', crypto4).attr('class', 'article__link').text(crypto1);
      link.a
      var cryptfo = $('<div class ="crypto">').html(crypto1 + crypto2 + crypto3);
      cryptoDiv.append(link);
     cryptoDiv.append(cryptImage);
     cryptoDiv.append(cryptfo);
     $(".article__row").append(cryptoDiv);
    
    }
   });
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
	        	var cap = results[i].quotes.CAD.market_cap;
            $("#statCap").text("$" + cap);
        	};
    	};
    });
    
};

function calculateVolatility(data) {
    var arr = []; 
	for (i=0;i<(data.length-1);i++) {
		interdayReturn = (data[i+1].value-data[i].value)/data[i].value;
        arr.push(interdayReturn);
	};
    var stdArr = math.std(arr)*100;
    var annualized = Math.sqrt(365)*stdArr;
    $("#statVolatility").html(stdArr.toFixed(2) + " %");
};


//Date Submit



//Create new graph
function newGraph(symbol1, symbol2, exchange, range) {
  var limit = "&limit=" + range;
  var queryURL = "https://min-api.cryptocompare.com/data/histoday?" + "fsym=" + symbol1 + "&tsym=" + symbol2 + limit + "&e=" + exchange + "&tryConversion=false"; 
  var parsedData
  $.ajax({
    url: queryURL,
    method: "GET" 
  }).then(function(response) {
    $("#limitDays").text('');
    $("#limitDays").text("(" + range + " Days)");
    parsedData = parseDataCompare(response.Data);     
    var past = parsedData[0].value;
    var current = parsedData[range].value;
    var growthRates = getPercentageChange(past, current)
    $("#statGrowth").text("% " + math.round(growthRates));
    calculateMarketCap(symbol1);
    var volatility = calculateVolatility(parsedData);
        $(".line-chart").empty(" ");
        drawChart(parsedData);
        calculateVolatility(parsedData);
  }).then(function() {

  });
};



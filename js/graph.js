


function cryptoCompareData(symbol1, symbol2, exchange) {
	var limit = "&limit=" + 30;
	var queryURL = "https://min-api.cryptocompare.com/data/histoday?" + "fsym=" + symbol1 + "&tsym=" + symbol2 + limit + "&e=" + exchange + "&tryConversion=false"; 
	var parsedData
	//console.log(queryURL);
	$.ajax({
		url: queryURL,
		method: "GET" 
	}).then(function(response) {
		console.log(response.Data);
		parsedData = parseDataCompare(response.Data);
		console.log(parsedData);
      //  calculateVolatility(parsedData);
	}).then(function() {
        drawChart(parsedData);
	});
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
    var svgWidth = 600, svgHeight = 400;
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

cryptoCompareData("BTC","CAD","QUADRIGACX");
//var parsedData = parseData(a);


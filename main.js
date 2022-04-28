width = 600;
height = 550;
margin = { top: 50, left: 50, bottom: 50, right: 50 };


function computeLengthOfStorm() {
    // adding the NameYear attribute and computing the length of each storm in hours
    countOfStorms = {};
    speedOfStorms = {};

    storms.forEach(s => {
        s.nameyear = (s.name).concat(",", s.year);
        countOfStorms[s.nameyear] = 0;
        speedOfStorms[s.nameyear] = 0;
    });
    // console.log(dataset);

    storms.forEach(s => {
        countOfStorms[s.nameyear] += 1;
        speedOfStorms[s.nameyear] += +s.wind;
    });
    // console.log(countOfStorms);

    for (var k in speedOfStorms) {
        speedOfStorms[k] = speedOfStorms[k] / countOfStorms[k] 
    }
    for (var k in countOfStorms) {
        countOfStorms[k] *= 6
    }
    storms.forEach(s => {
        s.lengthOfStorm = countOfStorms[s.nameyear];
        s.windSpeed = speedOfStorms[s.nameyear];
    });
    // console.log(countOfStorms);    
}

function createData() {
    // need to create new data that contains elements of the form {nameyear: "", lengthOfStorm: _, ts_diameter: _}
    var stormsByNameYear = d3.group(storms, d => d.nameyear)
    // console.log(stormsByNameYear)
    diameterData = [];
    for (const [k, v] of stormsByNameYear) {
        var e = {nameyear: k, lengthOfStorm: v[0]['lengthOfStorm'], avgTsDiameter: 0, avgHuDiameter: 0};
        for (let i = 0; i < v.length; i++) {
            e.avgTsDiameter += Number(v[i]['ts_diameter'])
            e.avgHuDiameter += Number(v[i]['hu_diameter'])
        }
        e.avgTsDiameter = e.avgTsDiameter / v.length;
        e.avgHuDiameter = e.avgHuDiameter / v.length;
        if (!isNaN(e.avgTsDiameter) && !isNaN(e.avgHuDiameter)) {
            diameterData.push(e);
        }
        
    }
    // console.log(diameterData)

}

/*
function clean() {
    var svg = d3.select('svg');
    svg.remove();
} */

function drawInitial() {
    console.log("initial");
    var svg = d3.select("#vis")
        .append('svg')
        .attr('width', 600)
        .attr('height', 550);

    drawTsDiameter(svg);
    drawHuDiameter(svg);
    drawWindSpeed(svg);
    drawMonth(svg);
}
// diameter
function drawTsDiameter(svg) {
    //clean();

    // create extents
    tsDiameterExtent = d3.extent(diameterData, function(d) {
        return (d.avgTsDiameter);
    });
    lengthOfStormExtent = d3.extent(diameterData, function(d) {
        return (d.lengthOfStorm);
    });
    
    // scales
    // x axis is the max ts_diameter for a single storm
    tsDiameterXScale = d3.scaleLinear()
        .domain(tsDiameterExtent)
        .range([margin.left, width - margin.right]);
    // y axis is the length (hours) of a single storm
    tsDiameterYScale = d3.scaleLinear()
        .domain(lengthOfStormExtent)
        .range([height - margin.top, margin.top]);


    // creating axes
    var xAxisTsDiameter = d3.axisBottom(tsDiameterXScale);
    var yAxisTsDiameter = d3.axisLeft(tsDiameterYScale);

    // create circles
    var tsCircles = svg.selectAll('g')
        .data(diameterData);
    var tsCirclesEnter = tsCircles.enter()
        .append('g')
        .attr('class', 'tsCircle')
        .attr('display', 'none')
        .attr('transform', function(d) {
            var tx = tsDiameterXScale(d['avgTsDiameter']);
            var ty = height - margin.top;
            return 'translate('+[tx, ty]+')';
        }); 
    tsCirclesEnter.append('circle')
        // .attr('cx', function(d) {
        //     // console.log("in cx")
        //     // console.log(tsDiameterXScale(d['ts_diameter']))
        //     return tsDiameterXScale(d['avgTsDiameter']);
        // })
        // .attr('cy', function(d) {
        //     return tsDiameterYScale(d['lengthOfStorm']);
        // })
        //.attr('class', 'tsCircle')
        .attr('fill', 'blue')
        .attr('r', 4)
        //.attr('cx', (d, i) => tsDiameterXScale(d['avgTsDiameter']))
        //.attr('cy', height - margin.top);
    /*tsCircles.attr('transform', function(d) {
        var tx = tsDiameterXScale(d['avgTsDiameter']);
        var ty = tsDiameterYScale(d['lengthOfStorm']);
        return 'translate('+[tx, ty]+')';
    });*/

    // add text to each dot for hover
    tsCirclesEnter.append('text')
    .attr('class', 'tsText')
        .attr('y', -10)
        .attr('display', 'none')
        .text(function(d) {
            return d.nameyear;
        });

    // add axes
    // x axis
    svg.append('g')
		.attr('class', 'tsAxis')
		.attr('transform', 'translate(0,' + (height - margin.top + 10) + ')')
        .attr('opacity', 0)
        .call(xAxisTsDiameter);
    svg
        .append('text')
        .attr('class', 'tsLabel')
        .attr('opacity', 0)
        .attr('transform', 'translate(250,' + (height - margin.top + 40) + ')')
        .text('Diameter (Nautical Miles)');
    
    // y axis
    svg
        .append('g')
        .attr('class', 'tsAxis')
        .attr('id', 'tsYAxis')
        .attr('opacity', 0)
        .attr('transform', 'translate(' + (margin.left - 10) + ', 0)')
        .call(yAxisTsDiameter)
    svg    
        .append('text')
        .attr('class', 'tsLabel')
        .attr('opacity', 0)
        .attr('transform', 'translate(10, 400) rotate(270)')
        .text('Length of Storm (Hours)');

}


function drawHuDiameter(svg) {
    //clean();
    // create scales

    // domains for scales 
    huDiameterExtent = d3.extent(diameterData, function(d) {
        return (d.avgHuDiameter);
    });
    lengthOfStormExtent = d3.extent(diameterData, function(d) {
        return (d.lengthOfStorm);
    });

    // scales
    // x axis is the avg hu_diameter for a single storm
    huDiameterXScale = d3.scaleLinear()
        .domain(huDiameterExtent)
        .range([margin.left, width - margin.right]);
    // y axis is the length (hours) of a single storm
    huDiameterYScale = d3.scaleLinear()
        .domain(lengthOfStormExtent)
        .range([height - margin.top, margin.top]);


    // creating axes
    var xAxisHuDiameter = d3.axisBottom(huDiameterXScale);
    var yAxisHuDiameter = d3.axisLeft(huDiameterYScale);
    
    // create circles
    var huCircles = svg.selectAll('.huCircle')
        .data(diameterData);
    var huCirclesEnter = huCircles.enter()
        .append('g')
        .attr('class', 'huCircle')
        .attr('display', 'none')
        .attr('transform', function(d) {
            var tx = huDiameterXScale(d['avgHuDiameter']);
            var ty = height - margin.top;
            return 'translate('+[tx, ty]+')';
        });
    huCirclesEnter.append('circle')
        // .attr('cx', function(d) {
        //     // console.log("in cx")
        //     // console.log(tsDiameterXScale(d['ts_diameter']))
        //     return tsDiameterXScale(d['avgTsDiameter']);
        // })
        // .attr('cy', function(d) {
        //     return tsDiameterYScale(d['lengthOfStorm']);
        // })
        .attr('fill', 'blue')
        .attr('r', 4)
    /*huCircles.attr('transform', function(d) {
        var tx = huDiameterXScale(d['avgHuDiameter']);
        var ty = huDiameterYScale(d['lengthOfStorm']);
        return 'translate('+[tx, ty]+')';
    });*/

    
    // add text to each dot for hover
    huCirclesEnter.append('text')
        .attr('y', -10)
        .attr('display', 'none')
        .text(function(d) {
            return d.nameyear;
        });
    
    // add axes
    // x axis
    svg.append('g')
		.attr('class', 'huAxis')
		.attr('transform', 'translate(0,' + (height - margin.top + 10) + ')')
        .attr('opacity', 0)
        .call(xAxisHuDiameter);
    svg
        .append('text')
        .attr('class', 'huLabel')
        .attr('opacity', 0)
        .attr('transform', 'translate(250,' + (height - margin.top + 40) + ')')
        .text('Diameter (Nautical Miles)');
    
    // y axis
    svg
        .append('g')
        .attr('class', 'huAxis')
        .attr('opacity', 0)
        .attr('transform', 'translate(' + (margin.left - 10) + ', 0)')
        .call(yAxisHuDiameter)
    svg    
        .append('text')
        .attr('class', 'huLabel')
        .attr('opacity', 0)
        .attr('transform', 'translate(10, 400) rotate(270)')
        .text('Length of Storm (Hours)');

}



// wind speed
/*
function createDiameterScales() {
    tsDiameterXScale = d3.scaleLinear(d3.extent(storms, d => d.ts_diameter), [margin.left, margin.left + width+250]);
    tsDiameterYScale = d3.scaleLinear(d3.extent(storms, d => d.nameyear), [margin.top, margin.top + height+250]);
} */

function createWindSpeedScales() {
    //windSpeedXScale = d3.scaleLinear(d3.extent(dataset, d => d.windSpeed), [0, 450]);
    windSpeedXScale = d3.scaleLinear()
        .domain([0,110])
        .range([margin.left, width - margin.right]);
    //windSpeedYScale = d3.scaleLinear(d3.extent(dataset, d => d.length), [30+500, 30]);
    windSpeedYScale = d3.scaleLinear()
        .domain([0,0])
        .range([height - margin.top, margin.top]);
    var nodeTypes = d3.map(filteredStorm, function(d){return d.type;}).keys();
    colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(nodeTypes);
}

function filterStorm() {
    filteredStorm = d3.nest()
        .key(function(d) { return d.nameyear;})
        .entries(storms);
    filteredStorm.forEach((s,index) => {
            filteredStorm[index] = s.values[0];
    });
    filteredStorm.sort(function (a, b) {
        return a.windSpeed - b.windSpeed;
      });
    // return nest;
}

function createWindCircles(windClass, svg) {
    // create circles

    var windCircles = svg.selectAll('.'+windClass)
        .data(filteredStorm)
    var windCirclesEnter = windCircles.enter()
        //.append("g")
        /*.attr("transform", function(d) {
            return "translate(" + windSpeedXScale(d.windSpeed)+ ", " + windSpeedYScale(d.lengthOfStorm) + ")";
        })*/
    
    windCirclesEnter.append("circle")
        .attr("r", 2)
        .attr('display', 'none')
        .attr('class', windClass)
        .attr('cx', (d, i) => windSpeedXScale(d.windSpeed))
        .attr('cy', height - margin.top)
        //.attr('cy', (d, i) => windSpeedYScale(d.lengthOfStorm))
        .style('fill', function(d){
                return colorScale(d.category);
            });
}
function drawWindSpeed(svg) {
    //clean();
    createWindSpeedScales();
    createWindCircles('windCircle', svg);
    

    // creating axes
    var xAxisWindSpeed = d3.axisBottom(windSpeedXScale);
    var yAxisWindSpeed = d3.axisLeft(windSpeedYScale);

    // add axes
    // x axis
    svg.append('g')
		.attr('class', 'windAxis')
        .attr('opacity', 0)
		.attr('transform', 'translate(0,' + (height - margin.top + 10) + ')')
        .call(xAxisWindSpeed);
    svg
        .append('text')
        .attr('class', 'windLabel')
        .attr('opacity', 0)
        .attr('transform', 'translate(250,' + (height - margin.top + 40) + ')')
        .text('Average Wind Speed (knots)');
    
    // y axis
    svg
        .append('g')
        .attr('class', 'windAxis')
        .attr('id', 'windYAxis')
        .attr('opacity', 0)
        .attr('transform', 'translate(' + (margin.left - 10) + ', 0)')
        .call(yAxisWindSpeed)
    svg    
        .append('text')
        .attr('class', 'windLabel')
        .attr('opacity', 0)
        .attr('transform', 'translate(10, 400) rotate(270)')
        .text('Length of Storm (Hours)');

    /*svg.append('g').attr('class', 'x axis')
        .attr('transform', 'translate(0,500)')
        .call(d3.axisTop(windSpeedXScale).tickFormat(function(d){return d;}));
    svg.append('g').attr('class', 'y axis')
        .attr('transform', 'translate(0,0)')
        .call(d3.axisRight(windSpeedYScale).tickFormat(function(d){return d;}));*/
        
        /* .attr("class", function(d) {
        return d.rank <=3 ? 'topPlayers': 'normalPlayers';
        }) */
}


// month

function aggregateMonth() {
    monthData = {}
    countMonth = {}
    filteredStorm.forEach(e => {
        monthData[e.month] = 0
        countMonth[e.month] = 0
    });
    
    filteredStorm.forEach(e => {
        monthData[e.month] += e.lengthOfStorm
        countMonth[e.month] += 1
    });
   
    monthListData = []
    for (var k in monthData) {
        monthData[k] = monthData[k] / countMonth[k]
        monthListData.push({month : k, avgLengthOfStorm: monthData[k]}) 
    }
    // console.log(monthListData)
    // console.log(monthData)
    // console.log(countMonth)
}
function getMonthName(d) {
    if (d.month == '1') {
        return 'January';
    }
    else if (d.month == '4') {
        return 'April';
    }
    else if (d.month == '5') {
        return 'May';
    }
    else if (d.month == '6') {
        return 'June';
    }
    else if (d.month == '7') {
        return 'July';
    }
    else if (d.month == '8') {
        return 'August';
    }
    else if (d.month == '9') {
        return 'September';
    }
    else if (d.month == '10') {
        return 'October';
    }
    else if (d.month == '11') {
        return 'November';
    }
    else if (d.month == '12') {
        return 'December';
    }
}

function drawMonth(svg) {
    //clean();

    // scales
    innerHeight = height - margin.bottom //- margin.bottom;
    // var innerHeight = height - 60;
    var innerWidth = width - margin.left - margin.right;

    var lengthOfStormExtent = d3.extent(Object.values(monthData)); 
    console.log(lengthOfStormExtent)
    lengthOfStormYScale = d3.scaleLinear()
        .domain([0,lengthOfStormExtent[1]])
        .range([innerHeight, 0]);
        // .range([height - margin.bottom, margin.top]);
   
    monthXScale = d3.scaleBand()
        .domain(['January', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])
        .rangeRound([0, innerWidth])
        .padding(0.2);

    // create axes
    var xAxisMonth = d3.axisBottom(monthXScale);
    var yAxisAvgLengthOfStorm = d3.axisLeft(lengthOfStormYScale);
    
    // create bars

    /*var barsEnter = svg
                    .selectAll('.bar')
                    .data(monthListData)
                    .enter()
                    .append('g')
                    .attr('class', 'bar')
                    .attr('opacity', 0)
                    .attr('transform', function(d,i){
                        // return 'translate('+[i * 30 + 100, 0]+')';
                        return 'translate(' + (monthXScale(getMonthName(d))+40) + ',0)';
                    });*/
    var barsEnter = svg
                    .selectAll('.bar')
                    .data(monthListData)
                    .enter()
    barsEnter
        .append('rect')
        .attr('class', 'bar')
        .attr('opacity', 0)
        .attr('y', innerHeight) //setting y at the bottom for the transition effect
        .attr('x', function(d) { return (monthXScale(getMonthName(d))+40)})
        .attr('height', 0)      //setting height 0 for the transition effect
        .attr('width', monthXScale.bandwidth())
        .style('fill', 'rgb(234, 229, 229)');
        /*.transition()
        .duration(700)
        .ease(d3.easeLinear)
        .attr('height', function(d) {
            return innerHeight - lengthOfStormYScale(d.avgLengthOfStorm);
        })
        .attr('y', function(d) {
            return lengthOfStormYScale(d.avgLengthOfStorm);
        })
        .style('fill', 'rgb(70, 130, 180)'); */

        // .attr('height', function(d) {
        //     return height - lengthOfStormYScale(d.avgLengthOfStorm);
        // })
        // .attr('y', function(d) { 
        //     return lengthOfStormYScale(d.avgLengthOfStorm); 
        // })
        // .attr('width', 30);



    // var barsEnter = bars.enter()
    // .append('g')
    // .attr('class', 'bar');
    
    // bars.merge(barsEnter)
    // .attr('transform', function(d,i){
    //         return 'translate('+[0, i * barBand + 4]+')';
    //     });

    

    // barsEnter.append('text')
    //     .attr('x', -20)
    //     .attr('dy', '0.9em')
    //     .text(function(d){
    //         return d.letter;
    //     });        

    // axes
    // x axis
    svg.append('g')
		.attr('class', 'monthAxis')
        .attr('opacity',0)
        // .attr('transform', 'translate(0,580)')
        .attr('transform', 'translate(40,' + (height - margin.top + 10) + ')')
        .call(xAxisMonth);
    svg
        .append('text')
        .attr('class', 'monthLabel')
        .attr('opacity',0)
        .attr('transform', 'translate(250,' + (height - margin.top + 40) + ')')
        .text('Month');

    // y axis
    svg
        .append('g')
        .attr('class', 'monthAxis')
        .attr('opacity',0)
        .attr('transform', 'translate(' + (margin.left - 10) + ', 0)')
        .call(yAxisAvgLengthOfStorm)
    svg    
        .append('text')
        .attr('class', 'monthLabel')
        .attr('opacity',0)
        .attr('transform', 'translate(10, 400) rotate(270)')
        .text('Average Length of Storm (Hours)');

}

/*
function drawMonth(svg) {
    //clean();
    // scales
    var lengthOfStormExtent = d3.extent(Object.values(monthData)); 
    console.log(lengthOfStormExtent)
    lengthOfStormYScale = d3.scaleLinear()
        .domain(lengthOfStormExtent)
        .range([height - margin.bottom, margin.top]);
    
    // create bars
    
    var barsEnter = svg
                    .selectAll('.bar')
                    .data(monthListData)
                    .enter()
                    .append('g')
                    .attr('class', 'bar')
                    .attr('opacity', 0)
                    .attr('transform', function(d,i){
                        return 'translate('+[i * 10 + 4, 0]+')';
                    });
    barsEnter
        .append('rect')
        .attr('height', function(d) {
            return height - lengthOfStormYScale(d.avgLengthOfStorm);
        })
        .attr('y', function(d) { 
            return lengthOfStormYScale(d.avgLengthOfStorm); 
        })
        .attr('width', 10);
    // var barsEnter = bars.enter()
    // .append('g')
    // .attr('class', 'bar');
    
    // bars.merge(barsEnter)
    // .attr('transform', function(d,i){
    //         return 'translate('+[0, i * barBand + 4]+')';
    //     });
    
    // barsEnter.append('text')
    //     .attr('x', -20)
    //     .attr('dy', '0.9em')
    //     .text(function(d){
    //         return d.letter;
    //     });        
}*/

d3.csv('storms.csv').then(function(dataset) {
    storms = dataset;
    /*console.log(storms);
    storms = storms.filter(function (e) {
        let valid = true;
        Object.keys(e).forEach(key => {
            if (e[key] == "NA") {
                valid = false;
            }
        })
        return valid;
    });
    console.log(storms)*/
    computeLengthOfStorm();
    createData();
    filterStorm();
    //createWindSpeedScales();
    aggregateMonth();
    drawInitial();
    // drawMonth();
});


// scrolling through

let activationFunctions = [
    //clean, // dummy function
    draw1,
    
    drawWind1,
    
    drawTs,
    drawHu,
    drawBar
    // drawTs,
    // drawWind1,
    // drawTs,
    // drawInitial,
    // drawWindSpeed,
    // drawTsDiameter,
    // drawHuDiameter,
    // drawMonth,
    // clean // dummy function
]

function draw1() {

}

function drawWind1() {
    clean('isWindSpeed');
    console.log("draw2");
    let svg = d3.select("#vis")
                    .select('svg')
                    .attr('width', 1000)
                    .attr('height', 950)

    svg.selectAll('.windAxis')
        .attr('opacity', 1)
    svg.selectAll('.windLabel')
        .attr('opacity', 1)

    windSpeedYScale.domain([0,500])
        .range([height - margin.top, margin.top]);

    svg.select("#windYAxis")
    .transition()
    .call(d3.axisLeft(windSpeedYScale));

    svg.selectAll('.windCircle')
        .transition().duration(1000)
        .delay(function(d,i){return(i*3)})
        .attr('display','block')
        .attr('cx', (d) => windSpeedXScale(d.windSpeed))
        .attr('cy', (d) => windSpeedYScale(d.lengthOfStorm))
    
}

function drawHu() {
    console.log("drawHu");
    clean('isHu');
    let svg = d3.select("#vis")
                    .select('svg')
                    .attr('width', 1000)
                    .attr('height', 950)

    svg.selectAll('.huAxis')
        .attr('opacity', 1)
    svg.selectAll('.huLabel')
        .attr('opacity', 1)

    huDiameterYScale = d3.scaleLinear()
        .domain(lengthOfStormExtent)
        .range([height - margin.top, margin.top]);
    /*svg.select("#tsYAxis")
    .transition()
    .call(d3.axisLeft(tsDiameterYScale));*/

    svg.selectAll('.huCircle')
        .transition().duration(1000)
        .delay(function(d,i){return(i*3)})
        .attr('display','block')
        .attr('transform', function(d) {
            var tx = huDiameterXScale(d['avgHuDiameter']);
            var ty = huDiameterYScale(d['lengthOfStorm']);
            return 'translate('+[tx, ty]+')';
        });
    
}

function drawTs() {
    console.log("drawTs");
    clean('isTs');
    let svg = d3.select("#vis")
                    .select('svg')
                    .attr('width', 1000)
                    .attr('height', 950)

    svg.selectAll('.tsAxis')
        .attr('opacity', 1)
    svg.selectAll('.tsLabel')
        .attr('opacity', 1)

    tsDiameterYScale = d3.scaleLinear()
        .domain(lengthOfStormExtent)
        .range([height - margin.top, margin.top]);

    svg.select("#tsYAxis")
    .transition()
    .call(d3.axisLeft(tsDiameterYScale));

    svg.selectAll('.tsCircle')
        .transition().duration(1000)
        .delay(function(d,i){return(i*3)})
        .attr('display','block')
        .attr('transform', function(d) {
            var tx = tsDiameterXScale(d['avgTsDiameter']);
            var ty = tsDiameterYScale(d['lengthOfStorm']);
            return 'translate('+[tx, ty]+')';
        });
    
}

function drawBar() {
    clean('isBar');
    console.log('drawbar');
    let svg = d3.select("#vis")
                    .select('svg')
                    .attr('width', 1000)
                    .attr('height', 950)
    svg.selectAll('.bar')
        .attr('opacity', 1)
        .transition()
        .duration(700)
        .delay(function(d,i){return(i*3)})
        .ease(d3.easeLinear)
        .attr('display','block')
        .attr('height', function(d) {
            return innerHeight - lengthOfStormYScale(d.avgLengthOfStorm);
        })
        .attr('y', function(d) {
            return lengthOfStormYScale(d.avgLengthOfStorm);
        })
        .style('fill', 'rgb(70, 130, 180)'); 
        svg.selectAll('.monthAxis').transition().attr('opacity', 1)
        svg.selectAll('.monthLabel').transition().attr('opacity', 1)
}

function clean(chartType){
    let svg = d3.select('#vis').select('svg')
    if (chartType !== "isWindSpeed") {
        svg.selectAll('.windAxis').transition().attr('opacity', 0)
        svg.selectAll('.windLabel').transition().attr('opacity', 0)
        svg.selectAll('.windCircle')
            .transition()
            .attr('display','none')

    }
    if (chartType !== "isTs"){
        svg.selectAll('.tsAxis').transition().attr('opacity', 0)
        svg.selectAll('.tsLabel').transition().attr('opacity', 0)
        svg.selectAll('.tsCircle')
            .transition()
            .attr('display','none')
    }
    if (chartType !== "isHu"){
        svg.selectAll('.huAxis').transition().attr('opacity', 0)
        svg.selectAll('.huLabel').transition().attr('opacity', 0)
        svg.selectAll('.huCircle')
            .transition()
            .attr('display','none')
    }
    if (chartType !== "isBar"){
        svg.selectAll('.monthAxis').transition().attr('opacity', 0)
        svg.selectAll('.monthLabel').transition().attr('opacity', 0)
        svg.selectAll('.bar')
            .transition()
            .attr('display','none')
            .attr('opacity', 0)
    }
}

let scroll = scroller()
    .container(d3.select('#graphic'))
scroll()

let lastIndex, activeIndex = 0

scroll.on('active', function(index) {
    d3.selectAll('.step')
        .transition().duration(500)
        .style('opacity', function (d, i) {return i === index ? 1 : 0.1;});
    
    activeIndex = index
    let sign = (activeIndex - lastIndex) < 0 ? -1 : 1; 
    let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(i => {
        activationFunctions[i]();
    })
    lastIndex = activeIndex;

})

scroll.on('progress', function(index, progress) {
    if (index == 2 & progress > 0.7){

    }
})
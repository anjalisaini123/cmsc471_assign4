
width = 620;
height = 620;
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

function clean() {
    var svg = d3.select('svg');
    svg.remove();
}

// diameter
function drawTsDiameter() {
    clean();
    // create scales
    // domains for scales 
    var tsDiameterExtent = d3.extent(diameterData, function(d) {
        return (d.avgTsDiameter);
    });
    var lengthOfStormExtent = d3.extent(diameterData, function(d) {
        return (d.lengthOfStorm);
    });
    // console.log(tsDiameterExtent);
    // console.log(lengthOfStormExtent);

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
    

    var svg = d3.select("#vis")
                    .append('svg')
                    .attr('width', 620)
                    .attr('height', 620);
    var tsCircles = svg.selectAll('.tsCircle')
        .data(diameterData);
    var tsCirclesEnter = tsCircles.enter()
        .append('g')
        .attr('class', 'tsCircle')
        .attr('transform', function(d) {
            var tx = tsDiameterXScale(d['avgTsDiameter']);
            var ty = tsDiameterYScale(d['lengthOfStorm']);
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
        .attr('fill', 'blue')
        .attr('r', 4);
    tsCircles.attr('transform', function(d) {
        var tx = tsDiameterXScale(d['avgTsDiameter']);
        var ty = tsDiameterYScale(d['lengthOfStorm']);
        return 'translate('+[tx, ty]+')';
    });

    
    // add text to each dot for hover
    tsCirclesEnter.append('text')
        .attr('y', -10)
        .text(function(d) {
            return d.nameyear;
        });


    // svg 
    //     .selectAll('circle')
    //     .data(diameterData)
    //     .enter()
    //     .append('circle')
    //     .attr('cx', function(d) {
    //         // console.log("in cx")
    //         // console.log(tsDiameterXScale(d['ts_diameter']))
    //         return tsDiameterXScale(d['avgTsDiameter']);
    //     })
    //     .attr('cy', function(d) {
    //         return tsDiameterYScale(d['lengthOfStorm']);
    //     })
    //     .attr('fill', 'blue')
    //     .attr('r', 4);
    
    

    
    // add axes
    // x axis
    svg.append('g')
		.attr('class', 'avgTsDiameter')
		.attr('transform', 'translate(0,580)')
        .call(xAxisTsDiameter);
    svg
        .append('text')
        .attr('class', 'avgTsDiameterLabel')
        .attr('transform', 'translate(250, 610)')
        .text('Diameter (Nautical Miles)');
    
    // y axis
    svg
        .append('g')
        .attr('class', 'lengthOfStormTs')
        .attr('transform', 'translate(40, 0)')
        .call(yAxisTsDiameter)
    svg    
        .append('text')
        .attr('class', 'lengthOfStormTsLabel')
        .attr('transform', 'translate(10, 400) rotate(270)')
        .text('Length of Storm (Hours)');

}


function drawHuDiameter() {
    clean();
    // create scales

    // domains for scales 
    var huDiameterExtent = d3.extent(diameterData, function(d) {
        return (d.avgHuDiameter);
    });
    var lengthOfStormExtent = d3.extent(diameterData, function(d) {
        return (d.lengthOfStorm);
    });
    // console.log(huDiameterExtent);
    // console.log(lengthOfStormExtent);

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
    

    var svg = d3.select("#vis")
                    .append('svg')
                    .attr('width', 620)
                    .attr('height', 620);
    var huCircles = svg.selectAll('.huCircle')
        .data(diameterData);
    var huCirclesEnter = huCircles.enter()
        .append('g')
        .attr('class', 'huCircle')
        .attr('transform', function(d) {
            var tx = huDiameterXScale(d['avgHuDiameter']);
            var ty = huDiameterYScale(d['lengthOfStorm']);
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
        .attr('r', 4);
    huCircles.attr('transform', function(d) {
        var tx = huDiameterXScale(d['avgHuDiameter']);
        var ty = huDiameterYScale(d['lengthOfStorm']);
        return 'translate('+[tx, ty]+')';
    });

    
    // add text to each dot for hover
    huCirclesEnter.append('text')
        .attr('y', -10)
        .text(function(d) {
            return d.nameyear;
        });

    // svg 
    //     .selectAll('circle')
    //     .data(diameterData)
    //     .enter()
    //     .append('circle')
    //     .attr('cx', function(d) {
    //         // console.log("in cx")
    //         // console.log(huDiameterXScale(d['ts_diameter']))
    //         return huDiameterXScale(d['avgHuDiameter']);
    //     })
    //     .attr('cy', function(d) {
    //         return huDiameterYScale(d['lengthOfStorm']);
    //     })
    //     .attr('fill', 'blue')
    //     .attr('r', 4);


    
    // add axes
    // x axis
    svg.append('g')
		.attr('class', 'avgHuDiameter')
		.attr('transform', 'translate(0,580)')
        .call(xAxisHuDiameter);
    svg
        .append('text')
        .attr('class', 'avgHuDiameterLabel')
        .attr('transform', 'translate(250, 610)')
        .text('Diameter (Nautical Miles)');
    
    // y axis
    svg
        .append('g')
        .attr('class', 'lengthOfStormHu')
        .attr('transform', 'translate(40, 0)')
        .call(yAxisHuDiameter)
    svg    
        .append('text')
        .attr('class', 'lengthOfStormHuLabel')
        .attr('transform', 'translate(10, 400) rotate(270)')
        .text('Length of Storm (Hours)');

}



// wind speed

function createDiameterScales() {
    tsDiameterXScale = d3.scaleLinear(d3.extent(storms, d => d.ts_diameter), [margin.left, margin.left + width+250]);
    tsDiameterYScale = d3.scaleLinear(d3.extent(storms, d => d.nameyear), [margin.top, margin.top + height+250]);
}

function createWindSpeedScales() {
    //windSpeedXScale = d3.scaleLinear(d3.extent(dataset, d => d.windSpeed), [0, 450]);
    windSpeedXScale = d3.scaleLinear([0,110], [0, 450]);
    //windSpeedYScale = d3.scaleLinear(d3.extent(dataset, d => d.length), [30+500, 30]);
    windSpeedYScale = d3.scaleLinear([0,500], [30+500, 30]);
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
    // return nest;
}

function drawWindSpeed() {
    clean();
    var svg = d3.select("#vis")
                .append('svg')
                .attr('width', 450)
                .attr('height', 500);

    var g = svg.selectAll("g")
    .data(filteredStorm)
    .enter()
    .append("g")
    .attr("transform", function(d) {
        return "translate(" + windSpeedXScale(d.windSpeed)+ ", " + windSpeedYScale(d.lengthOfStorm) + ")";
    })
    
    g.append("circle")
        .attr("r", 2)
        .style('fill', function(d){
                return colorScale(d.category);
            });

    svg.append('g').attr('class', 'x axis')
        .attr('transform', 'translate(0,500)')
        .call(d3.axisTop(windSpeedXScale).tickFormat(function(d){return d;}));
    svg.append('g').attr('class', 'y axis')
        .attr('transform', 'translate(0,0)')
        .call(d3.axisRight(windSpeedYScale).tickFormat(function(d){return d;}));
        
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

function drawMonth() {
    clean();

    // scales
    var lengthOfStormExtent = d3.extent(Object.values(monthData)); 
    console.log(lengthOfStormExtent)
    lengthOfStormYScale = d3.scaleLinear()
        .domain(lengthOfStormExtent)
        .range([height - margin.bottom, margin.top]);

    
    // create bars
    var svg = d3.select("#vis")
                .append('svg')
                .attr('width', 620)
                .attr('height', 620);

    
    var barsEnter = svg
                    .selectAll('.bar')
                    .data(monthListData)
                    .enter()
                    .append('g')
                    .attr('class', 'bar')
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

}



d3.csv('storms.csv').then(function(dataset) {
    storms = dataset;
    computeLengthOfStorm();
    createData();
    filterStorm();
    createWindSpeedScales();
    aggregateMonth();
    // drawMonth();
});


// scrolling through

let activationFunctions = [
    clean, // dummy function
    drawWindSpeed,
    drawTsDiameter,
    drawHuDiameter,
    drawMonth,
    clean // dummy function
]

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
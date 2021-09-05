let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
let req= new XMLHttpRequest()

let data
let dataset = []

let heightScale
let xScale
let xAxis
let yAxis

const monthNames = ["January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December"
                   ];

const w = 900 //widht
const h = 600 //height
const p = 50  //padding

let svg = d3.select('svg')
let drawCanvas = () => {
    svg.attr('width', w)
       .attr('height', h)
}

let generateScales = () => {
    heightScale = d3.scaleLinear()
                    .domain([0,d3.max(dataset, (item) => {
                        return item[1]
                    })])
                    .range([0, h - (2 * p)])

    xScale = d3.scaleLinear()
               .domain([0, dataset.length - 1])
               .range([p, w - p])
    
    let datesArray = dataset.map((item) => {
        return new Date(item[0])
    })

    xAxis = d3.scaleTime()
              .domain([d3.min(datesArray), d3.max(datesArray)])
              .range([p, w - p])

    yAxis = d3.scaleLinear()
              .domain([0, d3.max(dataset, (item) => {
                  return item[1]
              })])
              .range([h - p, p])
}

let drawBars = () => {

    let tooltip = d3.select('.container')
                    .append('div')
                    .attr('id', 'tooltip')
                    .attr('class', 'flex')
                    .style('visibility', 'hidden')
                    .style('width', '200px')
                    .style('height', '80px')
                    .style('padding', '2px')
                    

    svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', (w - (2 * p)) / dataset.length)
        .attr('data-date', (item) => {
            return item[0]
        })
        .attr ('data-gdp', (item) => {
            return item[1]
        })
        .attr('height', (item) => {
            return heightScale(item[1])
        })
        .attr('x', (item, index) => {
            return xScale(index)
        })
        .attr('y', (item) => {
            return (h - p) - heightScale(item[1])
        })
        .on('mouseover', function(item, index) {
            let parsed = new Date(item[0])
            let dateString = `${parsed.getFullYear()} - ${monthNames[parsed.getMonth()]}`
            var posX = this.getBoundingClientRect();
            

            tooltip.style('top', (posX.top - 80) + 'px')
                    .style('left', (posX.left + (posX.width / 2)) + 'px')
                    .style('white-space', 'pre')

            tooltip.transition()
                   .style('visibility', 'visible')    

            document.querySelector('#tooltip').setAttribute('data-date', item[0])
            document.querySelector('#tooltip').textContent = "$" + `${item [1]} Billion\r\n  ${dateString}`
        })
        .on('mouseout', (item) => {
            tooltip.transition()
                   .style('visibility', 'hidden')
        })
}

let generateAxes = () => {
    
    let x = d3.axisBottom(xAxis)
    let y = d3.axisLeft(yAxis)

    svg.append('g')
        .call(x)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (h - p) + ')')
        .style('font-size', '15px')

    svg.append('g')
       .call(y)
       .attr('id', 'y-axis')
       .attr('transform', 'translate(' + p + ', 0)')
       .style('font-size', '15px')

}

req.open('GET', url, true)
req.onload = () => {
    data = JSON.parse(req.responseText)
    dataset = data.data
    drawCanvas()
    generateScales()
    drawBars()
    generateAxes()
}
req.send()

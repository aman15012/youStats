var jsonResp = new Object(); //final json response
var dateMap = {}; // The date frequency map
var jsonArr = [];
var count = 0; //page count
var dcount = 0; // a variable to account for controlling the flow

// Called on page load
function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

// Called automatically when YouTube API interface is loaded 
function onYouTubeApiLoad() {
    gapi.client.setApiKey(key);
    document.getElementById("makevis").innerHTML = "Loading..."
    search();
}

// Called when the the button is pressed
function search() {

    // API call
    count += 1;
    var request = gapi.client.youtube.search.list({
        part: 'snippet',
        type: 'video',
        q: query,
        maxResults: 50
    });
    // Send the request to the API server
    request.execute(onSearchResponse);
}

// Called when we want to get the next page
function searchNext(nextToken) {

    // API call
    count += 1;
    if (count <= 10) {
        var request = gapi.client.youtube.search.list({
            part: 'snippet',
            type: 'video',
            pageToken: nextToken,
            q: query,
            maxResults: 50
        });
        // Send the request to the API server
        request.execute(onSearchResponse);
    } else {
        if (dcount == 500) {
            for (var key in dateMap) {
                if (dateMap.hasOwnProperty(key)) {
                    jsonArr.push({
                        "Date": key,
                        "Count": dateMap[key]
                    });
                }
            }
            proceed();
        }
    }
}

// Extracts publishing date from the json response
function onSearchResponse(response) {

    for (i = 0; i < response["items"].length; i++) {
        var date = String(response["items"][i]["snippet"]["publishedAt"].split("T")[0]);
        var tem = date;
        if (tem.split("-")[0] == "2017") {
            if (!dateMap[date]) {
                dateMap[date] = 0;
            }
            dateMap[date] += 1;
        }
        dcount += 1;
    }
    var nextToken = String(response["nextPageToken"]);
    searchNext(nextToken);
}

// Builds the heatmap calendar from the collected data
function proceed() {

    document.getElementById("makevis").innerHTML = "This is a Calendar Heatmap representing the dates of upload of the collected videos in 2017. ";
    var width = 700,
        height = 900,
        cellSize = 25; // cell size

    var no_months_in_a_row = Math.floor(width / (cellSize * 7 + 50));
    var shift_up = cellSize * 3;

    var day = d3.time.format("%w"), // day of the week
        day_of_month = d3.time.format("%e") // day of the month
    day_of_year = d3.time.format("%j")
    week = d3.time.format("%U"), // week number of the year
        month = d3.time.format("%m"), // month number
        year = d3.time.format("%Y"),
        percent = d3.format(".1%"),
        format = d3.time.format("%Y-%m-%d");

    var color = d3.scale.quantize()
        .domain([-5, 15])
        .range(d3.range(11).map(function(d) {
            return "q" + d + "-11";
        }));

    var svg = d3.select("#response").selectAll("svg")
        .data(d3.range(2017, 2018))
        .enter().append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "RdYlGn")
        .append("g")

    var rect = svg.selectAll(".day")
        .data(function(d) {
            return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
        .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) {
            var month_padding = 1.2 * cellSize * 7 * ((month(d) - 1) % (no_months_in_a_row));
            return day(d) * cellSize + month_padding;
        })
        .attr("y", function(d) {
            var week_diff = week(d) - week(new Date(year(d), month(d) - 1, 1));
            var row_level = Math.ceil(month(d) / (no_months_in_a_row));
            return (week_diff * cellSize) + row_level * cellSize * 8 - cellSize / 2 - shift_up;
        })
        .datum(format);

    var month_titles = svg.selectAll(".month-title") // Jan, Feb, Mar and the whatnot
        .data(function(d) {
            return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
        .enter().append("text")
        .text(monthTitle)
        .attr("x", function(d, i) {
            var month_padding = 1.2 * cellSize * 7 * ((month(d) - 1) % (no_months_in_a_row));
            return month_padding;
        })
        .attr("y", function(d, i) {
            var week_diff = week(d) - week(new Date(year(d), month(d) - 1, 1));
            var row_level = Math.ceil(month(d) / (no_months_in_a_row));
            return (week_diff * cellSize) + row_level * cellSize * 8 - cellSize - shift_up;
        })
        .attr("class", "month-title")
        .attr("d", monthTitle);


    //  Tooltip Object
    var tooltip = d3.select("body")
        .append("div").attr("id", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("a simple tooltip");

    var csv = jsonArr;
    var data = d3.nest()
        .key(function(d) {
            return d.Date;
        })
        .rollup(function(d) {
            return d[0].Count;
        })
        .map(csv);

    rect.filter(function(d) {
            return d in data;
        })
        .attr("class", function(d) {
            return "day " + color(data[d]);
        })
        .select("title")
        .text(function(d) {
            return d + ": " + data[d];
        });

    //  Tooltip
    rect.on("mouseover", mouseover);
    rect.on("mouseout", mouseout);

    function mouseover(d) {
        tooltip.style("visibility", "visible");
        var percent_data = (data[d] !== undefined) ? data[d] : 0;
        var purchase_text = d + ": " + percent_data;

        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(purchase_text)
            .style("left", (d3.event.pageX) + 30 + "px")
            .style("top", (d3.event.pageY) + "px");
    }

    function mouseout(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        var $tooltip = $("#tooltip");
        $tooltip.empty();
    }

    function dayTitle(t0) {
        return t0.toString().split(" ")[2];
    }

    function monthTitle(t0) {
        return t0.toLocaleString("en-us", {
            month: "long"
        });
    }

    function yearTitle(t0) {
        return t0.toString().split(" ")[3];
    }


}
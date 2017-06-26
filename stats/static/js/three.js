var jsonResp = new Object(); //final json response
var array = [];
var likearr = [];
var dislikearr = [];
var likeobj = {};
var dislikeobj = {};
var formattedlikeobj = {};
var formatteddislikeobj = {};
var count = 0; //page count
var gcount = 0; // a variable to account for controlling the flow

//Called on page load
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
        if (array.length == 500) {
            gatherLikes();
        }
    }
}

// Extracts name and video id from the json response
function onSearchResponse(response) {

    for (i = 0; i < response["items"].length; i++) {
        var Title = String(response["items"][i]["snippet"]["title"]);
        var Video_id = String(response["items"][i]["id"]["videoId"]);
        array.push({
            "title": Title,
            "vid": Video_id
        });
    }
    var nextToken = String(response["nextPageToken"]);
    searchNext(nextToken);
}

// extrct the number of likes and dislikes for each video
function gatherLikes() {
    for (i = 0; i < array.length; i++) {
        var request = gapi.client.youtube.videos.list({
            id: array[i]["vid"],
            part: 'statistics, snippet'
        });
        request.execute(function(response) {
            gcount += 1;
            var temp = response.items[0];
            likearr.push({
                "name": temp.snippet.title,
                "size": temp.statistics.likeCount
            });
            dislikearr.push({
                "name": temp.snippet.title,
                "size": temp.statistics.dislikeCount
            });
            if (gcount == 499) // ensures that all requests has completed
            {
                callback();
            }
        });
    }
}

// called when the like and dislike arrays are formed
function callback() {
    likearr.sort(function(a, b) {
        return b.size - a.size;
    });
    dislikearr.sort(function(a, b) {
        return b.size - a.size;
    });
    for (i = 0; i < 20; i++) {
        likeobj[likearr[i]["name"]] = likearr[i]["size"];
        dislikeobj[dislikearr[i]["name"]] = dislikearr[i]["size"];
    }
    formattedlikeobj["count"] = likeobj;
    formatteddislikeobj["count"] = dislikeobj;
    genLikeBubble();
    genDislikeBubble();

}

// Generates the dislike bubble chart
function genLikeBubble() {

    document.getElementById("makevis").innerHTML = "This is a bubble chart representing the 20 most liked videos in the collected data.";
    var diameter = 600;
    color = d3.scale.category20b();
    var svg = d3.select('#response').append('svg')
        .attr('width', diameter)
        .attr('height', diameter);
    var bubble = d3.layout.pack()
        .size([diameter, diameter])
        .value(function(d) {
            return d.size;
        })
        .padding(3);
    // generate data with calculated layout values
    var nodes = bubble.nodes(processData(formattedlikeobj)).filter(function(d) {
        return !d.children;
    }); // filter out the outer bubble
    var vis = svg.selectAll('circle').data(nodes);
    vis.enter().append('circle')
        .attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')';
        })
        .attr('r', function(d) {
            return d.r;
        })
        .attr('class', function(d) {
            return d.className;
        })
        .style("fill", function(d) {
            return color(d.value);
        })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);;
    vis.enter().append('text')
        .attr("x", function(d) {
            return d.x;
        })
        .attr("y", function(d) {
            return d.y + 5;
        })
        .attr("text-anchor", "middle")
        .text(function(d) {
            return d["size"];
        })
        .style({
            "fill": "white",
            "font-size": "12px"
        });


    var tooltip = d3.select("body")
        .append("div").attr("id", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("a simple tooltip");

    function mouseover(d) {
        tooltip.style("visibility", "visible");
        var purchase_text = d.name;

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


    function processData(data) {
        var obj = data.count;
        var newDataSet = [];
        for (var prop in obj) {
            newDataSet.push({
                name: prop,
                className: prop.toLowerCase(),
                size: obj[prop]
            });
        }
        return {
            children: newDataSet
        };
    }

}
// Generates the dislike bubble chart
function genDislikeBubble() {
    document.getElementById("makevis1").innerHTML = "This is a bubble chart representing the 20 most disliked videos in the collected data.";
    var diameter = 600;
    color = d3.scale.category20b();
    var svg = d3.select('#response1').append('svg')
        .attr('width', diameter)
        .attr('height', diameter);
    var bubble = d3.layout.pack()
        .size([diameter, diameter])
        .value(function(d) {
            return d.size;
        })
        .padding(3);
    // generate data with calculated layout values
    var nodes = bubble.nodes(processData(formatteddislikeobj)).filter(function(d) {
        return !d.children;
    }); // filter out the outer bubble
    var vis = svg.selectAll('circle').data(nodes);
    vis.enter().append('circle')
        .attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')';
        })
        .attr('r', function(d) {
            return d.r;
        })
        .attr('class', function(d) {
            return d.className;
        })
        .style("fill", function(d) {
            return color(d.value);
        })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
    vis.enter().append('text')
        .attr("x", function(d) {
            return d.x;
        })
        .attr("y", function(d) {
            return d.y + 5;
        })
        .attr("text-anchor", "middle")
        .text(function(d) {
            return d["size"];
        })
        .style({
            "fill": "white",
            "font-size": "12px"
        });

    var tooltip = d3.select("body")
        .append("div").attr("id", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("a simple tooltip");

    function mouseover(d) {
        tooltip.style("visibility", "visible");
        var purchase_text = d.name;

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

    function processData(data) {
        var obj = data.count;
        var newDataSet = [];
        for (var prop in obj) {
            newDataSet.push({
                name: prop,
                className: prop.toLowerCase(),
                size: obj[prop]
            });
        }
        return {
            children: newDataSet
        };
    }
    document.getElementById("nameme").innerHTML = "The numbers in the center are the likes/dislikes count. We see that many videos are common in both the charts.";


}
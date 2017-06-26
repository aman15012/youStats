var array = [];
var datarr = [];
var jsonObject = {};
var count = 0; //page count
var gcount = 0; // a variable to account for controlling the flow

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
        if (array.length == 500) {
            gatherData();
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

// extrct the number of views and channel name for each video
function gatherData() {
    for (i = 0; i < array.length; i++) {
        var request = gapi.client.youtube.videos.list({
            id: array[i]["vid"],
            part: 'statistics, snippet'
        });
        request.execute(function(response) {
            gcount += 1;
            var temp = response.items[0];
            datarr.push({
                "name": temp.snippet.title,
                "views": parseInt(temp.statistics.viewCount),
                "channel": temp.snippet.channelTitle
            });
            if (gcount == 499) // ensures that all requests has completed
            {
                callback();
            }
        });
    }
}

// called when the datarr array is formed
function callback() {
    jsonObject["name"] = "ResponseWeb";
    jsonObject["children"] = [];
    var freqMap = {};
    for (i = 0; i < datarr.length; i++) {
        if (!freqMap[datarr[i]["channel"]]) {
            freqMap[datarr[i]["channel"]] = [];
        }
        freqMap[datarr[i]["channel"]].push({
            "name": datarr[i]["name"],
            "size": datarr[i]["views"]
        });
    }
    for (var key in freqMap) {
        if (freqMap.hasOwnProperty(key)) {
            jsonObject["children"].push({
                "name": key,
                "children": freqMap[key]
            });
        }
    }
    genWeb();
}

// Generates the web Diagram for the API response
function genWeb() {
    document.getElementById("makevis").innerHTML = "This is a Collapsible Force Layout representing the whole hirarchial structure of the acquired data.";
    var width = 600,
        height = 600,
        root;

    var force = d3.layout.force()
        .size([width, height])
        .on("tick", tick);

    var svg = d3.select("#response").append("svg")
        .attr("width", width)
        .attr("height", height);

    var link = svg.selectAll(".link"),
        node = svg.selectAll(".node");

    root = jsonObject;
    update();

    function update() {
        var nodes = flatten(root),
            links = d3.layout.tree().links(nodes);

        // Restart the force layout.
        force
            .nodes(nodes)
            .links(links)
            .start();

        // Update the links…
        link = link.data(links, function(d) {
            return d.target.id;
        });

        // Exit any old links.
        link.exit().remove();

        // Enter any new links.
        link.enter().insert("line", ".node")
            .attr("class", "link")
            .attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });

        // Update the nodes…
        node = node.data(nodes, function(d) {
            return d.id;
        }).style("fill", color);

        // Exit any old nodes.
        node.exit().remove();

        // Enter any new nodes.
        node.enter().append("circle")
            .attr("class", "node")
            .attr("cx", function(d) {
                return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            })
            .attr("r", function(d) {
                return Math.sqrt(d.size) / 200 || 4.5;
            })
            .style("fill", color)
            .on("click", click)
            .call(force.drag)
            .text(function(d) {
                d.name;
            });
    }
    var tooltip = d3.select("body")
        .append("div").attr("id", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("a simple tooltip");
    node.on("mouseover", mouseover);
    node.on("mouseout", mouseout);

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

    function tick() {
        link.attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });

        node.attr("cx", function(d) {
                return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            });
    }

    // Color leaf nodes orange, and packages white or blue.
    function color(d) {
        return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#ffffff";
    }

    // Toggle children on click.
    function click(d) {
        if (!d3.event.defaultPrevented) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update();
        }
    }

    // Returns a list of all nodes under the root.
    function flatten(root) {
        var nodes = [],
            i = 0;

        function recurse(node) {
            if (node.children) node.children.forEach(recurse);
            if (!node.id) node.id = ++i;
            nodes.push(node);
        }

        recurse(root);
        return nodes;
    }
    document.getElementById("nameme").innerHTML = "The small blue circles represent Youtube channels and the white circles are the videos with size varying by their number of views.";
}
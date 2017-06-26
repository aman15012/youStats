var frequency_list = []; //final array response
var freqMap = {};
var wordArr = [];
var count = 0; //page count
var common_words;
var color;
var winner;

//Called on page load
function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

// Called automatically when YouTube API interface is loaded 
function onYouTubeApiLoad() {
    gapi.client.setApiKey(key);
    common_words = ["i", "or", "aboard", "about", "above", "across", "after", "against", "along", "amid", "among", "anti", "around", "as", "at", "before", "behind", "below", "beneath", "beside", "besides", "between", "beyond", "but", "by", "concerning", "considering", "despite", "down", "during", "except", "excepting", "excluding", "following", "for", "from", "in", "inside", "into", "like", "minus", "near", "of", "off", "on", "onto", "opposite", "outside", "over", "past", "per", "plus", "regarding", "round", "save", "since", "than", "through", "to", "toward", "towards", "under", "underneath", "unlike", "until", "up", "upon", "versus", "via", "with", "within", "without", "all", "another", "any", "anybody", "anyone", "anythin", "I", "it", "its", "itsel", "several", "she", "some", "somebody", "someone", "somethin", "bot", "littl", "that", "their", "theirs", "them", "themselves", "these", "they", "this", "thos", "each", "each other", "either", "everybody", "everyone", "everythin", "many", "me", "mine", "more", "most", "much", "my", "mysel", "fe", "neither", "no one", "nobody", "none", "nothin", "u", "he", "her", "hers", "herself", "him", "himself", "hi", "one", "one another", "other", "others", "our", "ours", "ourselve", "we", "what", "whatever", "which", "whichever", "who", "whoever", "whom", "whomever", "whos", "you", "your", "yours", "yourself", "yourselve", "be", "am", "are", "is", "was", "were", "being", "can", "could", "do ", "did ", "does", "doing", "have", "had", "has", "having", "may", "might", "must", "shall", "should", "will", "would", "a", "an", "the", "and"];
    document.getElementById("makevis").innerHTML = "Loading..."
    color = d3.scale.linear()
        .domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100])
        .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);
    search();
}

// Called when we need to make the request
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
        makeCloudData(freqMap);
    }
}

// Extracts description from the json response
function onSearchResponse(response) {

    for (i in response["items"]) {
        var des = String(response["items"][i]["snippet"]["description"]);
        splitit(des);
    }
    var nextToken = String(response["nextPageToken"]);
    searchNext(nextToken);
}

//Makes a frequency map of words
function splitit(string) {
    string = string.toLowerCase();
    var words = string.replace(/[.]/g, '').split(/\s/);
    var reg = new RegExp("^([a-z]+)$")
    for (w in words) {
        words[w] = words[w].trim();
        if (reg.test(words[w])) {
            if (!freqMap[words[w]]) {
                wordArr.push(words[w]);
                freqMap[words[w]] = 0;
            }
            freqMap[words[w]] += 1;
        }
    }
}

// formats the freqMap data
function makeCloudData(freqMap) {
    for (i in wordArr) {
        if (!common_words.includes(wordArr[i])) {
            var smallObj = {};
            smallObj["text"] = wordArr[i];
            smallObj["size"] = freqMap[wordArr[i]];
            frequency_list.push(smallObj);
        }
    }
    var highest = -1;
    for (i = 0; i < frequency_list.length; i++) {
        if (frequency_list[i]["size"] > highest) {
            highest = frequency_list[i]["size"];
            winner = frequency_list[i]["text"];
        }
    }

    go();
}

//Prepares the word clous
function go() {
    d3.layout.cloud().size([1000, 800])
        .words(frequency_list)
        .rotate(0)
        .fontSize(function(d) {
            return d.size;
        })
        .on("end", draw)
        .start();


}

// Draws the word cloud
function draw(words) {
    document.getElementById("makevis").innerHTML = "This is a word cloud formed by the words in the descrptions of the videos acquired. The size and color of a word is a refection of its occurence frequency.";
    d3.select("#response").append("svg")
        .attr("width", 2000)
        .attr("height", 450)
        .attr("class", "wordcloud")
        .append("g")
        // without the transform, words words would get cutoff to the left and top, they would
        // appear outside of the SVG area
        .attr("transform", "translate(320,200)")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function(d) {
            return d.size + "px";
        })
        .style("fill", function(d, i) {
            return color(i);
        })
        .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) {
            return d.text;
        });
    document.getElementById("nameme").innerHTML = "Most occuring word: " + winner;
}
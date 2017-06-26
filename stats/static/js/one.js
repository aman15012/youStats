var jsonResp = new Object(); //final json response
var array = []
var count = 0; //page count

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

// Called on load
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
        makejson();
    }
}

// Extracts name and thumbnail from the json response
function onSearchResponse(response) {

    for (i in response["items"]) {
        var Title = String(response["items"][i]["snippet"]["title"]);
        var pic = String(response["items"][i]["snippet"]["thumbnails"]["medium"]["url"]);
        array_push(Title, pic);
    }
    var nextToken = String(response["nextPageToken"]);
    searchNext(nextToken);
}

// Pushes objects to an array
function array_push(Title, pic) {
    var temp_obj = new Object();
    temp_obj.title = Title;
    temp_obj.pic = pic;
    array.push(temp_obj);

}

// Prepares a json with the collected data
function makejson() {
    jsonResp["response"] = array;
    addtoDOM();
}

// Makes the required changes in the DOM
function addtoDOM() {
    for (i in jsonResp["response"]) {
        document.getElementById("response").innerHTML += "<img id=\"" + jsonResp["response"][i]["title"] + "\" height=\"18em\" width=\"32em\" src=" + jsonResp["response"][i]["pic"] + " \"/>";
        $("img").mouseover(function() {
            document.getElementById("nameme").innerHTML = this.id;
        });
    }
    document.getElementById("makevis").innerHTML = "This is a photograph formed by the thumbnails of the videos acquired. "
}
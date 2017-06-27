# youStats

## About
This webapp requests data about videos on a topic from Youtube and generates cool visualizations with the data.

## Tech
  - Django to set up a web server
  - Youtube Data API to request data
  - Javascript to manipulate the data
  - d3.js to create interactive visualizations
  - html/css to make the web pages
  
## References
  - YouTube Data API Documentation for the API request code
  - Bootstrap for the page layout
  - D3.js examples for the visualizations

## Installation

1.Add an API key to common.js . Follow [this](https://developers.google.com/youtube/v3/getting-started).

2.Install Django on your system and run the web server.

```
$ pip install django~=1.10.0
$ python manage.py runserver
```
## Working Demo
A working demo of the webapp is available at [here](aman15012.pythonanywhere.com) as of 6/27/17 . 

## Screen Captures
![home](https://github.com/aman15012/youStats/blob/master/stats/static/img/home.png)
![5](https://github.com/aman15012/youStats/blob/master/stats/static/img/5.png)

### The webapp can be extended to be used for any keyword.

## Tree 

youStats/  
├── db.sqlite3  
├── got  
│   ├── __init__.py  
│   ├── __pycache__  
│   │   ├── __init__.cpython-34.pyc  
│   │   ├── settings.cpython-34.pyc  
│   │   ├── urls.cpython-34.pyc  
│   │   └── wsgi.cpython-34.pyc  
│   ├── settings.py__  
│   ├── settings.py~__  
│   ├── urls.py__  
│   └── wsgi.py__  
├── manage.py__  
├── notes__ (rough notes)   
├── README.md__ (readme)   
└── stats__ (Web App)  
    ├── admin.py  
    ├── apps.py  
    ├── __init__.py  
    ├── migrations  
    │   ├── __init__.py  
    │   └── __pycache__  
    │       └── __init__.cpython-34.pyc  
    ├── models.py  
    ├── __pycache__  
    │   ├── admin.cpython-34.pyc  
    │   ├── __init__.cpython-34.pyc  
    │   ├── models.cpython-34.pyc  
    │   ├── urls.cpython-34.pyc  
    │   └── views.cpython-34.pyc  
    ├── static  
    │   ├── css (CSS files)  
    │   │   ├── bootstrap.css  
    │   │   ├── bootstrap.css.map  
    │   │   ├── bootstrap-grid.css  
    │   │   ├── bootstrap-grid.css.map  
    │   │   ├── bootstrap-grid.min.css  
    │   │   ├── bootstrap-grid.min.css.map  
    │   │   ├── bootstrap.min.css  
    │   │   ├── bootstrap.min.css.map  
    │   │   ├── bootstrap-reboot.css  
    │   │   ├── bootstrap-reboot.css.map  
    │   │   ├── bootstrap-reboot.min.css  
    │   │   ├── bootstrap-reboot.min.css.map  
    │   │   ├── five.css  
    │   │   ├── four.css  
    │   │   ├── narrow-jt.css    
    │   │   └── style.css (main css file)   
    │   ├── img (Static images)   
    │   │   ├── 5.png (screenshot)  
    │   │   ├── home.png (screenshot)   
    │   │   └── tri.png (favicon)   
    │   └── js (Javascript)   
    │       ├── common.js (common to all pages and contains the key and the query keyword)   
    │       ├── d3.layout.cloud.js (d3.js)  
    │       ├── five.js  
    │       ├── four.js  
    │       ├── home.js  
    │       ├── one.js  
    │       ├── three.js  
    │       └── two.js  
    ├── templates (html files)  
    │   ├── 404.html (404 page)    
    │   └── stats  
    │       ├── five.html (Collapsible Force Layout)   
    │       ├── four.html (Calendar Heatmap)   
    │       ├── home.html  
    │       ├── one.html (Photograph)    
    │       ├── three.html (Bubble Chart)   
    │       └── two.html (Word Cloud)   
    ├── tests.py  
    ├── urls.py (urls)  
    ├── urls.py~  
    ├── views.py  
    └── views.py~  

## Approach
  - Set up a Django Server or any other web server. This is required because the YouTube Data API need a web server to work.
  
  - Set up the required html pages and css files, which will be connected to javascript files. In this case it is 6 pages       (home + 5 visualizations)
  
  - The main work in the development procedure is of Javascript. All the javascript files load when the respective page is       loaded.
  
    Step 1. Extraction of data form Youtube using Youtube Data API
    
              We use the search.list method to obtain a JSON containing the search results for the query keyword.
              At a time a maximum of 50 results can be obtained. We use the nextPageToken form the JSON to traverse through
              further query results. To obtain more data about the videos, video.list method is used for each videoId.
              This call is made for each visualization separately. We have used Javascript for the API calls.
  

    Step 2. Manipulation of the obtained JSON response
    
              We extract the relevant data from the JSON responses collected and store then in a format required by the 
              visualization.

           
    Step 3. Generating the Visualizations
    
              Once we obtain the required data, we use D3.js to generate the required visualizations. The visualizations
              have to be coded/edited as per our need. Also we add interactiveness to these visualizations using jQuery.
           
           
   - Display the visualizations on the required pages by using Javascript DOM.
   
## Tip
When using API calls/ Ajax in Javascript, keep in mind that these calls are slow as compared to other functions. Use callback functions and if conditions to maintain the syncronus data flow.

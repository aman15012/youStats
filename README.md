# youStats

## About
This webapp requests data about videos on a topic from Youtube and generates cool visualizations with the data.

## Tech
  - Django to set up a web server
  - Youtube Data API to request data
  - Javascript to manupulate the data
  - d3.js to create interactive visualizations
  - html/css to make the web pages

## Installation

Install Django on your system and run the web server.

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

youStats/__
├── db.sqlite3__
├── got__
│   ├── __init__.py__
│   ├── __pycache____
│   │   ├── __init__.cpython-34.pyc__
│   │   ├── settings.cpython-34.pyc__
│   │   ├── urls.cpython-34.pyc__
│   │   └── wsgi.cpython-34.pyc__
│   ├── settings.py__
│   ├── settings.py~__
│   ├── urls.py__
│   └── wsgi.py__
├── manage.py__
├── notes__
├── README.md__
└── stats__
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
    │   ├── css
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
    │   │   └── style.css
    │   ├── img
    │   │   ├── 5.png
    │   │   ├── home.png
    │   │   └── tri.png
    │   └── js
    │       ├── common.js
    │       ├── d3.layout.cloud.js
    │       ├── five.js
    │       ├── four.js
    │       ├── home.js
    │       ├── one.js
    │       ├── three.js
    │       └── two.js
    ├── templates
    │   ├── 404.html
    │   └── stats
    │       ├── five.html
    │       ├── four.html
    │       ├── home.html
    │       ├── one.html
    │       ├── three.html
    │       └── two.html
    ├── tests.py
    ├── urls.py
    ├── urls.py~
    ├── views.py
    └── views.py~

## Approach

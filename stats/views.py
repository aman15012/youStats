from django.shortcuts import render

def home(request):
    return render(request, 'stats/home.html', {})

def one(request):
    return render(request, 'stats/one.html', {})

def two(request):
    return render(request, 'stats/two.html', {})

def three(request):
    return render(request, 'stats/three.html', {})

def four(request):
    return render(request, 'stats/four.html', {})

def five(request):
    return render(request, 'stats/five.html', {})

def handler404(request):
    response = render_to_response('404.html', {},
                                  context_instance=RequestContext(request))
    response.status_code = 404
    return response




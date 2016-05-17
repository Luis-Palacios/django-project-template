# django-project-template
A django base project template including bower and gulp initial configurations
## Author
Luis Palacios  


This template includes a nice layout, some directories already created for you, you get to use less by default, some great gulp tasks to help you compile your less files, inject your resulting css and javascript into your base.html, you get bower already setup for you and an initial configuration so that anytime you install a bower component (with --save) it will be automatically injected into your base.html, browserSync ready for you to use alongside your localserver, some automatic css injections(without reloading) when you edit any less file, automatic browser reload when you save any changes in html or js files and a great task to optimize all of your assets(uglify,csso and imagemin)

[Django documentation on project template](https://docs.djangoproject.com/en/1.8/ref/django-admin/#startproject-projectname-destination).

## Requirements

1. For Django >= 1.4 && Django < 1.8 use 1.0.0 for Django > 1.8 use 1.5.0
2. Node.js
3. Bower

## Setup

1. Create your virtualenv and activate it
2. Install django via `pip install django`
3. Create an empty directory for your project and enter **mkdir your_project_name** and **cd your_project_name**
4. Start your project using this template  
  **django 1.8 or higher use**  
``django-admin startproject --template https://github.com/LRPalacios/django-project-template/zipball/master your_project_name .``  
  **django 1.7 or lower use**  
``django-admin startproject --template https://github.com/LRPalacios/django-project-template/zipball/v1.0.0 .`` 
The "." is so that you wont get an extra directory level (You could also use the comand without the "." at the end but make sure to skip the step where you create an empty directory)
5. *Optional* I recommend you first update your bower.json and package.json this is not necessary but it would be good for the documentation of your project.
6. Get into the directory where the project.json and bower.json are and do a **npm install** this will install all the node modules that the gulp tasks need.

## What now?
### Bower and Wiredep
Lets begin by adding bootstrap to our project with **bower install --save bootstrap** (remember to always to this where your bower.json lives) bootstrap and it's dependencies should be in your static/lib directory but that's not all check out your base.html inside your template directory bootstrap and it's dependencies should be injected in your base.html
```html
   <link rel="stylesheet" href="{{ STATIC_URL }}lib/bootstrap/dist/css/bootstrap.css" />
   <script src="{{ STATIC_URL }}lib/jquery/dist/jquery.js"></script>  
   <script src="{{ STATIC_URL }}lib/bootstrap/dist/js/bootstrap.js"></script>
```  
### Less
There is already a site.less in your static/less directory go ahead and add any rules that you want, once your are done do a **gulp inject** and take a look at your base.html  
`<link rel="stylesheet" href="{{ STATIC_URL }}.temp/site.css">`
### BrowserSync
Go ahead and do a normal python manage.py runserver open another console and do a **gulp sync**

## TODO
1. Complete documentation
2. Add more flexibility to the gulp.config.file
3. Fix orthography

## Want to help?

You are welcome to fork and send pull requests or report issues




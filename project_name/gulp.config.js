module.exports = function () {
    var client = './';
    var staticFiles = client + 'static/';
    var templates = client + 'templates/';
    var temp = staticFiles + './.temp/';
    var backupTemplateDir = templates + '.backup/'
    var baseHtml = 'base.html';
    var staticURLPrefix = '{{ STATIC_URL }}';
    //relative from the base html file
    var relativePathToStaticFiles = '../static/';
    
    var config = {
        temp: temp,
        client: client,
        staticFiles: staticFiles,
        templates: templates,
        backupTemplateDir: backupTemplateDir,
        baseHtml: baseHtml,
        staticURLPrefix: staticURLPrefix,
        relativePathToStaticFiles: relativePathToStaticFiles,
        
        /* The base template here anything you install with bower will be injected
         * with wiredep
         */
        base: templates + baseHtml,

        /* Include or exlude here all the js that you want to be 
         * compressed and injected into you base.html
         */
        js: [
            staticFiles + 'js/**/*.js'
        ],

        /* Include or exlude here all the less files that you want to be 
        * compiled
        */
        less: [
            staticFiles + 'less/site.less'
        ],

        /* Include or exlude here all the css that you want to be 
        * compressed and injected into you base.html
        */
        css: [
             temp + '**/*.css'
        ],

        /* Include or exlude here the fonts that you need 
        *  copied to your build directory eg: font awesome
        */
        fonts: [
             staticFiles + 'lib/fontawesome/fonts/**/*.*',
             staticFiles + 'lib/bootstrap/fonts/**/*.*'
        ],

        /* This is where your compressed files will be 
         *  created, some people prefer to call this 'dist'
         */
        build: staticFiles + 'build/',

        /*Include here any other image patter that you want to be optimized
            or add a negate match to exclude 
        */
        images: [
            staticFiles + 'img/**/*.*/'
        ],


        /* 
         * These are the settings for you bower configuration
         */
        bower: {
            json: require('./bower.json'),
            directory: staticFiles + 'lib/',
            ignorePath: '../static/',
            fileTypes: {
                html: {
                    replace: {
                        js: '<script src="{{ STATIC_URL }}{{filePath}}"></script>',
                        css: '<link rel="stylesheet" href="{{ STATIC_URL }}{{filePath}}" />'
                    }
                }
            }
        },
        /* 
        * These are the settings for you inject css
        */
        injectCssOptions: {
            ignorePath: '/static/',
            transform: function (filepath) {
                return '<link rel="stylesheet" href="{{ STATIC_URL }}' + filepath.replace('/', '') + '">';
            }

        },

        /* 
       * These are the settings for you inject css
       */
        injectJsOptions: {
            ignorePath: '/static/',
            transform: function (filepath) {
                return '<script type="text/javascript" src="{{ STATIC_URL }}' + filepath.replace('/', '') + '"></script>';
            }

        }
    };

    config.getWiredepDefaulOptions = function () {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath,
            fileTypes: config.bower.fileTypes
        };
        return options;
    };

    config.getInjectDefaultCssOptions = function () {
        var options = {
            ignorePath: config.injectCssOptions.ignorePath,
            transform: config.injectCssOptions.transform,
        };
        return options;
    };

    config.getInjectDefaultJsOptions = function () {
        var options = {
            ignorePath: config.injectJsOptions.ignorePath,
            transform: config.injectJsOptions.transform,
        };
        return options;
    };


    return config;
}
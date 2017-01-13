/*!
 * 
 * BGONLINE WWW.BGONLINE.CN
 * 
 * Author: @bgonline
 * 2017-01-06
 * 
 */

if (typeof $ === 'undefined') { throw new Error('This application\'s JavaScript requires jQuery'); }

// APP START
// ----------------------------------- 

var App = angular.module('BGONLINE', [
    'ngRoute',
    'ngAnimate',
    'ngStorage',
    'ngCookies',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
    'oc.lazyLoad',
    'cfp.loadingBar',
    'ngSanitize',
    'ngResource',
    'ui.utils'
  ]);

App.run(["$rootScope", "$state", "$stateParams",  '$window', '$templateCache', function ($rootScope, $state, $stateParams, $window, $templateCache) {
    // Set reference to access them from any scope
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$storage = $window.localStorage;

    // $rootScope.rootUrl = 'http://schoolms.thinktorch.cn/public/index.php/';
    $rootScope.rootUrl = 'http://192.168.1.200/201612chick/phpcode/public/index.php/';
    // 禁用模板缓存
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (typeof(toState) !== 'undefined'){
          $templateCache.remove(toState.templateUrl);
        }
    });

    $rootScope.app = {
      name: '一文鸡后台管理系统',
      description: 'ThinkTorch',
      year: ((new Date()).getFullYear()),
      layout: {
        isFixed: true,
        isCollapsed: false,
        isBoxed: false,
        isRTL: false,
        horizontal: false,
        isFloat: false,
        asideHover: false,
        theme: null
      },
      useFullLayout: false,
      hiddenFooter: false,
      viewAnimation: 'ng-fadeInUp'
    };

    $rootScope.user = {
      name:     sessionStorage.paramSession ? JSON.parse(sessionStorage.paramSession).user_name : 'BGONLINE',
      company:  sessionStorage.paramSession ? JSON.parse(sessionStorage.paramSession).school_name : 'BGONLINE.CN',
      job:      'ng-developer',
      picture:  'app/img/user/developer.jpg'
    };

}]);

/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/

App.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  'use strict';

  // Set the following to true to enable the HTML5 Mode
  // You may have to set <base> tag in index and a routing configuration in your server
  $locationProvider.html5Mode(false);

  // default route
  $urlRouterProvider.otherwise('/page/login');

  // 
  // Application Routes
  // -----------------------------------   
  $stateProvider
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: helper.basepath('app.html'),
        controller: 'AppController',
        resolve: helper.resolveFor('modernizr', 'icons', 'layer')
    })
    .state('app.submenu', {
        url: '/submenu',
        title: 'Submenu',
        templateUrl: helper.basepath('submenu.html')
    })
    .state('app.home', {
        url: '/home',
        title: '首页',
        templateUrl: helper.basepath('home.html'),
        resolve: helper.resolveFor('chart.js', 'html2canvas')
    })

    .state('app.userMgmt', {
        url: '/userMgmt',
        title: '用户管理',
        templateUrl: helper.basepath('userMgmt.html')
    })
    .state('app.userInfo', {
        url: '/userInfo',
        title: '会员详情',
        templateUrl: helper.basepath('userInfo.html')
    })
    .state('app.slaveAndmaster', {
        url: '/slaveAndmaster',
        title: '会员详情',
        templateUrl: helper.basepath('slaveAndmaster.html')
    })
    .state('app.editUser', {
        url: '/editUser',
        title: '编辑用户',
        templateUrl: helper.basepath('editUser.html')
    })
    

    .state('app.baseConfig', {
        url: '/baseConfig',
        title: '基础配置',
        templateUrl: helper.basepath('baseConfig.html')
    })

    .state('app.other1Config', {
        url: '/other1Config',
        title: '小狗升级配置',
        templateUrl: helper.basepath('other1Config.html')
    })


    // page
    .state('page', {
        url: '/page',
        templateUrl: 'app/pages/page.html',
        resolve: helper.resolveFor('modernizr', 'icons', 'layer'),
        controller: ["$rootScope", function($rootScope) {
            $rootScope.app.layout.isBoxed = false;
        }]
    })
    .state('page.login', {
        url: '/login',
        title: "登录",
        templateUrl: 'app/pages/login.html'
    })
    
    .state('page.lock', {
        url: '/lock',
        title: "锁定",
        templateUrl: 'app/pages/lock.html'
    })
    .state('page.404', {
        url: '/404',
        title: "Not Found",
        templateUrl: 'app/pages/404.html'
    })
    ;


}]).config(['$ocLazyLoadProvider', 'APP_REQUIRES', function ($ocLazyLoadProvider, APP_REQUIRES) {
    'use strict';

    // Lazy Load modules configuration
    $ocLazyLoadProvider.config({
      debug: false,
      events: true,
      modules: APP_REQUIRES.modules
    });

}]).config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ( $controllerProvider, $compileProvider, $filterProvider, $provide) {
      'use strict';
      // registering components after bootstrap
      App.controller = $controllerProvider.register;
      App.directive  = $compileProvider.directive;
      App.filter     = $filterProvider.register;
      App.factory    = $provide.factory;
      App.service    = $provide.service;
      App.constant   = $provide.constant;
      App.value      = $provide.value;

}]).config(['$translateProvider', function ($translateProvider) {

    $translateProvider.useStaticFilesLoader({
        prefix : 'app/i18n/',
        suffix : '.json'
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.useLocalStorage();
    $translateProvider.usePostCompiling(true);

}]).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 500;
    cfpLoadingBarProvider.parentSelector = '.wrapper > section';
}]).config(['$tooltipProvider', function ($tooltipProvider) {

    $tooltipProvider.options({appendToBody: true});

}]).config(function($httpProvider) { // CORS post跨域配置
    $httpProvider.defaults.useXDomain = true;  
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    /**
     * 
     * @param {Object} obj
     * @return {String}
     * 
     * $http.post 传参方式模拟 $.post
     */ 
    var param = function(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
        
        for(name in obj) {
        value = obj[name];
            
        if(value instanceof Array) {
            for(i = 0; i < value.length; ++i) {
                subValue = value[i];
                fullSubName = name + '[' + i + ']';
                innerObj = {};
                innerObj[fullSubName] = subValue;
                query += param(innerObj) + '&';
            }
        }
        else if(value instanceof Object) {
            for(subName in value) {
                subValue = value[subName];
                fullSubName = name + '[' + subName + ']';
                innerObj = {};
                innerObj[fullSubName] = subValue;
                query += param(innerObj) + '&';
            }
        }
        else if(value !== undefined && value !== null)
            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
        
        return query.length ? query.substr(0, query.length - 1) : query;
    };

    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];

    delete $httpProvider.defaults.headers.common['X-Requested-With']; 
}).config( ['$compileProvider', function( $compileProvider ) {   
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    }
]);
;

/**=========================================================
 * Module: constants.js
 * Define constants to inject across the application
 =========================================================*/
App
  .constant('APP_COLORS', {
    'primary':                '#5d9cec',
    'success':                '#27c24c',
    'info':                   '#23b7e5',
    'warning':                '#ff902b',
    'danger':                 '#f05050',
    'inverse':                '#131e26',
    'green':                  '#37bc9b',
    'pink':                   '#f532e5',
    'purple':                 '#7266ba',
    'dark':                   '#3a3f51',
    'yellow':                 '#fad732',
    'gray-darker':            '#232735',
    'gray-dark':              '#3a3f51',
    'gray':                   '#dde6e9',
    'gray-light':             '#e4eaec',
    'gray-lighter':           '#edf1f2'
  })
  .constant('APP_MEDIAQUERY', {
    'desktopLG':             1200,
    'desktop':                992,
    'tablet':                 768,
    'mobile':                 480
  })
  .constant('APP_REQUIRES', {
    // jQuery based and standalone scripts
    scripts: {
      'modernizr':          ['vendor/modernizr/modernizr.js'],
      'icons':              ['vendor/fontawesome/css/font-awesome.min.css',
                             'vendor/simple-line-icons/css/simple-line-icons.css'],
      'jquery':             ['vendor/jquery/jquery-1.10.2.min.js'],
      'editor':             ['vendor/editor/dist/css/wangEditor.min.css', 
                             'vendor/editor/dist/js/wangEditor.min.js'],
      'datepicker':         ['vendor/datepicker/css/foundation-datepicker.css',
                             'vendor/datepicker/js/foundation-datepicker.js',
                             'vendor/datepicker/js/locales/foundation-datepicker.zh-CN.js'],
      'layer':              ['vendor/layer/layer.js'],
      'html2canvas':        ['vendor/html2canvas/html2canvas.js']       
    },
    // Angular based script (use the right module name)
    modules: [
      { name: 'angularFileUpload', files: ['vendor/angular-file-upload/angular-file-upload.js']},
      { name: 'contenteditable', files: ['vendor/angular-contenteditable/angular-contenteditable.js']},
      { name: 'angularBootstrapNavTree', files: ['vendor/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                                                  'vendor/angular-bootstrap-nav-tree/dist/abn_tree.css']},
      { name: 'SmoothScrollbar', files: ['vendor/scrollbar/smooth-scrollbar.css',
                                         'vendor/scrollbar/smooth-scrollbar.js',
                                         'vendor/scrollbar/angular-smooth-scrollbar.js']},
      { name: 'chart.js', files: ['vendor/angular-chart/Chart.js',
                                  'vendor/angular-chart/angular-chart.js']}
    ]

  })
;
/**=========================================================
 * Module: main.js
 * Main Application Controller
 =========================================================*/

App.controller('AppController',
  ['$rootScope', '$scope', '$state', '$translate', '$window', '$localStorage', '$timeout', 'toggleStateService', 'colors', 'browser', 'cfpLoadingBar',
  function($rootScope, $scope, $state, $translate, $window, $localStorage, $timeout, toggle, colors, browser, cfpLoadingBar) {
    "use strict";

    // Setup the layout mode
    $rootScope.app.layout.horizontal = ( $rootScope.$stateParams.layout == 'app-h') ;

    // Loading bar transition
    // ----------------------------------- 
    var thBar;
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if($('.wrapper > section').length) // check if bar container exists
          thBar = $timeout(function() {
            cfpLoadingBar.start();
          }, 0); // sets a latency Threshold
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        event.targetScope.$watch("$viewContentLoaded", function () {
          $timeout.cancel(thBar);
          cfpLoadingBar.complete();
        });
    });


    // Hook not found
    $rootScope.$on('$stateNotFound',
      function(event, unfoundState, fromState, fromParams) {
          console.log(unfoundState.to); // "lazy.state"
          console.log(unfoundState.toParams); // {a:1, b:2}
          console.log(unfoundState.options); // {inherit:false} + default options
      });
    // Hook error
    $rootScope.$on('$stateChangeError',
      function(event, toState, toParams, fromState, fromParams, error){
        console.log(error);
      });
    // Hook success
    $rootScope.$on('$stateChangeSuccess',
      function(event, toState, toParams, fromState, fromParams) {
        // display new view from top
        $window.scrollTo(0, 0);
        // Save the route title
        $rootScope.currTitle = $state.current.title;
      });

    $rootScope.currTitle = $state.current.title;
    $rootScope.pageTitle = function() {
      var title = $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);
      document.title = title;
      return title; 
    };

    // iPad may presents ghost click issues
    // if( ! browser.ipad )
      // FastClick.attach(document.body);

    // Close submenu when sidebar change from collapsed to normal
    $rootScope.$watch('app.layout.isCollapsed', function(newValue, oldValue) {
      if( newValue === false )
        $rootScope.$broadcast('closeSidebarMenu');
    });

    // Restore layout settings
    if( angular.isDefined($localStorage.layout) )
      $scope.app.layout = $localStorage.layout;
    else
      $localStorage.layout = $scope.app.layout;

    $rootScope.$watch("app.layout", function () {
      $localStorage.layout = $scope.app.layout;
    }, true);

    
    // Allows to use branding color with interpolation
    // {{ colorByName('primary') }}
    $scope.colorByName = colors.byName;

    // Internationalization
    // ----------------------

    $scope.language = {
      // Handles language dropdown
      listIsOpen: false,
      // list of available languages
      available: {
        'en':       'English',
        'es_AR':    'Español'
      },
      // display always the current ui language
      init: function () {
        var proposedLanguage = $translate.proposedLanguage() || $translate.use();
        var preferredLanguage = $translate.preferredLanguage(); // we know we have set a preferred one in app.config
        $scope.language.selected = $scope.language.available[ (proposedLanguage || preferredLanguage) ];
      },
      set: function (localeId, ev) {
        // Set the new idiom
        $translate.use(localeId);
        // save a reference for the current language
        $scope.language.selected = $scope.language.available[localeId];
        // finally toggle dropdown
        $scope.language.listIsOpen = ! $scope.language.listIsOpen;
      }
    };

    $scope.language.init();

    // Restore application classes state
    toggle.restoreState( $(document.body) );

    // cancel click event easily
    $rootScope.cancel = function($event) {
      $event.stopPropagation();
    };

}]);

/**=========================================================
 * Module: sidebar-menu.js
 * Handle sidebar collapsible elements
 =========================================================*/

App.controller('SidebarController', ['$rootScope', '$scope', '$state', '$http', '$timeout', 'Utils', 'ParamTransmit', 'ConnectApi',
  function($rootScope, $scope, $state, $http, $timeout, Utils, ParamTransmit, ConnectApi) {

    var collapseList = [];

    // demo: when switch from collapse to hover, close all items
    $rootScope.$watch('app.layout.asideHover', function(oldVal, newVal){
      if ( newVal === false && oldVal === true) {
        closeAllBut(-1);
      }
    });

    // Check item and children active state
    var isActive = function(item) {

      if(!item) return;

      if( !item.sref || item.sref == '#') {
        var foundActive = false;
        angular.forEach(item.submenu, function(value, key) {
          if(isActive(value)) foundActive = true;
        });
        return foundActive;
      }
      else
        return $state.is(item.sref) || $state.includes(item.sref);
    };

    // Load menu from json file
    // ----------------------------------- 
    
    $scope.getMenuItemPropClasses = function(item) {
      return (item.heading ? 'nav-heading' : '') +
             (isActive(item) ? ' active' : '') ;
    };

    $scope.loadSidebarMenu = function() {
    //   $scope.param = ParamTransmit.getParam();
    //   ConnectApi.start('post', 'index/index/actiongetmenu', $scope.param).then(function(response) {
    //       var data = ConnectApi.data({ res: response });
    //       if(data.code == 200) {
    //           $scope.menuItems = data.data.Menu;
    //           $rootScope.roleItems = data.data.userAuth;
    //       }
    //   }, function(x) { 
    //       layer.alert("服务器异常，请稍后再试！", {closeBtn: 0, icon: 5}, function() {
    //           layer.closeAll();
    //       });
    //   });
      var menuJson = 'server/sidebar-menu.json', // 本地菜单
          menuURL  = menuJson + '?v=' + (new Date().getTime()); // jumps cache
      $http.get(menuURL)
        .success(function(items) {
           $scope.menuItems = items;
        })
        .error(function(data, status, headers, config) {
          alert('菜单获取失败！');
        });
    };

     $scope.loadSidebarMenu();

    // Handle sidebar collapse items
    // ----------------------------------- 

    $scope.addCollapse = function($index, item) {
      collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);
    };

    $scope.isCollapse = function($index) {
      return (collapseList[$index]);
    };

    $scope.toggleCollapse = function($index, isParentItem) {


      // collapsed sidebar doesn't toggle drodopwn
      if( Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover ) return true;

      // make sure the item index exists
      if( angular.isDefined( collapseList[$index] ) ) {
        if ( ! $scope.lastEventFromChild ) {
          collapseList[$index] = !collapseList[$index];
          closeAllBut($index);
        }
      }
      else if ( isParentItem ) {
        closeAllBut(-1);
      }
      
      $scope.lastEventFromChild = isChild($index);

      return true;
    
    };

    function closeAllBut(index) {
      index += '';
      for(var i in collapseList) {
        if(index < 0 || index.indexOf(i) < 0)
          collapseList[i] = true;
      }
    }

    function isChild($index) {
      return (typeof $index === 'string') && !($index.indexOf('-') < 0);
    }

}]);

/**=========================================================
 * Module: navbar-search.js
 * Navbar search toggler * Auto dismiss on ESC key
 =========================================================*/

App.directive('searchOpen', ['navSearch', function(navSearch) {
  'use strict';

  return {
    restrict: 'A',
    controller: ["$scope", "$element", function($scope, $element) {
      $element
        .on('click', function (e) { e.stopPropagation(); })
        .on('click', navSearch.toggle);
    }]
  };

}]).directive('searchDismiss', ['navSearch', function(navSearch) {
  'use strict';

  var inputSelector = '.navbar-form input[type="text"]';

  return {
    restrict: 'A',
    controller: ["$scope", "$element", function($scope, $element) {

      $(inputSelector)
        .on('click', function (e) { e.stopPropagation(); })
        .on('keyup', function(e) {
          if (e.keyCode == 27) // ESC
            navSearch.dismiss();
        });
        
      // click anywhere closes the search
      $(document).on('click', navSearch.dismiss);
      // dismissable options
      $element
        .on('click', function (e) { e.stopPropagation(); })
        .on('click', navSearch.dismiss);
    }]
  };

}]);


/**=========================================================
 * Module: sidebar.js
 * Wraps the sidebar and handles collapsed state
 =========================================================*/

App.directive('sidebar', ['$rootScope', '$window', 'Utils', function($rootScope, $window, Utils) {
  
  var $win  = $($window);
  var $body = $('body');
  var $scope;
  var $sidebar;
  var currentState = $rootScope.$state.current.name;

  return {
    restrict: 'EA',
    template: '<nav class="sidebar" ng-transclude></nav>',
    transclude: true,
    replace: true,
    link: function(scope, element, attrs) {
      
      $scope   = scope;
      $sidebar = element;

      var eventName = Utils.isTouch() ? 'click' : 'mouseenter' ;
      var subNav = $();
      $sidebar.on( eventName, '.nav > li', function() {

        if( Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover ) {

          subNav.trigger('mouseleave');
          subNav = toggleMenuItem( $(this) );

          // Used to detect click and touch events outside the sidebar          
          sidebarAddBackdrop();

        }

      });

      scope.$on('closeSidebarMenu', function() {
        removeFloatingNav();
      });

      // Normalize state when resize to mobile
      $win.on('resize', function() {
        if( ! Utils.isMobile() )
          $body.removeClass('aside-toggled');
      });

      // Adjustment on route changes
      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        currentState = toState.name;
        // Hide sidebar automatically on mobile
        $('body.aside-toggled').removeClass('aside-toggled');

        $rootScope.$broadcast('closeSidebarMenu');
      });

      // Allows to close
      if ( angular.isDefined(attrs.sidebarAnyclickClose) ) {

        $('.wrapper').on('click.sidebar', function(e){
          // don't check if sidebar not visible
          if( ! $body.hasClass('aside-toggled')) return;

          // if not child of sidebar
          if( ! $(e.target).parents('.aside').length ) {
            $body.removeClass('aside-toggled');          
          }

        });
      }

    }
  };

  function sidebarAddBackdrop() {
    var $backdrop = $('<div/>', { 'class': 'dropdown-backdrop'} );
    $backdrop.insertAfter('.aside-inner').on("click mouseenter", function () {
      removeFloatingNav();
    });
  }

  // Open the collapse sidebar submenu items when on touch devices 
  // - desktop only opens on hover
  function toggleTouchItem($element){
    $element
      .siblings('li')
      .removeClass('open')
      .end()
      .toggleClass('open');
  }

  // Handles hover to open items under collapsed menu
  // ----------------------------------- 
  function toggleMenuItem($listItem) {

    removeFloatingNav();

    var ul = $listItem.children('ul');
    
    if( !ul.length ) return $();
    if( $listItem.hasClass('open') ) {
      toggleTouchItem($listItem);
      return $();
    }

    var $aside = $('.aside');
    var $asideInner = $('.aside-inner'); // for top offset calculation
    // float aside uses extra padding on aside
    var mar = parseInt( $asideInner.css('padding-top'), 0) + parseInt( $aside.css('padding-top'), 0);
    var subNav = ul.clone().appendTo( $aside );
    
    toggleTouchItem($listItem);

    var itemTop = ($listItem.position().top + mar) - $sidebar.scrollTop();
    var vwHeight = $win.height();

    subNav
      .addClass('nav-floating')
      .css({
        position: $scope.app.layout.isFixed ? 'fixed' : 'absolute',
        top:      itemTop,
        bottom:   (subNav.outerHeight(true) + itemTop > vwHeight) ? 0 : 'auto'
      });

    subNav.on('mouseleave', function() {
      toggleTouchItem($listItem);
      subNav.remove();
    });

    return subNav;
  }

  function removeFloatingNav() {
    $('.dropdown-backdrop').remove();
    $('.sidebar-subnav.nav-floating').remove();
    $('.sidebar li.open').removeClass('open');
  }

}]);
/**=========================================================
 * Module: toggle-state.js
 * Toggle a classname from the BODY Useful to change a state that 
 * affects globally the entire layout or more than one item 
 * Targeted elements must have [toggle-state="CLASS-NAME-TO-TOGGLE"]
 * User no-persist to avoid saving the sate in browser storage
 =========================================================*/

App.directive('toggleState', ['toggleStateService', function(toggle) {
  'use strict';
  
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {

      var $body = $('body');

      $(element)
        .on('click', function (e) {
          e.preventDefault();
          var classname = attrs.toggleState;
          
          if(classname) {
            if( $body.hasClass(classname) ) {
              $body.removeClass(classname);
              if( ! attrs.noPersist)
                toggle.removeState(classname);
            }
            else {
              $body.addClass(classname);
              if( ! attrs.noPersist)
                toggle.addState(classname);
            }
            
          }

      });
    }
  };
  
}]);


/**=========================================================
 * Module: browser.js
 * Browser detection
 =========================================================*/

App.service('browser', function(){
  "use strict";

  var matched, browser;

  var uaMatch = function( ua ) {
    ua = ua.toLowerCase();

    var match = /(opr)[\/]([\w.]+)/.exec( ua ) ||
      /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
      /(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
      /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
      /(msie) ([\w.]+)/.exec( ua ) ||
      ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec( ua ) ||
      ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
      [];

    var platform_match = /(ipad)/.exec( ua ) ||
      /(iphone)/.exec( ua ) ||
      /(android)/.exec( ua ) ||
      /(windows phone)/.exec( ua ) ||
      /(win)/.exec( ua ) ||
      /(mac)/.exec( ua ) ||
      /(linux)/.exec( ua ) ||
      /(cros)/i.exec( ua ) ||
      [];

    return {
      browser: match[ 3 ] || match[ 1 ] || "",
      version: match[ 2 ] || "0",
      platform: platform_match[ 0 ] || ""
    };
  };

  matched = uaMatch( window.navigator.userAgent );
  browser = {};

  if ( matched.browser ) {
    browser[ matched.browser ] = true;
    browser.version = matched.version;
    browser.versionNumber = parseInt(matched.version);
  }

  if ( matched.platform ) {
    browser[ matched.platform ] = true;
  }

  // These are all considered mobile platforms, meaning they run a mobile browser
  if ( browser.android || browser.ipad || browser.iphone || browser[ "windows phone" ] ) {
    browser.mobile = true;
  }

  // These are all considered desktop platforms, meaning they run a desktop browser
  if ( browser.cros || browser.mac || browser.linux || browser.win ) {
    browser.desktop = true;
  }

  // Chrome, Opera 15+ and Safari are webkit based browsers
  if ( browser.chrome || browser.opr || browser.safari ) {
    browser.webkit = true;
  }

  // IE11 has a new token so we will assign it msie to avoid breaking changes
  if ( browser.rv )
  {
    var ie = "msie";

    matched.browser = ie;
    browser[ie] = true;
  }

  // Opera 15+ are identified as opr
  if ( browser.opr )
  {
    var opera = "opera";

    matched.browser = opera;
    browser[opera] = true;
  }

  // Stock Android browsers are marked as Safari on Android.
  if ( browser.safari && browser.android )
  {
    var android = "android";

    matched.browser = android;
    browser[android] = true;
  }

  // Assign the name and platform variable
  browser.name = matched.browser;
  browser.platform = matched.platform;


  return browser;

});
/**=========================================================
 * Module: colors.js
 * Services to retrieve global colors
 =========================================================*/
 
App.factory('colors', ['APP_COLORS', function(colors) {
  
  return {
    byName: function(name) {
      return (colors[name] || '#fff');
    }
  };

}]);

/**=========================================================
 * Module: nav-search.js
 * Services to share navbar search functions
 =========================================================*/
 
App.service('navSearch', function() {
  var navbarFormSelector = 'form.navbar-form';
  return {
    toggle: function() {
      
      var navbarForm = $(navbarFormSelector);

      navbarForm.toggleClass('open');
      
      var isOpen = navbarForm.hasClass('open');
      
      navbarForm.find('input')[isOpen ? 'focus' : 'blur']();

    },

    dismiss: function() {
      $(navbarFormSelector)
        .removeClass('open')      // Close control
        .find('input[type="text"]').blur() // remove focus
        .val('')                    // Empty input
        ;
    }
  };

});
/**=========================================================
 * Module: helpers.js
 * Provides helper functions for routes definition
 =========================================================*/

App.provider('RouteHelpers', ['APP_REQUIRES', function (appRequires) {
  "use strict";

  // Set here the base of the relative path
  // for all app views
  this.basepath = function (uri) {
    return 'app/views/' + uri;
  };

  // Generates a resolve object by passing script names
  // previously configured in constant.APP_REQUIRES
  this.resolveFor = function () {
    var _args = arguments;
    return {
      deps: ['$ocLazyLoad','$q', function ($ocLL, $q) {
        // Creates a promise chain for each argument
        var promise = $q.when(1); // empty promise
        for(var i=0, len=_args.length; i < len; i ++){
          promise = andThen(_args[i]);
        }
        return promise;

        // creates promise to chain dynamically
        function andThen(_arg) {
          // also support a function that returns a promise
          if(typeof _arg == 'function')
              return promise.then(_arg);
          else
              return promise.then(function() {
                // if is a module, pass the name. If not, pass the array
                var whatToLoad = getRequired(_arg);
                // simple error check
                if(!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                // finally, return a promise
                return $ocLL.load( whatToLoad );
              });
        }
        // check and returns required data
        // analyze module items with the form [name: '', files: []]
        // and also simple array of script files (for not angular js)
        function getRequired(name) {
          if (appRequires.modules)
              for(var m in appRequires.modules)
                  if(appRequires.modules[m].name && appRequires.modules[m].name === name)
                      return appRequires.modules[m];
          return appRequires.scripts && appRequires.scripts[name];
        }

      }]};
  }; // resolveFor

  // not necessary, only used in config block for routes
  this.$get = function(){};

}]);


/**=========================================================
 * Module: toggle-state.js
 * Services to share toggle state functionality
 =========================================================*/

App.service('toggleStateService', ['$rootScope', function($rootScope) {

  var storageKeyName  = 'toggleState';

  // Helper object to check for words in a phrase //
  var WordChecker = {
    hasWord: function (phrase, word) {
      return new RegExp('(^|\\s)' + word + '(\\s|$)').test(phrase);
    },
    addWord: function (phrase, word) {
      if (!this.hasWord(phrase, word)) {
        return (phrase + (phrase ? ' ' : '') + word);
      }
    },
    removeWord: function (phrase, word) {
      if (this.hasWord(phrase, word)) {
        return phrase.replace(new RegExp('(^|\\s)*' + word + '(\\s|$)*', 'g'), '');
      }
    }
  };

  // Return service public methods
  return {
    // Add a state to the browser storage to be restored later
    addState: function(classname){
      var data = angular.fromJson($rootScope.$storage[storageKeyName]);
      
      if(!data)  {
        data = classname;
      }
      else {
        data = WordChecker.addWord(data, classname);
      }

      $rootScope.$storage[storageKeyName] = angular.toJson(data);
    },

    // Remove a state from the browser storage
    removeState: function(classname){
      var data = $rootScope.$storage[storageKeyName];
      // nothing to remove
      if(!data) return;

      data = WordChecker.removeWord(data, classname);

      $rootScope.$storage[storageKeyName] = angular.toJson(data);
    },
    
    // Load the state string and restore the classlist
    restoreState: function($elem) {
      var data = angular.fromJson($rootScope.$storage[storageKeyName]);
      
      // nothing to restore
      if(!data) return;
      $elem.addClass(data);
    }

  };

}]);
/**=========================================================
 * Module: utils.js
 * Utility library to use across the theme
 =========================================================*/

App.service('Utils', ["$window", "APP_MEDIAQUERY", function($window, APP_MEDIAQUERY) {
    'use strict';
    
    var $html = angular.element("html"),
        $win  = angular.element($window),
        $body = angular.element('body');

    return {
      // DETECTION
      support: {
        transition: (function() {
                var transitionEnd = (function() {

                    var element = document.body || document.documentElement,
                        transEndEventNames = {
                            WebkitTransition: 'webkitTransitionEnd',
                            MozTransition: 'transitionend',
                            OTransition: 'oTransitionEnd otransitionend',
                            transition: 'transitionend'
                        }, name;

                    for (name in transEndEventNames) {
                        if (element.style[name] !== undefined) return transEndEventNames[name];
                    }
                }());

                return transitionEnd && { end: transitionEnd };
            })(),
        animation: (function() {

            var animationEnd = (function() {

                var element = document.body || document.documentElement,
                    animEndEventNames = {
                        WebkitAnimation: 'webkitAnimationEnd',
                        MozAnimation: 'animationend',
                        OAnimation: 'oAnimationEnd oanimationend',
                        animation: 'animationend'
                    }, name;

                for (name in animEndEventNames) {
                    if (element.style[name] !== undefined) return animEndEventNames[name];
                }
            }());

            return animationEnd && { end: animationEnd };
        })(),
        requestAnimationFrame: window.requestAnimationFrame ||
                               window.webkitRequestAnimationFrame ||
                               window.mozRequestAnimationFrame ||
                               window.msRequestAnimationFrame ||
                               window.oRequestAnimationFrame ||
                               function(callback){ window.setTimeout(callback, 1000/60); },
        touch: (
            ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
            (window.DocumentTouch && document instanceof window.DocumentTouch)  ||
            (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
            (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
            false
        ),
        mutationobserver: (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null)
      },
      // UTILITIES
      isInView: function(element, options) {

          var $element = $(element);

          if (!$element.is(':visible')) {
              return false;
          }

          var window_left = $win.scrollLeft(),
              window_top  = $win.scrollTop(),
              offset      = $element.offset(),
              left        = offset.left,
              top         = offset.top;

          options = $.extend({topoffset:0, leftoffset:0}, options);

          if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
              left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
            return true;
          } else {
            return false;
          }
      },
      langdirection: $html.attr("dir") == "rtl" ? "right" : "left",
      isTouch: function () {
        return $html.hasClass('touch');
      },
      isSidebarCollapsed: function () {
        return $body.hasClass('aside-collapsed');
      },
      isSidebarToggled: function () {
        return $body.hasClass('aside-toggled');
      },
      isMobile: function () {
        return $win.width() < APP_MEDIAQUERY.tablet;
      }
    };
}]);



/**
 * 
 * BGONLINE.CN
 * 2016-11-25
 * version: 0.0.1
 * 
 */

App.directive('variety', function() { // 多状态选择器
    return {
        restrict: 'A', 
        replace: true,
        scope: {
            val: '@val',
            cfg: '=cfg' 
        },
        template: '<div>'+
                    '<span ng-repeat="c in cfg track by $index" ng-if="val == c.val" ng-bind="c.name" style="{{ \'color:\' + c.color }}"></span>'+
                  '</div>'
    }
});



App.directive('bgoSelect', function() { // 下拉选择器
    return {
        restrict: 'A',
        replace: true,
        scope: {
            val: '@val',
            list: '=list',
            means: '&means'
        },
        template: '<div dropdown="" class="btn-group" style="margin: 0;">'+
                      '<button type="button" dropdown-toggle="" class="btn btn-default bgo-button">'+
                          '<span ng-repeat="o in list" ng-if="val == o.val" ng-bind="o.valName" style="{{ \'color:\' + o.color }}"></span>'+
                          '<span class="caret" style="color: #78A7DE;"></span>'+
                      '</button>'+
                      '<ul role="menu" class="dropdown-menu dropdown-menu-left animated fadeInUpShort">'+
                          '<li ng-repeat="o in list"><a ng-click="getVal(o.val);means()">{{ o.valName }}</a>'+
                          '</li>'+
                      '</ul>'+
                  '</div>',
        controller: function($scope, ParamTransmit) {
            $scope.getVal = function(val) {
                ParamTransmit.setParam({ val }, ['token', 'user_id', 'tname']);
            }
        }
                
    }

});


App.directive('inputAutoSubmit', function() { // 输入框自动提交
    return {
        restrict: 'A',
        replace: true,
        scope: {
            val: '=val',
            key: '@key',
            means: '&means'
        },
        template: '<div style="display: inline-block;vertical-align: middle;">'+
                      '<input type="text" class="bgo-input" ng-model="val">'+
                  '</div>',
        controller: function($scope, $rootScope, ParamTransmit, $timeout) {
            var timeout;
            $scope.$watch('val', function(newVal, oldVal) {
                if(newVal != oldVal && newVal) {
                    if(timeout) $timeout.cancel(timeout);
                    timeout = $timeout(function() {
                        ParamTransmit.setParam({ key: $scope.key, val: $scope.val }, ['token', 'sysuser_id', 'tname']);
                        $scope.means();
                    }, 2000);
                }
            })
        }
    }
});



App.directive('multipleInput', function() { // 多选项弹层选择器
    return {
        restrict: 'A',
        replace: true,
        scope: {
            list: '=list',
            multShow: '=multShow',
            index: '=index'
        },
        templateUrl: 'app/views/partials/multiple-input.html',
        controller: function($rootScope, $scope, ParamTransmit) {
            $scope.valArr = [];
            $scope.selectLi = function(_index, e, data) {
                if(e.target.className == 'mSelected') {
                    e.target.className = '';
                    $scope.valArr.splice(_index, 1);
                }else {
                    e.target.className = 'mSelected';
                    $scope.valArr[_index] = data;
                }
            }

            $scope.sure = function() {
                if($scope.valArr.length > 0) {
                    if($scope.index != undefined && $scope.index != null) {
                        $rootScope.multShow[$scope.index] = false;
                        $rootScope.classArr[$scope.index] = $scope.valArr;
                    }else {
                        $rootScope.multShow = false;
                        $rootScope.classArr = $scope.valArr;
                    }
                }
            }
        }
    }
});


App.directive('numSelect', function() { // 数量选择器
    return {
        restrict: 'A', 
        replace: true,
        scope: {
            num: '=num'
        },
        template: '<ul class="bgo-num-select clearfix">'+
                    '<li>'+
                        '<button class="btn btn-default" ng-click="changeNum(0)">-</button>'+
                    '</li>'+
                    '<li><input type="text" ng-model="num" ng-pattern="/^[0-9]{0,6}$/"></li>'+
                    '<li>'+
                        '<button class="btn btn-default" ng-click="changeNum(1)">+</button>'+
                    '</li>'+
                '</ul>',
        controller: function($scope) {
            $scope.changeNum = function(t) {
                t ? parseInt($scope.num++) : parseInt($scope.num--);
            }
        }

    }
        
});



App.directive('wangEditor', function() { // 集成wangEditor
    return {
        restrict: 'A' ,
        require: '?ngModel',
        scope: {
            url: '@url'
        },
        link: function(scope, element, attrs, ngModel) {
            if (!ngModel) return;
            ngModel.$render = function() {
                element.html(ngModel.$viewValue || '');
            };
            element.on('blur keyup mouseout mouseup change', function() {
                scope.$apply(readViewText);
            });
            
            function readViewText() {
                var html = element.html();
                if (attrs.stripBr && html === '<br>') {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }

            // 创建编辑器
            wangEditor.config.printLog = false;
            var editor = new wangEditor(element);

            // 移除插入代码和全屏功能与地图功能
            editor.config.menus = $.map(wangEditor.config.menus, function(item, key) { 
                if (item === 'insertcode') return null;
                if (item === 'fullscreen') return null; 
                if (item === 'location') return null; 
                return item;
            });
            
            editor.config.uploadImgUrl = scope.url + 'gd/upload';
            editor.config.pasteText = true // 只粘贴纯文本

            editor.create();

        }
    };
});




App.directive('paging', function() { // 分页
    return {
        restrict: 'A',
        replace: true,
        scope: {
            totalPage: '=totalPage',
            currentPage: '=currentPage',
            getData: '&getData'
        },
        templateUrl: 'app/views/partials/paging.html',
        controller: function($scope) {

            $scope.firstPage = function() { $scope.currentPage = 1; }
            $scope.lastPage = function() { $scope.currentPage = $scope.totalPage; }
            $scope.prePage = function() { $scope.currentPage--; }
            $scope.nextPage = function() { $scope.currentPage++; }

            $scope.$watch('currentPage', function(newVal, oldVal) {
                if(newVal != oldVal && newVal) $scope.getData();
            })
        }
    };
});




App.directive('timerBtn', function() { // 倒计时按钮
    return {
        restrict: 'A',
        replace: true,
        scope: {
            startTime: '=startTime',
            getData: '&getData'
        },
        template: '<button class="btn btn-danger" style="border-radius: 30px;padding: 3px 16px;" ng-disabled="startTime> 0" ng-bind="startTime > 0 ? showTime + \' 后开奖\' : \'手动开奖\'" ng-click="getData()"></button>',
        controller: function($scope, $interval) {

            var formatTime = function(second) {
                return [parseInt(second / 60 / 60), parseInt(second / 60 % 60), second % 60].join(":")
                    .replace(/\b(\d)\b/g, "0$1");
            }
            
            var timer = $interval(function() {
                $scope.startTime -= 1;
                $scope.showTime = formatTime($scope.startTime);
                if($scope.startTime < 1) {
                    $interval.cancel(timer);
                };
            }, 1000);

        }
    };
});



App.directive('datePicker', function() { // 日期控件
    return {
        restrict: 'EA', 
        replace: true,
        scope: {
            month: '=month',
            means: '&means'
        },
        templateUrl: 'app/views/partials/data-picker.html',
        controller: function($scope, $rootScope, ParamTransmit) {
            var date = new Date();
            var dpDate = {
                month: date.getMonth(),
                year: date.getFullYear(),
            }

            var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            // 判断是否为闰年，并返回该月天数
            var isLeapYear = function(y, m) {
                if(m < 0) { m = 11; }
                if(m > 11) { m = 0; }
                if(m == 1) { return ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) ? 29 : 28; }
                else { return monthDays[m]; }
            }
            
            var showDate = function() { // 输入框中展示时间
                if(dpDate.month + 1 < 10) {
                    $scope.month = dpDate.year + ' - ' + '0' + parseInt(dpDate.month + 1);
                    var dateOfDay = (dpDate.year).toString() + '0' + (parseInt(dpDate.month + 1)).toString();
                }else {
                    $scope.month = dpDate.year + ' - ' + parseInt(dpDate.month + 1);
                    var dateOfDay = (dpDate.year).toString() + (parseInt(dpDate.month + 1)).toString();
                }

                var days = isLeapYear(dpDate.year, dpDate.month);
                
            };

            showDate();

            $scope.preMonth = function() {
                dpDate.month--;
                if(dpDate.month < 0) {
                    dpDate.month = 11;
                    dpDate.year--;
                }
                showDate();
            };
            
            $scope.nextMonth = function() {
                dpDate.month++;
                if(dpDate.month > 11) {
                    dpDate.month = 0;
                    dpDate.year++;
                }
                showDate();
            };
        }
    }
})


App.filter('timeFilter', function() { // 日期格式化

    //获取相对日期
    function GetRelativeDate(timestampstr) {
        var timestamp = parseInt(timestampstr);
        timestamp = isNaN(timestamp) ? 0 : timestamp;
        var thenT = new Date(timestamp);
        thenT.setHours(0);
        thenT.setMinutes(0);
        thenT.setSeconds(0);
        var nowtime = new Date();
        nowtime.setHours(0);
        nowtime.setMinutes(0);
        nowtime.setSeconds(0);
        var delt = Math.round((nowtime.getTime() - thenT.getTime()) / 1000 / 86400);
        var day_def = {
            '-3': '大后天',
            '-2': '后天',
            '-1': '明天',
            '0': '今天',
            '1': '昨天',
            '2': '前天',
            '3': '上前天'
        }[delt.toString()] || ((delt >= -30 && delt < 0) ? Math.abs(delt) + '天后' : (delt > 0 && delt <= 30) ? delt + '天前' : GetDateString(timestamp));
        return day_def;
    }

    function GetDateString(timestampstr, split) {
        var timestamp = parseInt(timestampstr);
        timestamp = isNaN(timestamp) ? 0 : timestamp;
        var datetime = new Date(timestamp);
        var month = datetime.getMonth() + 1;
        var date = datetime.getDate();
        if (split === undefined) split = '-';
        return datetime.getFullYear() + split + (month > 9 ? month : "0" + month) + split + (date > 9 ? date : "0" + date);
    }
    
    return function(time) {
        var week = new Date(parseInt(time) * 1000).getDay();
        var hours = new Date(parseInt(time) * 1000).getHours();
        var minutes = new Date(parseInt(time) * 1000).getMinutes();

        if(hours < 10 && minutes < 10) {
            var t = '0' + hours + ':0' + minutes;
        }else if(hours < 10 && minutes > 9) {
            var t = '0' + hours + ':' + minutes;
        }else if(hours > 9 && minutes < 10) {
            var t = hours + ':0' + minutes;
        }else {
            var t = hours + ':' + minutes;
        }

        switch(week) {
            case 1:
                return '周一（'+GetRelativeDate(time * 1000)+' '+ t +'）';
            case 2:
                return '周二（'+GetRelativeDate(time * 1000)+' '+ t +'）';
            case 3:
                return '周三（'+GetRelativeDate(time * 1000)+' '+ t +'）';
            case 4:
                return '周四（'+GetRelativeDate(time * 1000)+' '+ t +'）';
            case 5:
                return '周五（'+GetRelativeDate(time * 1000)+' '+ t +'）';
            case 6:
                return '周六（'+GetRelativeDate(time * 1000)+' '+ t +'）';
            case 0:
                return '周日（'+GetRelativeDate(time * 1000)+' '+ t +'）';
        }
    };
})




App.filter('to_trusted', ['$sce', function ($sce) { // html代码格式化
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);




// 参数传递
App.factory('ParamTransmit', function() {

   var saveParam = function(param) {
       sessionStorage.setItem('paramSession', JSON.stringify(param));
   }
   
   var judgeOldParam = function(oldParam, param, permanent) { // 处理需要永久保存的参数
        
        if(permanent && permanent.length != 0) {
            // 将原始数据的属性名与值转换为数组
            var paramKeyArr = [], paramValArr = [];
            for(paramKey in param) {
                paramKeyArr.push(paramKey);
                paramValArr.push(eval('param.' + paramKey));
            }
            // 将paramKeyArr转换为hash对象
            var hash = {};
            for(var i = 0; i < paramKeyArr.length; i++) {
                hash[paramKeyArr[i]] = true; 
            } 

            for(var k = 0; k < permanent.length; k++) { 
                if(typeof hash[permanent[k]] == "undefined") {
                    if(eval('oldParam.' + permanent[k])) {
                        eval('param.' + permanent[k] + '=' + 'oldParam.' + permanent[k]);
                    }else {
                        eval('param.' + permanent[k] + '=' + null);
                        console.log('尝试永久保存' + permanent[k] + '时发现该值不存在！');
                    }
                } 
            }
        }
        saveParam(param);
   }
   
   var paramJson = function() {
       return sessionStorage.paramSession ? JSON.parse(sessionStorage.paramSession) : {};
   }

   return {
       
      setParam: function(param, permanent) {
         try {
            var oldParam = paramJson();
         } catch(err) {
            console.log('ParamTransmit运行成功！');
            var oldParam = false;
         }
         judgeOldParam(oldParam, param, permanent);
         return paramJson();
      },


      getParam: function() { return paramJson(); },

      removeParam: function(key) {
         var param = paramJson();
         var delExpr = 'delete param.' + key;
         eval(delExpr);
         sessionStorage.setItem('paramSession', JSON.stringify(param));
         return paramJson();
      },

      clearParam: function() { sessionStorage.removeItem('paramSession'); }

   }
   
});





// 封装http请求
App.factory('ConnectApi', function($rootScope, $http, $state) {

   return {
      start: function(method, url, param) {
          if(method === 'post') {
              _http = $http.post('' + $rootScope.rootUrl + url + '', param);
          }else if(method === 'get') {
              _http = $http.get('' + $rootScope.rootUrl + url + '', param);
          }else {
              console.log('连接方式传入错误！');
          }
          return _http;
      },

      data: function(dispose) {
          if(dispose.res.data.code) {
              if( dispose.res.data.code != 200 ) {
                if( dispose.res.data.code == 201 ) {
                    layer.alert("登录信息异常，请重新登录", {closeBtn: 0, icon: 5}, function() {
                        layer.closeAll();
                        $state.go('page.login');
                    });
                }else {
                    layer.alert(dispose.res.data.msg, {closeBtn: 0, icon: 5}, function() {
                        layer.closeAll(); 
                    })
                }
            }else {
                layer.close(dispose._index); 
            }
          }else {
            layer.close(dispose._index); 
          }
          if(dispose.route) $state.go(dispose.route);
          return dispose.res.data;
      }
    
   }
   
});


// 登录

App.controller('LoginController', ["$rootScope", "$scope", 'ConnectApi', '$state', 'ParamTransmit', function($rootScope, $scope, ConnectApi, $state, ParamTransmit) {

    ParamTransmit.clearParam();
    $scope.param = localStorage.remember ? JSON.parse(localStorage.remember) : {};
    $scope.go = function() {
      var index = layer.load(2);
      ConnectApi.start('post', 'admin/login/login', $scope.param).then(function(response) {
          var data = ConnectApi.data({ res: response, _index: index });
          $scope.data = data.data;
          if(data.code == 200) {
              if($scope.param.isChecked) {
                  var remember = {
                      user_name: $scope.param.user_name,
                      password: $scope.param.password,
                      isChecked: $scope.param.isChecked
                  }
                  localStorage.setItem('remember', JSON.stringify(remember));
              }else {
                  localStorage.removeItem('remember');
              }
              var token = $scope.data.token;
              var sysuser_id = $scope.data.sysuser_id;
              var tname = $scope.data.tname;
              ParamTransmit.setParam({ token, sysuser_id, tname }, ['token', 'sysuser_id', 'tname']);
              $state.go('app.home');
          }
      }, function(x) { 
          layer.alert("服务器异常，请稍后再试！", {closeBtn: 0, icon: 5}, function() {
              layer.closeAll();
          });
      });
    }
  
}]);


// 首页
App.controller('HomeController', ["$rootScope", "$scope", 'ConnectApi', '$state', 'ParamTransmit', '$timeout', function($rootScope, $scope, ConnectApi, $state, ParamTransmit, $timeout) {

    $scope.clock = {};
    var clockFunction = function() {
        $scope.clock.now = (new Date()).valueOf();
        $timeout(function() {
            clockFunction();
        }, 1000)
    }
    clockFunction();
    
    $rootScope.user.name = JSON.parse(sessionStorage.paramSession).tname;
    // $rootScope.user.company = JSON.parse(sessionStorage.paramSession).school_name;

    $scope.param = ParamTransmit.getParam();
    $scope.getData = function() {
        var index = layer.load(2);
        $scope.param.date = $scope.month;
        ConnectApi.start('post', 'admin/index/index', $scope.param).then(function(response) {
            var data = ConnectApi.data({ res: response, _index: index });
            if(data.code == 200) {
                $scope.data = data.data;
            }
        }, function(x) { 
            layer.alert("服务器异常，请稍后再试！", {closeBtn: 0, icon: 5}, function() {
                layer.closeAll();
            });
        });
    }
    $scope.getData();

}]);


/* 用户管理 */
App.controller('UserMgmtController', ["$scope", 'ConnectApi', '$state', 'ParamTransmit', function($scope, ConnectApi, $state, ParamTransmit) {

    $scope.param = ParamTransmit.getParam();
    
    $scope.current_page = 1;
    var getData = function() {
        var index = layer.load(2);
        $scope.param.page = $scope.current_page;
        ConnectApi.start('post', 'admin/member/get_member_list', $scope.param).then(function(response) {
            var data = ConnectApi.data({ res: response, _index: index });
            $scope.data = data.data;
            $scope.totalpage = data.data.total_page;
        }, function(x) { 
            layer.alert("服务器异常，请稍后再试！", {closeBtn: 0, icon: 5}, function() {
                layer.closeAll();
            });
        });
    }
    getData();

    $scope.search = function() {

    }

    $scope.headerPath = 'app/img/header/';

    $scope.bgoSelectList = [
        { val: 0, valName: '正常', color: 'green' },
        { val: 1, valName: '锁定', color: 'red' },
    ]

    $scope.setIsLocked = function(id) {
        $scope.param = ParamTransmit.getParam();
        $scope.param.user_id = id,
        $scope.param.is_locked = $scope.param.val;
        ConnectApi.start('post', 'admin/member/set_member', $scope.param).then(function(response) {
            var data = ConnectApi.data({ res: response });
            if(data.code == 200) {
                getData();
            }
        }, function(x) { 
            layer.alert("服务器异常，请稍后再试！", {closeBtn: 0, icon: 5}, function() {
                layer.closeAll();
            });
        });
    }

    $scope.goPage = function(id) {
        $state.go('app.userInfo');
        ParamTransmit.setParam({ user_id: id }, ['token', 'sysuser_id', 'tname'])
    }

    $scope.edit = function(id) {
        $state.go('app.editUser');
        ParamTransmit.setParam({ user_id: id }, ['token', 'sysuser_id', 'tname'])
    }

}]);


// 用户详情
App.controller('UserInfoController', ["$scope", 'ConnectApi', '$state', 'ParamTransmit', function($scope, ConnectApi, $state, ParamTransmit) {

    $scope.is_lockedCFG = [
        { val: 0, name: '正常', color: 'green' },
        { val: 1, name: '锁定', color: 'red' },
    ]

    $scope.headerPath = 'app/img/header/';
    $scope.param = ParamTransmit.getParam();
    var getData = function() {
        ConnectApi.start('post', 'admin/member/get_member_one', $scope.param).then(function(response) {
            var data = ConnectApi.data({ res: response });
            $scope.data = data.data;
        }, function(x) { 
            layer.alert("服务器异常，请稍后再试！", {closeBtn: 0, icon: 5}, function() {
                layer.closeAll();
            });
        });
    }
    getData();
  
    $scope.goPage = function(id) {
        ParamTransmit.setParam({ user_id: id }, ['token', 'sysuser_id', 'tname'])
    }

}]);


// 修改用户
App.controller('EditUserController', ["$scope", 'ConnectApi', '$state', 'ParamTransmit', function($scope, ConnectApi, $state, ParamTransmit) {

    $scope.param = ParamTransmit.getParam();
    var getData = function() {
        ConnectApi.start('post', 'admin/member/get_member_one', $scope.param).then(function(response) {
            var data = ConnectApi.data({ res: response });
            $scope.data = data.data;
        }, function(x) { 
            layer.alert("服务器异常，请稍后再试！", {closeBtn: 0, icon: 5}, function() {
                layer.closeAll();
            });
        });
    }
    getData();
  
    $scope.save = function() {
        ConnectApi.start('post', 'admin/member/set_member', $scope.param).then(function(response) {
            var data = ConnectApi.data({ res: response });
            if(data.code == 200) {
                layer.msg("修改成功！");
            }
        }, function(x) { 
            layer.alert("服务器异常，请稍后再试！", {closeBtn: 0, icon: 5}, function() {
                layer.closeAll();
            });
        });
    }

}]);



// 基础配置
App.controller('BaseConfigController', ["$scope", 'ConnectApi', '$state', 'ParamTransmit', function($scope, ConnectApi, $state, ParamTransmit) {

    $scope.param = ParamTransmit.getParam();
    var getData = function() {
        var index = layer.load(2);
        ConnectApi.start('post', 'admin/settings/get_pubconfig', $scope.param).then(function(response) {
            var data = ConnectApi.data({ res: response, _index: index });
            $scope.data = data.data;
        }, function(x) { 
            layer.alert("服务器异常，请稍后再试！", {closeBtn: 0, icon: 5}, function() {
                layer.closeAll();
            });
        });
    }
    getData();

    $scope.set = function() {
        $scope.param = ParamTransmit.getParam();
        ConnectApi.start('post', 'admin/settings/set_pubconfig', $scope.param).then(function(response) {
            var data = ConnectApi.data({ res: response });
            if(data.code == 200) {
                layer.msg("修改成功！");
            }
        }, function(x) { 
            layer.alert("服务器异常，请稍后再试！", {closeBtn: 0, icon: 5}, function() {
                layer.closeAll();
            });
        });
    }

}]);



// 小狗升级配置
App.controller('Other1ConfigController', ["$scope", 'ConnectApi', '$state', 'ParamTransmit', function($scope, ConnectApi, $state, ParamTransmit) {

    $scope.param = ParamTransmit.getParam();
    var getData = function() {
        var index = layer.load(2);
        ConnectApi.start('post', 'admin/settings/get_doglevel', $scope.param).then(function(response) {
            var data = ConnectApi.data({ res: response, _index: index });
            $scope.data = data.data;
        }, function(x) { 
            layer.alert("服务器异常，请稍后再试！", {closeBtn: 0, icon: 5}, function() {
                layer.closeAll();
            });
        });
    }
    getData();

    $scope.save = function() {
        $scope.param = ParamTransmit.getParam();
        $scope.param.dogLevel = $scope.data;
        ConnectApi.start('post', 'admin/settings/set_doglevel', $scope.param).then(function(response) {
            var data = ConnectApi.data({ res: response });
            if(data.code == 200) {
                layer.msg("修改成功！");
            }
        }, function(x) { 
            layer.alert("服务器异常，请稍后再试！", {closeBtn: 0, icon: 5}, function() {
                layer.closeAll();
            });
        });
    }

}]);


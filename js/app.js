(function () {
	// 返回后台的context path
	window.getContext = function(){
		return {
			web : 'http://127.0.0.1:8080/front',
			portal: 'http://127.0.0.1:8084',
			bpmRunTime: 'http://127.0.0.1:8086',
			bpmModel: 'http://127.0.0.1:8087',
			uc:'http://127.0.0.1:8088',
			form:'http://127.0.0.1:8082'
		};
	}
	
    angular.module('eip', [
        'ui.router',                    // Routing
        'oc.lazyLoad',                  // ocLazyLoad
        'ui.bootstrap',                 // Ui Bootstrap
        'pascalprecht.translate',       // Angular Translate
        'ngIdle',                       // Idle timer
        'ngSanitize',                   // ngSanitize
        'toaster',						// toaster
        'ngStorage',					// localStorage
        'ui.router.tabs'				// Routing tabs
    ])
})();
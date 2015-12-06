
/* global angular:false */

(function() {
  'use strict';

  angular
    .module('gc2Website')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $rootScope, $state) {


    $rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
      $log.error('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
      $log.error(unfoundState, fromState, fromParams);
    });
    
    var destroy_callback = $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
      // We can catch the error thrown when the $requireAuth promise is rejected
      // and redirect the user back to the home page
      if (error === "AUTH_REQUIRED") {
        $log.info("authentication required", toState, toParams);
        $state.go("login");
      } else {
        $log.error(event, error);
      }
    });    
  
    $rootScope.$on('$destroy',  destroy_callback);

    $log.debug('runBlock end');
  }

})();

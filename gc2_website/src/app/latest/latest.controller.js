
/* globals angular */
/* globals Highcharts */

(function() {
  'use strict';

  angular
    .module('gc2Website')
    .controller('LatestController', LatestController);

  /** @ngInject */
  function LatestController($log, $scope, $rootScope, $firebaseObject, 
                           currentAuth, firebase_auth, data_manager) {
    var vm = this;

    
    vm.init = function() {
        // bind to the latest data object for this user
        vm.uid = currentAuth.uid;
        
        var user_ref = firebase_auth.get_user_ref(vm.uid);
        vm.user_obj = $firebaseObject(user_ref);
        
        var latest_data_ref = data_manager.latest_data_ref(vm.uid);
        vm.latest_data_obj = $firebaseObject(latest_data_ref);
        
        vm.user_obj.$loaded().then(function(){
          vm.latest_data_obj.$loaded().then(function(){
            vm.load_data();
          })
        })
    };
    
    vm.load_data = function() {
      $log.info("LatestController.load_data");
      var start_time = new Date(vm.latest_data_obj.end_timestamp - 300*1000);
      var end_time = new Date(vm.latest_data_obj.end_timestamp);
      data_manager.get_latest_emg_data(vm.user_obj.user_name, 
                                       start_time,
                                       end_time).
      then(function(data) {
        // plot data on chart
        vm.chart_emg_data(data);  
      })
    };
    
    vm.chart_emg_data = function(data) {
        $('#container-emg-chart').highcharts({
            chart: {
                type: "area"
            },
            title: {
                text: 'Latest EMG data'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'EMG Value'
                }
            },
            legend: {
                enabled: false
            },
            series: [{
                type: 'area',
                name: 'EMG',
                data: data
            }]
        });      
    };


    vm.init(); 
    
  }
})();
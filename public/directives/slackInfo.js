;
(function() {
  var slackInfoController = function(slackServer, $scope) {
    var slackInfoVm = this;

    slackInfoVm.response = '';
    slackInfoVm.fromDate = new Date();
    slackInfoVm.toDate = new Date();
    slackInfoVm.deleteCount = 0;
    slackInfoVm.token;
    slackInfoVm.daysList = ['now', 1, 2, 7, 14, 30, 60, 90];
    slackInfoVm.days = slackInfoVm.daysList[slackInfoVm.daysList.length - 1];

    Array.prototype.delayedForEach = function(callback, timeout, thisArg){
      var i = 0,
        l = this.length,
        self = this,
        caller = function(){
          callback.call(thisArg || self, self[i], i, self);
          (++i < l) && setTimeout(caller, timeout);
        };
      caller();
    };

    $scope.$watch('slackInfoVm.token', function() {
      slackServer.getUsers(slackInfoVm.token)
        .then(function(data) {
          var users = data.data.members;
          if(users && users.length > 0){
            // var allUsers = [{id: "all", name: "All"}];
            var allUsers = [];
            users = allUsers.concat(data.data.members);
          }
          slackInfoVm.usersList = users;
        });
    });

    slackInfoVm.deleteFiles = function() {
      if (!slackInfoVm.token || !slackInfoVm.user || !slackInfoVm.fromDate || !slackInfoVm.toDate) {
        alert('All options must be selected');
        return;
      }
      slackServer.getFiles(slackInfoVm.token, slackInfoVm.user, slackInfoVm.fromDate, slackInfoVm.toDate)
        .then(function(data) {
          var response = data.data;
          if (!response.ok) return;
          if (response.files.length === 0) alert('No file left');
          response.files.delayedForEach(function(file, index, array) {
            var deleteMsg = 'Deleting: ' + file.title;
            var newLine = '\n\r';
            slackInfoVm.response += deleteMsg;
            slackInfoVm.response += newLine;
            slackServer.deleteFiles(slackInfoVm.token, file.id).then(function(data) {
              slackInfoVm.deleteCount++;
            });
          }, 750);
        });
    }

  }

  var slackInfo = function() {
    return {
      link: function(scope, elem) {
        elem[0].scrollTop = elem[0].scrollHeight;
      },
      controller: slackInfoController,
      controllerAs: 'slackInfoVm',
      bindToController: true
    }
  };

  angular
    .module('slackApp')
    .directive('slackInfo', slackInfo)
  slackInfoController.$inject = ['slackServer', '$scope'];

})();

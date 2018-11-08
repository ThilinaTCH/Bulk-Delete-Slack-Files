;
(function() {
  var slackServer = function($http) {
    var url = 'https://slack.com/api/';

    var getUsers = function(token) {
      var _url = url + 'users.list';
      var postData = {
        token: token
      };
      return $http({
        url: _url,
        method: 'GET',
        params: postData
      })

    }

    var getFiles = function(token, user, fromDate, toDate) {
      var _url = url + 'files.list';
      var d_from = new Date(fromDate);
      var d_to = new Date(toDate);
      var postData = {
        ts_from: Math.round(d_from / 1000),
        ts_to: Math.round(d_to / 1000),
        user: user == "all" ? "" : user,
        count: 1000,
        token: token
      };
      return $http({
        url: _url,
        method: 'GET',
        params: postData
      });
    };

    var deleteFiles = function(token, fileId) {
      var _url = url + 'files.delete';
      var postData = {
        token: token,
        file: fileId
      };

      return $http({
        url: _url,
        method: 'GET',
        params: postData
      });
    };

    return {
      getUsers: getUsers,
      getFiles: getFiles,
      deleteFiles: deleteFiles
    }
  }
  angular
    .module('slackApp')
    .factory('slackServer', slackServer)

  slackServer.$inject = ['$http'];
})();

// request - Express request
// offsetF - name of offset field from response query. Example: 'offset'
// countF - name of count field from response query
// qF - name of q field from response query
// searchArray - array of search columns
// sortF - name of sort field from response query. Example: 'filter'. Field data: 'name' or '-name' etc.

module.exports = function(offsetF, countF, qF, searchArray, sortF) {
  return {
    getConfig: function(request) {
      var config = {};

      var q = request.query[qF];

      if (q && searchArray && searchArray.length > 0) {
        config.$or = [];
        for (var i = 0; i < searchArray.length; i++) {
          var obj = {};
          obj[searchArray[i]] = new RegExp('.*' + q + '.*', 'i');
          config.$or.push(obj);
        }
      }

      return config;
    },
    getQueryConfig: function(request) {
      var config = {};

      var offset = request.query[offsetF];
      var count = request.query[countF];
      var sort = request.query[sortF];

      if (count) config.limit = count;
      if (offset) config.skip = offset * count;
      if (sort) {
        config.sort = {};
        if (sort.charAt(0) != '-') {
          config.sort[sort] = 1;
        } else {
          config.sort[sort.substr(1, sort.length)] = -1;
        }
      }

      return config;
    }
  }
};
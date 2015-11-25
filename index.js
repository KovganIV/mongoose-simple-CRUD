var QueryHelper = require('./queryHelper');

var errorFunction;

function Controller(Model) {
  var queryHelper;
  var createMandatoryFields;
  var createFields;
  var updateMandatoryFields;
  var updateFields;

  // Settings

  function addQueryHelper(queryHelperI) {
    queryHelper = queryHelperI;
    return this;
  }

  function addCreate(mandatoryFieldsI, fieldsI) {
    createMandatoryFields = mandatoryFieldsI;
    createFields = fieldsI;
    return this;
  }

  function addUpdate(mandatoryFieldsI, fieldsI) {
    updateMandatoryFields = mandatoryFieldsI;
    updateFields = fieldsI;
    return this;
  }

  // CRUD methods

  function getItem(request, response) {
    var id = request.params.id;
    // Need 'id' field
    if (!id) return response.status(400).json({error: 'Wrong id'});

    Model
      .findOne({_id: id})
      .exec(function(error, doc) {
        if (!error && doc) {
          response.json({response: {item: doc}});
        } else {
          if (errorFunction) errorFunction(response, error, function() {error500(response, error)});
          else error500(response, error);
        }
      });
  }

  function getItems(request, response) {
    var config = queryHelper.getConfig(request);

    Model
      .find(config, {}, queryHelper.getQueryConfig(request))
      .exec(function(error, docs) {
        if (!error) {
          Model
            .count(config, function(err, c) {
              response.json({response: {items: docs, count: c}});
            });
        } else {
          if (errorFunction) errorFunction(response, error, function() {error500(response, error)});
          else error500(response, error);
        }
      });
  }

  function createItem(request, response) {
    var config = {};

    if (createMandatoryFields) {
      for (var i = 0; i < createMandatoryFields.length; i++) {
        if (request.body[createMandatoryFields[i]]) {
          config[createMandatoryFields[i]] = request.body[createMandatoryFields[i]];
        } else return response.status(400).json({error: 'Wrong parameters'});
      }
    }

    if (createFields) {
      for (var i = 0; i < createFields.length; i++) {
        if (request.body[createFields[i]]) {
          config[createFields[i]] = request.body[createFields[i]];
        }
      }
    }

    var model = new Model(config);
    model.save(function(error, doc) {
      if (!error) response.json({response: {item: {id: doc._id}}});
      else {
        if (errorFunction) errorFunction(response, error, function() {error500(response, error)});
        else error500(response, error);
      }
    });
    model.remove();
  }

  function updateItem(request, response) {
    var id = request.params.id;
    // Need 'id' field
    if (!id) return response.status(400).json({error: 'Wrong id'});

    var config = {};

    if (updateMandatoryFields) {
      for (var i = 0; i < updateMandatoryFields.length; i++) {
        if (request.body[updateMandatoryFields[i]]) {
          config[updateMandatoryFields[i]] = request.body[updateMandatoryFields[i]];
        } else return response.status(400).json({error: 'Wrong parameters'});
      }
    }

    if (updateFields) {
      for (var i = 0; i < updateFields.length; i++) {
        if (request.body[updateFields[i]]) {
          config[updateFields[i]] = request.body[updateFields[i]];
        }
      }
    }

    Model
      .update({_id: id}, config)
      .exec(function(error) {
        if (!error) {
          response.json({response: {item: {id: id}}});
        } else {
          if (errorFunction) errorFunction(response, error, function() {error500(response, error)});
          else error500(response, error);
        }
      });
  }

  function deleteItem(request, response) {
    var id = request.params.id;
    // Need 'id' field
    if (!id) return response.status(400).json({error: 'Wrong id'});

    Model
      .findOne({_id: id})
      .exec(function(error, doc) {
        if (!error && doc) {
          Model
            .remove({_id: id})
            .exec(function(error) {
              if (!error) {
                response.sendStatus(200);
              } else {
                if (errorFunction) errorFunction(response, error, function() {error500(response, error)});
                else error500(response, error);
              }
            });
        } else {
          console.log(errorFunction);
          if (errorFunction) errorFunction(response, error, function() {error500(response, error)});
          else error500(response, error);
        }
      });
  }

  function error500(response, error) {
    if (error) {
      console.log(error.stack);
      response.status(500).json({error: error.toString()});
    } else response.sendStatus(500);
  }

  return {
    addQueryHelper: addQueryHelper,
    addCreate: addCreate,
    addUpdate: addUpdate,
    getItem: getItem,
    getItems: getItems,
    createItem: createItem,
    updateItem: updateItem,
    deleteItem: deleteItem
  }
}

module.exports = {
  setErrorFunction: function(obj) {errorFunction = obj;},
  QueryHelper: QueryHelper,
  Controller: Controller
};
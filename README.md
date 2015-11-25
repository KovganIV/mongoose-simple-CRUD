# mongoose-simple-CRUD

### Example of CRUD API config

    var msCRUD = require('mongoose-simple-crud');
    
    var logController = new msCRUD.Controller(modelsStore.LogModel);
    
    logController
      .addCreate(['severity', 'source', 'message'])
      .addUpdate([], ['severity', 'source', 'message'])
      .addQueryHelper(new msCRUD.QueryHelper('offset',
            'count',
            'q',
            ['severity', 'source', 'message'],
            'filter'
        ));


    app.get('/logs/:id', logController.getItem);
    app.get('/logs', logController.getItems);
    app.post('/logs', logController.createItem);
    app.put('/logs/:id', logController.updateItem);
    app.delete('/logs/:id', logController.deleteItem);

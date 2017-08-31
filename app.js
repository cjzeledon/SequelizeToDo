const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const Sequelize = require('sequelize');

const app = express();

app.engine('mustache', mustache());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("views"));

/************** TODOS SCHEMA **************/

const db = new Sequelize('thingstodo', 'claudiazeledon', '', {
  dialect: 'postgres',
});

const List = db.define('list', {
  todos: Sequelize.STRING,
  completed: Sequelize.BOOLEAN,
});

List.sync().then(function(){
  console.log('Sync-king in Todos!');

// List.create(
//   { todos: 'buy groceries', completed: false }
// );
// List.create(
//   { todos: 'put sophia to sleep', completed: false },
// );
});

/********** END OF TODOS SCHEMA ***********/

//show all todos
app.get ('/', function(req, res){
  List.findAll().then(function(bing){
    res.render('list', {
      mytodos: bing,
    });
  });
});

//create a new todo to the list and will be render as incomplete
app.post('/mylist', function(req, res){
  List.create({
    todos: req.body.things,
    completed: true
  }).then(function(){
    res.redirect('/');
  });
});

//update a single todo where it becomes incomplete
app.post('/new/:list_id', function(req, res){
  const id = parseInt(req.params.list_id);

  List.update({
      completed: false
  }, {
      where: {
          id: id,
      },
  }).then(function() {
      res.redirect('/');
  });
});

//update a single todo where it becomes completed
app.post('/done/:list_id', function(req, res){
  const id = parseInt(req.params.list_id);

  List.update({
      completed: true
  }, {
      where: {
          id: id,
      },
  }).then(function() {
      res.redirect('/');
  });
});

//update a todo with new information
app.post('/update/:list_id', function(req, res){
  const id = parseInt(req.params.list_id);

  List.findOne({
    where: {
      id: id,
    },
  }).then(List => {List.updateAttributes({
    todos: req.body.updateThis});
  }).then(function(){
    res.redirect('/');
  });
});

//delete a single todo
app.post('/delete/:list_id', function(req, res){
  const id = parseInt(req.params.list_id);

  //This also works
  //   List.destroy({
  //   where: { id: id }
  //   }).then(deletedList => {
  //   console.log(`Has the list been deleted? 1 means yes, 0 means no: ${deletedList}`);
  // });

  List.destroy({
    where: { id: id,},
  })
    .then(function() {
      res.redirect('/');
    });


});

//delete all completed todos
app.post('/deleteall', function(req, res){

List.destroy({
  where: {
    completed: false,
  },
}).then(function() {
    res.redirect('/');
  });

  // List.destroy({
  //   where: { completed: true },
  //   truncate: true
  // }).then(affectedRows => {
  //   return Find.findAll();
  // }).then(function(){
  //   res.redirect('/');
  // });

});




app.listen(3000);

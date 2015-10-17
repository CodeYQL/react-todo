// We start with the dispatcher, which is a basic "event emitter"
function Dispatcher() {
  this._stores = []; // the dispatcher keeps track of the stores that have registered with it
}

Dispatcher.prototype.addStore = function (store) {
  this._stores.push(store);
};

// Will loop through the list of stores and emit an action to all of them
Dispatcher.prototype.emit = function (action) {
  console.log('Emitted action: ' + action.type);
  for (var i = 0; i < this._stores.length; i++) {
    var store = this._stores[i];

    // call the store's "_handleDispatch" method, pass the action to it
    store._handleDispatch.bind(store)(action);
  }
};


// Stores keep track of the "model"
function TasksStore() {
  // stores also have "listeners" that are callbacks, which are called when the store state changes
  this._listeners = [];

  // this is the data we want to keep track of, and is our "application's state"
  this._next_id = 3;
  this._tasks = [{
    id: 0,
    title: 'First task'
  }, {
    id: 1,
    title: 'Second task'
  }, {
    id: 2,
    title: 'Third task'
  }];
}

// This will get called whenever the dispatcher emits an action
TasksStore.prototype._handleDispatch = function (action) {
  switch (action.type) {
    // handle the "add task" action
    case 'ADD_TASK':
      this._addTask(action.data);
      break;

    case 'REMOVE_TASK':
      this._removeTaskWithId(action.data);
      break;
  }
};

// helper method to find the index of a task with the given ID
TasksStore.prototype._findIndexOfTaskWithId = function (id) {
  var task = this._tasks.filter(function (task) {
    return task.id === id;
  })[0];

  return this._tasks.indexOf(task); // return the index in the array
}

// this will only ever be called by "_handleDispatch", component can't call this directly
// because that would violate the principle of one-direction data flow!
TasksStore.prototype._removeTaskWithId = function (id) {
  var index = this._findIndexOfTaskWithId(id);

  if (index > -1) {
    this._tasks.splice(index, 1); // remove task from array
  }

  this.emitChange();
}

// similarly for this one
TasksStore.prototype._addTask = function (title) {
  this._tasks.push({
    id: this._next_id,
    title: title
  });

  this._next_id += 1;

  this.emitChange(); // emit a change when the store's state has been changed
}

// Will call all callbacks that have been registered with the store:
// this is just like the event emitter example in the dispatcher
TasksStore.prototype.emitChange = function () {
  for (var i = 0; i < this._listeners.length; i++) {
    var callback = this._listeners[i];
    callback();
  }
};

// Register a component callback with the store
TasksStore.prototype.addListener = function (callback) {
  this._listeners.push(callback);
};

// Component only has access to this method of the store to get the current task list
TasksStore.prototype.getTasks = function () {
  return this._tasks;
};


// Component: this is our "view"
function TasksComponent(tasksStore) {
  this.dispatcher = dispatcher;
  this.store = tasksStore;

  // register a callback with the store
  // the render function will be called every time the store emits a change
  this.store.addListener(this.render.bind(this));

  // bind the "add task" button to the "handleAddTaskClicked" action creator
  $('#add-task').on('click', this.handleAddTaskClicked.bind(this));
}

// These can be abstrated out into an "actionCreator" which dispatches actions
TasksComponent.prototype.handleAddTaskClicked = function () {
  var text_title = $('#new-task-title').val(); // get the value of the new task title input field
  this.dispatcher.emit({
    type: 'ADD_TASK',
    data: text_title
  });
};

TasksComponent.prototype.handleDeleteTaskClicked = function (el) {
  // emit the remove task event
  var task_id = parseInt(el.target.id.replace('remove-', ''));
  this.dispatcher.emit({
    type: 'REMOVE_TASK',
    data: task_id
  });
};

TasksComponent.prototype.render = function () {

  var tasks = this.store.getTasks(); // get the tasks from the store

  var task_list = $('#task-list'); // get our "view"
  task_list.empty(); // clear out the element and re-render the list

  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    var task_button = ' <button id="remove-' + task.id + '">x</button>';

    task_list.append('<li id="' + task.id + '">' + task.title + task_button + '</li>');
  }

  // bind a listener to the "remove task" buttons
  $("button[id^='remove-']").on('click', this.handleDeleteTaskClicked.bind(this));

}

// create an instance of the store
var tasksStore = new TasksStore();

// Register the store with the dispatcher
var dispatcher = new Dispatcher();
dispatcher.addStore(tasksStore);

// Create the component and pass in a store
var component = new TasksComponent(tasksStore);
console.log(component);

// We're off to the races!
$(document).ready(component.render.bind(component));

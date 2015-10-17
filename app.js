// Model
function TasksModel() {
  this.next_id = 3;
  this.tasks = [{
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


TasksModel.prototype.findIndexOfTaskWithId = function (id) {
  var task = tasks.filter(function (task) {
    return task.id === id;
  })[0];

  return tasks.indexOf(task);
}

TasksModel.prototype.removeTaskWithId = function (id) {
  var index = findIndexOfTaskWithId(id);

  if (index > -1) {
    tasks.splice(index, 1); // remove
  }

  reRenderTaskList();
}

TasksModel.prototype.addTask = function (title) {
  tasks.push({
    id: next_id,
    title: title
  });

  next_id += 1;

  reRenderTaskList();
}


// Controller
function TasksController(model) {
  this.model = model;
}

TasksController.prototype.getTasks = function () {
  return this.model.tasks;
}

TasksController.prototype.handleAddTaskClicked = function () {
  var text_title = $('#new-task-title').val();
  this.model.addTask(text_title);
}

TasksController.prototype.handleDeleteTaskClicked = function (el) {
  var task_id = parseInt(el.target.id.replace('remove-', ''));
  this.model.removeTaskWithId(task_id);
}

// View
function TasksView(controller) {
  this.controller = controller;

  $('#add-task').on('click', controller.handleAddTaskClicked);
}


TasksView.prototype.render = function () {
  var tasks = this.controller.getTasks();

  var task_list = $('#task-list');
  task_list.empty(); // clear out the element and re-render the list

  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    var task_button = ' <button id="remove-' + task.id + '">x</button>';

    task_list.append('<li id="' + task.id + '">' + task.title + task_button + '</li>');
  }

  $("button[id^='remove-']").on('click', this.controller.handleDeleteTaskClicked);

}

var model = new TasksModel();
var controller = new TasksController(model);
var view = new TasksView(controller);

$(document).ready(view.render);

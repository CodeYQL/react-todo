

var tasks = [{
  id: 0,
  title: 'First task'
}, {
  id: 1,
  title: 'Second task'
}, {
  id: 2,
  title: 'Third task'
}];


function reRenderTaskList() {

  var task_list = $('#task-list');
  task_list.empty(); // clear out the element and re-render the list

  for (var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    var task_button = ' <button id="remove-' + task.id + '">x</button>';

    task_list.append('<li id="' + task.id + '">' + task.title + task_button + '</li>');
  }

}

function addTask(title) {
  var next_id = tasks.length;

  tasks.push({
    id: next_id,
    title: title
  });

  reRenderTaskList();
}

function handleAddTaskClicked() {
  var text_title = $('#new-task-title').val();
  addTask(text_title);
}

$('#add-task').on('click', handleAddTaskClicked);

$(document).ready(reRenderTaskList);

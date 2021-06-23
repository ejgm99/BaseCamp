'use strict';

const db = require('../dbInterface/infoManager')

function clearView() {
 const mainArea = document.getElementById('main-area');
 let firstChild = mainArea.firstChild;
 while (firstChild) {
   mainArea.removeChild(firstChild);
   firstChild = mainArea.firstChild;
 }
}

function displayProject(project, project_id, main_area_id, completed_tasks, total_tasks){

  const mainArea = document.getElementById(main_area_id);
  const template = document.querySelector('#card-template');

  let clone = document.importNode(template.content, true);
  let task_adder = document.querySelector('#task-adder-template')
  let title_button = clone.querySelector('#title');
  let collapsable_content = clone.querySelector('#ProjectContent')
  let project_container = clone.querySelector('#ProjectDiv');
  let addSubtaskButton  = clone.querySelector('#add-subtask');
  let addSubtaskField = clone.querySelector("#newSubtask");
  let progressBar = clone.querySelector('#ProgressBar');

  let progressBarID = project+'ProgressBar'
  let subtaskFieldID = "newSubtask"+project;
  let  subtaskButtonID = "addSubtask"+project;
  let  projectContainerID = project+"Div"
  let projectContentID = project+"Content"
  let subtaskAreaID = 'subtaskArea'+project;
  progressBar.id = progressBarID;
  addSubtaskButton.id = subtaskButtonID;
  addSubtaskField.id = subtaskFieldID;

  project_container.id = projectContainerID
  // these next two clusters of lines add the dependency between two divs so that they collapse one another
  collapsable_content.id = projectContentID
  collapsable_content.querySelector('#subtaskArea').id = subtaskAreaID;
  let subtaskArea = clone.getElementById(subtaskAreaID)
  title_button.innerText = project;
  title_button.id = project;


  defineCollapseRelation(title_button,collapsable_content,projectContainerID,projectContentID)

  addSubtaskButton.addEventListener('click',() =>{
    let subtask_title = addSubtaskField.value;
    let subtask_node = document.createTextNode(subtask_title);
    // db.addSubtask(subtask_title,project_id)
    db.pool.query(`INSERT INTO tasks(title,parent_id) VALUES ('${subtask_title}','${project_id}')`)
    .then( r =>{
      db.pool.query(`SELECT id FROM tasks WHERE title = '${subtask_title}'`)
      .then(res => {
        displayProject(subtask_title,res.rows[0].id, subtaskAreaID)
      })
    })

  });


  clone.firstElementChild.id = project+"Container";
  clone.querySelector('#delete').addEventListener('click', () => {
      db.deleteTask(project);
      document.querySelector('#'+project+"Container").remove()
  });


  // Now that the project is setup, time to query the database for the subtasks and display them
  //as well as add an event listener to add subtasks
  // buildSubtasks(project, subtaskAreaID);
  db.displayTasks(displayProject, project_id,subtaskAreaID);
  mainArea.appendChild(clone);
}

// function displaySubtask(collapsable_content,subtask_title){
//   collapsable_content.getElementById("subtaskArea").appendChild(subtask_title)
// }

//this is a helper function that is meant for use when you have two entities that are linked
//and since their names are not constrained need to be connected. If I write enough of these I may
//need to add them to their own file
function defineCollapseRelation(title_button,collapsable_content,title_name,content_name){
  collapsable_content.setAttribute('aria-labelledby',title_name)
  collapsable_content.setAttribute('aria-controls',title_name)

  title_button.setAttribute('aria-controls', title_name)
  title_button.setAttribute("data-target","#"+content_name)
}

function bindDocument (window) {
 if (!document) {
 document = window.document;
 }
}

async function buildSubtasks(parent_task_id,taskAreaID){
  let subtasks = await pool.query(`SELECT * FROM tasks WHERE parent_id = '${parent_task_id}'`)
  subtasks.rows.forEach((subtask) => {
    console.log(subtask.title)
    displayProject(subtask.title,subtask.id, taskAreaID)
  });
}

module.exports = { displayProject };

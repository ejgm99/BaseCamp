const { Pool, Client } = require('pg');
let list = document.getElementById("list");

const project_ui = require('./js/ui/displayProjects')
const db = require('./js/dbInterface/infoManager')

pool = db.pool
console.log('refreshed')

async function asyncCall(){
  const res = await pool.query('SELECT * FROM tasks where parent_id = 1')
  res.rows.forEach((entry) => {
    project_ui.displayProject(entry.title,entry.id,'list')
  });
}

document.getElementById("addTask").addEventListener('click', () => {
  let newTask = document.getElementById("newTask");
  db.addSubtask(newTask.value,1);
  project_ui.displayProject(newTask.value,'-1','list');
});



db.displayTasks(project_ui.displayProject,1,'list');

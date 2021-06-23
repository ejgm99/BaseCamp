'use strict';

const pool = new Pool({
// userInterface.bindDocument(window);
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'p88t90k95e99',
  port: 5432,
});


async function deleteProject(project_title){
    await pool.query(`DELETE FROM projects WHERE title='${project_title}';`)
}

async function deleteTask(title){
    await pool.query(`DELETE FROM tasks WHERE title='${title}';`)
}

async function addProject(title){
  const res = await pool.query(`INSERT INTO tasks(title) VALUES ('${title}', 1)`);
}

async function addSubtask(subtask_title, parent_id){
  console.log(`INSERT INTO (title,parent_task,completed) VALUES ('${subtask_title}','${parent_id}')`)
  const res = await pool.query(`INSERT INTO tasks(title,parent_id) VALUES ('${subtask_title}','${parent_id}')`)
}

async function addTask(taskTitle, parentID){
  query = `WITH temp(title, parent_id) AS (
          SELECT '${taskTitle}' , parent_id from tasks where title = '${parentID}'
          )
          INSERT INTO tasks(title, parent_id) SELECT * FROM temp;`
  const res = await pool.query(query)
}

async function getNumberOfSubtasks(task_title){
  let query = ` with recursive task_tree as (
      select task_id,
             title,
             parent_task
      from subtasks
      where parent_task = '${task_title}'  -- this defines the start of the recursion
      union all
      select child.task_id,
             child.title,
             child.parent_task
      from subtasks as child
        join task_tree as parent on parent.title = child.parent_task -- the self join to the CTE builds up the recursion
   )
   select COUNT(title)
   from task_tree;`;
   let res = await pool.query(query);
   let c = 0;
   res.rows.forEach((coun) =>{
     console.log(coun.count);
     c= coun.count;
   });
   return c;
}

function displayTasks(dp,parentID,childArea){
  pool
    .query(`SELECT * FROM tasks WHERE parent_id = ${parentID}`)
    .then(res => {
      res.rows.forEach(
        (entry) => {
          pool.query(db.queryNumberOfChildTasks(entry.id,false))
              .then( res1 => {
                return res1.rows[0].count
              }
              ).then(result =>{
                    pool.query(db.queryNumberOfChildTasks(entry.id,true))
                    .then(res2 => {
                    dp(entry.title, entry.id, childArea, res2.rows[0].count, result)
                    })
                })
      })
    })
    .catch( err => console.log(err))
}

function queryNumberOfChildTasks(parent_id, only_completed){
  if (!only_completed){
    return ` with recursive task_tree(id,title,parent_id,completed) as (
        select id,
               title,
               parent_id,
               completed
        from tasks
        where parent_id in (select parent_id from tasks where parent_id = ${parent_id})  -- this defines the start of the recursion
        union all
        select child.id,
               child.title,
               child.parent_id,
               child.completed
        from tasks as child
          join task_tree as parent on parent.id = child.parent_id -- the self join to the CTE builds up the recursion
        )
    select count(*) from task_tree;`
  }
  else{
    return `with recursive task_tree(id,title,parent_id,completed) as (
       select id,
              title,
              parent_id,
              completed
       from tasks
       where parent_id in (select parent_id from tasks where parent_id = ${parent_id})  -- this defines the start of the recursion
       union all
       select child.id,
              child.title,
              child.parent_id,
              child.completed
       from tasks as child
         join task_tree as parent on parent.id = child.parent_id -- the self join to the CTE builds up the recursion
       )
    select count(*) from task_tree where completed = 't';`
  }
}



module.exports = { pool, deleteTask, addProject, addSubtask, getNumberOfSubtasks, queryNumberOfChildTasks, displayTasks};

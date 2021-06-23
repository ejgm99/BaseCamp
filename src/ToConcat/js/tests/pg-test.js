// example code snippet that quickly demonstrates connecting to local database
const { Pool, Client } = require('pg');
// let list = document.getElementById("list");

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'p88t90k95e99',
  port: 5432,
})
console.log('this is a database test');
// let projects =await pool.query('SELECT * FROM PROJECTS',(err,res) => {
//   console.log(res.rows);
//   return res.rows;})

async function asyncCall(){
    console.log('in the asynchronous')
    // pools will use environment variables
    // for connection information

    // pool.query('SELECT * FROM PROJECTS', (err, res) => {
    //   console.log(err, res)
    //   pool.end()
    // })
    // you can also use async/await
    const res = await pool.query('SELECT * FROM PROJECTS',(err,res) => {
      // console.log(res.rows);
      return res.rows;})
    // list.insertAdjacentHTML('beforeend', `<li class="list-group-item">${res.rows[0].title}</li>`)
    // await pool.end()
    // clients will also use environment variables
    // for connection information
    // const client = new Client()
    // client.connect()
    // res = await client.query('SELECT NOW()')
    // await client.end()
    return res
}
pool.query('SELECT * FROM PROJECTS',(err,res) => {
  // console.log(res.rows);
  return res.rows;})
projects = asyncCall()

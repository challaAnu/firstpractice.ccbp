const express = require('express')

const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'moviesData.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()
app.get('/movies/', async (request, response) => {
  const getallmovienames = `select movie_name from movies`
  const getall = await db.all(getallmovienames)
  response.send(getall.map(eachMovie => ({movieName: eachMovie.movie_name})))
})
app.post('/movies/', async (request, response) => {
  const moviedetails = request.body
  const {directorId, movieName, leadActor} = moviedetails
  const postquery = `insert into movies (director_id,movie_name,lead_actor) values (${directorId},'${movieName}','${leadActor}')`
  const dbquery = await db.run(postquery)

  response.send('Movie Successfullt Added')
})

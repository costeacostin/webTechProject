const express = require('express'),
bodyParser = require('body-parser'),
Sequelize = require('sequelize')

const sequelize = new Sequelize('moviesdatabase','root','',{
    dialect: 'mysql',
    define: {
        timestamps:false
    }
})

const Movie = sequelize.define('movies', {
    name : {
        type: Sequelize.STRING
    },
    year : {
        type : Sequelize.STRING
    },
    rating : {
        type : Sequelize.STRING
    }
})

Movie.sync();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/create', (req,res,next) => {
    sequelize.sync({force:true})
     .then(() => res.status(201).send('created'))
    .catch((err) => next(err))
})

app.get('/movies', (req,res,next)=> {
    Movie.findAll()
    .then((movies) => res.status(200).json(movies))
    .catch((err) => next(err))
})

app.post('/movies', (req, res) => {
  console.log(req.body.name); 
  console.log(req.body.year); 
  console.log(req.body.rating); 
  Movie.create(req.body)
    .then(() => res.status(201).send('created'))
    .catch((error) => {
      console.warn(error)
      res.status(500).send('some error...')
      
    })
})

app.get('/movies/:id', (req, res, next) => {
  Movie.findById(req.params.id) .then((movie) => {
      if (movie){
        res.status(200).json(movie)
      }
      else{
        res.status(404).send('not found')
      }
    })
    .catch((err) => next(err))
})



app.put('/movies/:id', (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (movie){
        return movie.update(req.body, {fields : ['name', 'year', 'rating']})
      }
      else{
        res.status(404).send('not found')
      }
    })
    .then(() => {
      if (!res.headersSent){
        res.status(201).send('modified')
      }
    })
    .catch((err) => next(err))
})

app.delete('/movies/:id', (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (movie){
        return movie.destroy()
      }
      else{
        res.status(404).send('not found')
      }
    })
    .then(() => {
      if (!res.headersSent){
        res.status(201).send('removed')
      }
    })
    .catch((err) => next(err))
})

app.use((err, req, res, next) => {
  console.warn(err)
  res.status(500).send('some error')
})

app.listen(8080)
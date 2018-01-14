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
    },
    genre : {
        type : Sequelize.STRING
    },
    country : {
        type : Sequelize.STRING
    }
})

const Actor = sequelize.define('actors', {
    name : {
        type: Sequelize.STRING
    },
    birthdate : {
        type : Sequelize.STRING
    },
    nationality : {
        type : Sequelize.STRING
    }
})

function createMovies()
{
  Movie.create({ name: 'Jumanji: Welcome to the Jungle', year: 2017, rating: '4.5', genre:'action', country: 'America' })
}
function createActors()
{
  Actor.create({name: 'Brad Pitt', birthdate: 1970, nationality: 'american'});
  Actor.create({name: 'Angelina Jolie', birthdate: 1980, nationality: 'american'});
}


const imdb = require('imdb-api');
//imdb.get('The Toxic Avenger', {apiKey: 'e92db086', timeout: 30000}).then(console.log).catch(console.log);
Movie.sync();
Actor.sync();
createMovies();
createActors();

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

app.get('/actors', (req,res,next)=> {
    Actor.findAll()
    .then((actors) => res.status(200).json(actors))
    .catch((err) => next(err))
})

app.get('/actors/:nume', (req,res,next)=> {
  Actor.findOne({
  where: { name: req.params.nume}})
  .then((actors) => res.status(200).json(actors))
  .catch((err) => next(err))

})

app.get('/imdbMovies/:nume', (req,res,next)=> {
  console.log("parametru: " + req.params.nume);
    var imdbRes;
    imdb.get(req.params.nume, {apiKey: 'e92db086', timeout: 30000}).then(function(response) { 
      console.log(response)
      res.json(response);
    }).catch(imdbRes);
    //console.log("am trecut de get imdb " + imdbRes);
    //res.json(imdbRes);
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
        return movie.update(req.body, {fields : ['name', 'year', 'rating', 'genre', 'country']})
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

function uploadMovies()
{
  for (var i = 65; i <= 90; i++) {
     
       imdb.get(String.fromCharCode(i), {apiKey: 'e92db086', timeout: 30000}).then(function(response)
       {
          console.log(response);
           Movie.create({ name: response.title, year: response.year, rating: response.rating, genre:response.genres, country: '' })
       }
       );
}


}

//uploadMovies();
app.listen(8081, '0.0.0.0')
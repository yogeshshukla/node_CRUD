const express = require('express')
const bodyParser= require('body-parser')
var mongodb = require('mongodb')
var ObjectId = mongodb.ObjectID;
var MongoClient = mongodb.MongoClient;
const app = express()
var url = 'mongodb://localhost:27017/myfirstproject';	
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.listen(3000, function() {
	
})
MongoClient.connect(url, function(err, db) {
	   if (err) {
	    console.log('Unable to connect to the mongoDB server. Error:', err);
	   }else {
	    //HURRAY!! We are connected. :)
		    app.post('/quotes', (req, res) => {
			  db.collection('quotes').save(req.body, (err, result) => {
			    if (err) return console.log(err)

			    console.log('saved to database')
			    res.redirect('/')
			  })
		  
			})
			app.get('/', (req, res) => {
			  db.collection('quotes').find().toArray((err, result) => {
			    if (err) return console.log(err)
			    // renders index.ejs
			    res.render('index.ejs', {quotes: result})
			  })
			})
			app.get('/view_quote/:id', (req, res) => {
				db.collection('quotes').findOne({'_id':ObjectId(req.params.id)},function(err, result) {
				    res.render('view.ejs', {quote: result})
				});
			})
			app.get('/delete_quote/:id', (req, res) => {
				db.collection('quotes').remove({'_id':ObjectId(req.params.id)},function(err, result) {
				    res.redirect('/')
				});
			})
			app.get('/edit_quote/:id', (req, res) => {
				db.collection('quotes').findOne({'_id':ObjectId(req.params.id)},function(err, result) {
				    res.render('edit.ejs', {quote: result})
				});
			})
			app.post('/update_quote/:id', (req, res) => {
			  db.collection('quotes').update({"_id":ObjectId(req.params.id)}, {$set:{'name':req.body.name, 'quote':req.body.quote}},function(err, result){
			    if (err) return console.log(err)

			    console.log('saved to database')
			    res.redirect('/')
			  })
		  
			})
		}
});
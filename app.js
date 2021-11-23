const express = require('express');
const mustache = require('mustache-express');
const mainRouter = require('./routes/MainRouter');
const path = require('path');
const body_parser = require('body-parser')
const busboyBodyParser = require('busboy-body-parser');

const PORT = process.env.PORT || 8080
const app = express()

app.use(express.static('./public'));

const viewsDir = path.join(__dirname, 'views');
app.engine("mustache", mustache(path.join(viewsDir, "partials")));
app.set('views', viewsDir);
app.set('view engine', 'mustache');

app.use(body_parser.urlencoded({ extended: true }))
app.use(body_parser.json());
app.use(busboyBodyParser());

// app.get('/', (req, res) => {
//     res.render('home');
// });
// app.get("/auth", (req, res) => {
//     res.render('auth')
// });

app.use('', mainRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
const express = require('express')
const path = require('path');
const fs = require('fs').promises;

const app = express();
const port = 3000;

// add a possibility to use files from the "public" directory
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/public'));

// render the index.html file by the "/" route
app.get('/', async(req, res) => {
    const {page = 1} = req.query

    const newPage = page && page >= 1 ? page : 1 
    const article = await fs.readFile('db.json', 'utf8');
    const pageSize = 5

    const totalArticles = JSON.parse(article).articles.length;
    const totalPages = Math.ceil(totalArticles / pageSize);

    const startIndex = (newPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const data = {
        article: JSON.parse(article).articles.slice(startIndex, endIndex),
        newPage,
        totalPages
    }
    res.render('index', data);
});

// return a list of articles from the db.json
app.get('/items/', async(_, res) => {
    const data = await fs.readFile('db.json', 'utf8');
    res.json(JSON.parse(data));
});

app.listen(port, () => {
    console.log(`Test project is here: http://localhost:${port}`);
});
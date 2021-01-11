const express = require('express');
const mongoose = require('mongoose');
const app = express();
const authRoute = require('./routes/authRoute');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const port = process.env.PORT || 5000;
//middleware
app.use(express.static('public'));
app.use(express.json());
app.use(authRoute);
app.use(cookieParser());


app.set('view engine', 'ejs');
//const CON_URL = "mongodb+srv://parkcodedr:parkcodedr123@cluster0.7l9yt.mongodb.net/nodedb?retryWrites=true&w=majority";
const CON_URL = "mongodb://127.0.0.1:27017/nodedb";
mongoose.connect(CON_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, () => {
    app.listen(port, () => `Server running on port ${port} `);
    console.log('conneted');
});



//routes
app.get('*', checkUser);
app.get('/', (req, res) => {
    res.render('index.ejs');
});
app.get('/products', requireAuth, (req, res) => {
    res.render('products');
});








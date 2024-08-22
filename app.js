const express = require('express');
const app = express();
app.set('view engine', 'ejs');
const path = require('path');
const ejsmate = require('ejs-mate');
const campground = require('./models/campground');
// const mongoose = require('mongoose');
app.engine('ejs', ejsmate);
const mongoose = require('mongoose');

const methodOverride = require('method-override');
// const campground = require('./models/campground');
// const campground = require('./models/campground');



main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log("Connected")
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
};

app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))

app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render("home.ejs");
});

app.get('/reset', async (req, res) => {
    await campground.deleteMany();
    res.send("Deleted")
})
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('campground/index', { campgrounds })
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campground/new')
});

app.post('/campgrounds', async (req, res) => {

    console.log(req.body.campground);
    const camp = new campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
});


app.get('/campgrounds/:id', async (req, res) => {
    const camp = await campground.findById(req.params.id)
    res.render('campground/show', { camp })
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const camp = await campground.findById(req.params.id)
    res.render('campground/edit', { camp })
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const camp = await campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${id}`);
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})


app.listen(3000, () => {
    console.log("Listening");
})
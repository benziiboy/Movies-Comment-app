const mongoose = require('mongoose')
require('dotenv').config();
const Reference = require('./References')

const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// Connect to MongoDB
mongoose.connect(process.env.URI, {
    tlsAllowInvalidCertificates: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Database connected successfully!')
})
.catch(err => {
    console.error('Database connection error:', err)
})

// Routes using actual database

// Index - Show all references
app.get('/references', async (req, res) => {
    try {
        const references = await Reference.find({});
        res.render('references/index', { references });
    } catch (err) {
        console.error('Error fetching references:', err);
        res.status(500).send('Error loading references');
    }
})

// New - Form to create new reference
app.get('/references/new', (req, res) => {
    res.render('references/new');
})

// Create - Add new reference to database
app.post('/references', async (req, res) => {
    try {
        const { username, reference } = req.body;
        const newReference = new Reference({ username, reference });
        await newReference.save();
        res.redirect('/references');
    } catch (err) {
        console.error('Error creating reference:', err);
        res.status(500).send('Error creating reference');
    }
})

// Show - Display single reference
app.get('/references/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const reference = await Reference.findById(id);
        if (!reference) {
            return res.status(404).send('Reference not found');
        }
        res.render('references/show', { reference });
    } catch (err) {
        console.error('Error fetching reference:', err);
        res.status(500).send('Error loading reference');
    }
})

// Edit - Form to edit reference
app.get('/references/:id/edit', async (req, res) => {
    try {
        const { id } = req.params;
        const reference = await Reference.findById(id);
        if (!reference) {
            return res.status(404).send('Reference not found');
        }
        res.render('references/edit', { reference });
    } catch (err) {
        console.error('Error fetching reference for edit:', err);
        res.status(500).send('Error loading edit form');
    }
})

// Update - Update reference in database
app.patch('/references/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { reference } = req.body;
        await Reference.findByIdAndUpdate(id, { reference });
        res.redirect('/references');
    } catch (err) {
        console.error('Error updating reference:', err);
        res.status(500).send('Error updating reference');
    }
})

// Delete - Remove reference from database
app.delete('/references/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Reference.findByIdAndDelete(id);
        res.redirect('/references');
    } catch (err) {
        console.error('Error deleting reference:', err);
        res.status(500).send('Error deleting reference');
    }
})

app.listen(3002, () => {
    console.log('listening on port http://localhost:3002/references');
})

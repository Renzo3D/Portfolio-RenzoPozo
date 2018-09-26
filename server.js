require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = new express();
const sgMail = require('@sendgrid/mail');

app.use(express.static("public"));
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const data = {
        person: {
            firstName: 'Renzo',
            lastName: 'Pozo',
        }
    }
    res.render('home', data);
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.post('/thanks', (req, res) => {
    
    addEmailToMailChimp(req.body.email_address, req.body.FNAME, req.body.LNAME);
    res.render('thanks', { contact: req.body, firstName: req.body.FNAME});
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: 'renzodcode@gmail.com',
        from: req.body.email_address,
        subject: 'New portfolio contact ' + ' ' + req.body.FNAME + ' ' + req.body.LNAME,
        text: req.body.message,
    };
    sgMail.send(msg);
});

app.get('/aboutme', (req, res) => {
    res.render('aboutMe')
});

app.get('/projects', (req, res) => {
    res.render('projects')
});

app.get('/resume', (req, res) => {
    res.render('resume')
});

app.get('/projectSelected/budgetTrackerDetail', (req, res) => {
    res.render('projectSelected/budgetTrackerDetail')
});

app.get('/projectSelected/changeCalculatorDetail', (req, res) => {
    res.render('projectSelected/changeCalculatorDetail')
});

app.get('/projectSelected/vstdaDetail', (req, res) => {
    res.render('projectSelected/vstdaDetail')
});

app.get('/projectSelected/weatherappDetail', (req, res) => {
    res.render('projectSelected/weatherappDetail')
});

app.get('/projectSelected/SDJSDetail', (req, res) => {
    res.render('projectSelected/SDJSDetail')
});

app.get('/projectSelected/portalDetail', (req, res) => {
    res.render('projectSelected/portalDetail')
});

app.listen(process.env.PORT || 8080, () => {
    console.log('Listening at http://localhost:8080');
})

function addEmailToMailChimp(email, name, lastName) {
  
    var request = require("request");
    var options = {
        method: 'POST',
        url: 'https://us18.api.mailchimp.com/3.0/lists/89b64282ee/members',
        headers:
        {
            'Postman-Token': process.env.POSTMAN_TOKEN,
            'Cache-Control': 'no-cache',
            Authorization: process.env.POSTMAN_AUTH,
            'Content-Type': 'application/json'
        },
        body: {
            email_address: email, "merge_fields": {
                "FNAME": name,
                "LNAME": lastName
            }, status: 'subscribed'
        },
        json: true
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    })
}

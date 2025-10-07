const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'library-portal-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/profile');
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

app.post('/login', (req, res) => {
  const { username } = req.body;
  if (username) {
    req.session.user = {
      name: username,
      loginTime: new Date().toISOString()
    };
    res.redirect('/profile');
  } else {
    res.status(400).send('Username is required');
  }
});


app.get('/profile', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
  } else {
    res.redirect('/');
  }
});

// New route to provide session info as JSON for profile page
app.get('/session-info', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.json({ user: null });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`Library Portal server running on http://localhost:${PORT}`);
});

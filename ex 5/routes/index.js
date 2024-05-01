const express = require('express');
const router = express.Router();
const db = require('../models/index');
const adController = require('../controllers/adController');
const adminController = require('../controllers/adminController');

/**
 * Route for rendering the landing page.
 * Fetches approved ads from the database and renders the landing page with the fetched ads.
 * If there's an error fetching ads, renders the landing page with an empty ads array.
 * Includes functionality to filter ads based on a search query in the title.
 */
router.get('/', function(req, res) {
    // Retrieve the search query from the request URL parameters
    const searchQuery = req.query.search;

    // Fetch ads from the database
    db.Ad.findAll({ where: { approved: true } })
        .then(ads => {
            let showAllButton = false;
            // If there's a search query, filter ads based on the query
            if (searchQuery) {
                ads = ads.filter(ad => ad.title.toLowerCase().includes(searchQuery.toLowerCase()));
                showAllButton = true; // Show the button to display all ads
            }

            // Render the landing page with fetched and/or filtered ads
            res.render('landing', { title: 'Yad2', ads: ads, showAllButton: showAllButton });
        })
        .catch(err => {
            // Render the landing page with an empty ads array if there's an error
            console.error('Error fetching ads:', err);
            res.render('landing', { title: 'Yad2', ads: [], showAllButton: false });
        });
});

/**
 * Route for rendering the login page.
 * Renders the login page with an empty error message.
 */
router.get('/login', function(req, res) {
    // Render the login page
    res.render('login', { title: 'Login',  errorMessage: '' });
});

/**
 * Route for rendering the admin page.
 * Renders the admin page.
 */
router.get('/admin', function(req, res) {
    // Render the admin page
    res.render('admin', { title: 'Admin' });
});

/**
 * Route for rendering the page to post a new ad.
 * Renders the page to post a new ad with a title and confirmation message.
 */
router.get('/post-new-ad', function(req, res) {
    // Render the page to post a new ad with confirmation message
    res.render('post-new-ad', { title: 'Post new ad', confirmationMessage: req.cookies.lastAdPosted || '' });
});

/**
 * Route for rendering the page to create a new ad.
 * Renders the page to create a new ad with an empty confirmation message.
 */
router.get('/create-ad',function (req, res) {
    res.render('create-ad', { confirmationMessage: '' });
});


/**
 * Route for handling login form submission.
 * Checks if provided credentials are admin or admin2.
 * If valid, sets session variables and redirects to admin page.
 * If invalid, renders the login page with an error message.
 * If there's an error finding the user, renders the admin page with an error message.
 */
router.post('/admin', adminController.login);

/**
 * Route for fetching all ads.
 * @name GET/api/ads
 * @function
 * @inner
 * @param {string} path - Express route path
 * @param {callback} middleware - Express middleware.
 */
router.get('/ads', adminController.getAllAds);

/**
 * Route for handling creation of new ad.
 * @name POST/api/create-ad
 * @function
 * @inner
 * @param {string} path - Express route path
 * @param {callback} middleware - Express middleware.
 */
router.post('/create-ad',adController.createAd);

/**
 * Route for handling deletion of ad.
 * @name DELETE/api/ads/:id
 * @function
 * @inner
 * @param {string} path - Express route path
 * @param {callback} middleware - Express middleware.
 */
router.delete('/ads/:id',adminController.deleteAd);

/**
 * Route for handling approval of ad.
 * @name PUT/api/ads/:id/approve
 * @function
 * @inner
 * @param {string} path - Express route path
 * @param {callback} middleware - Express middleware.
 */
router.put('/ads/:id/approve',adminController.approveAd);

/**
 * Error handling middleware to render the error page for 404 Not Found errors.
 * Renders the error page with a message and status code indicating the resource could not be found.
 */
router.use(function(req, res) {
    res.status(404).render('error', {
        message: 'Not Found',
        error: { status: 404, stack: 'The resource could not be found on this server!' }
    });
});

module.exports = router;

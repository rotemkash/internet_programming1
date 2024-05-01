/**
 * Controller for handling administrative actions such as fetching, deleting, and approving ads.
 * @module controllers/adminController
 */

const db = require('../models/index');

/**
 * Logs in an administrator using provided credentials.
 * If successful, sets session variables and redirects to the admin page.
 * If unsuccessful, renders the login page with an error message.
 * @function login
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

exports.login = (req, res) => {
    const { login, password } = req.body;

    // Check if the provided credentials match any admin user in the database
    db.User.findOne({ where: { login, password } })
        .then(user => {
            if (user) {
                // If user is found, set session variables and redirect to admin page
                req.session.isLoggedIn = true;
                req.session.user = user;
                res.redirect('/admin');
            } else {
                // If no user is found, render the login page with an error message
                res.render('login', { title: 'Login', errorMessage: 'Wrong username or password' });
            }
        })
        .catch(err => {
            console.error('Error finding user:', err);
            res.render('admin', { title: 'Admin', errorMessage: 'An error occurred' });
        });
};

/**
 * Fetches all ads from the database.
 * @function getAllAds
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.getAllAds = (req, res) => {
    db.Ad.findAll()
        .then(ads => {
            if (Array.isArray(ads)) {
                res.json(ads); // Send the ads as JSON response
            } else {
                console.error('Error fetching ads: Ads is not an array');
                res.status(500).json({ error: 'Error fetching ads: Ads is not an array' });
            }
        })
        .catch(err => {
            console.error('Error fetching ads:', err);
            res.status(500).json({ error: 'Error fetching ads' });
        });
};

/**
 * Deletes an ad from the database.
 * @function deleteAd
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.deleteAd = (req, res) => {
    // Check if user is admin or admin2
    if (!req.session.isLoggedIn || (req.session.user.login !== 'admin' && req.session.user.login !== 'admin2')) {
        return res.status(403).send('Forbidden');
    }

    const adId = req.params.id;
    db.Ad.destroy({ where: { id: adId } })
        .then(() => {
            res.send(`Ad with ID ${adId} has been deleted`);
        })
        .catch(err => {
            console.error('Error deleted ad:', err);
            res.status(500).send('An error occurred while deleting ad');
        });
};

/**
 * Approves an ad in the database.
 * @function approveAd
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
exports.approveAd = (req, res) => {
    // Check if user is admin or admin2
    if (!req.session.isLoggedIn || (req.session.user.login !== 'admin' && req.session.user.login !== 'admin2')) {
        return res.status(403).send('Forbidden');
    }

    const adId = req.params.id;
    db.Ad.update({ approved: true }, { where: { id: adId } })
        .then(() => {
            res.send(`Ad with ID ${adId} has been approved`);
        })
        .catch(err => {
            console.error('Error approving ad:', err);
            res.status(500).send('An error occurred while approving ad');
        });
};

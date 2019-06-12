const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Reportage model
const Article = require('../../models/Reportage');

// Validation
const validateReportageInput = require('../../validation/reportage');

// @route   GET api/reportages/test
// @desc    Tests article route
// @access  Public
router.get('/', (req, res) => res.json({ msg: 'Reportage Works' }));

// @route   GET api/reportages
// @desc    Get reportages
// @access  Public
router.get('/:id', (req, res) => {
    Reportage.find()
    .sort({ date: -1 })
    .then(reportages => res.json(reportages))
    .catch(err => res.status(404).json({ noreportagesfound: 'No reportages found' }));
});

// @route   GET api/reportages/:id
// @desc    Get reportage by id
// @access  Public
router.get('/', (req, res) => {
    Reportage.findById(req.params.id)
    .then(reportage => {
      if (reportage) {
        res.json(reportage);
      } else {
        res.status(404).json({ noreportagefound: 'No reportage found with that ID' })
      }
    })
    .catch(err =>
      res.status(404).json({ noreportagefound: 'No reportage found with that ID' })
    );
});

// @route   POST api/reportages
// @desc    Create reportage
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateReportageInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newReportage = new Reportage({
      text: req.body.text,
      name: req.body.name,
      user: req.user.id
    });

    newReportage.save().then(reportage => res.json(reportage));
  }
);

// @route   DELETE api/reportages/:id
// @desc    Delete reportage
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
        Reportage.findById(req.params.id)
        .then(reportage => {
          // Check for reportage owner
          if (reportage.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: 'User not authorized' });
          }

          // Delete
          reportage.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ reportagenotfound: 'No reportage found' }));
    });
  }
);

// @route   POST api/reportages/comment/:id
// @desc    Add comment to reportage
// @access  Private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateReportageInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Reportage.findById(req.params.id)
      .then(reportage => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Add to comments array
        reportage.comments.unshift(newComment);

        // Save
        reportage.save().then(reportage => res.json(reportage));
      })
      .catch(err => res.status(404).json({ reportagenotfound: 'No reportage found' }));
  }
);

// @route   DELETE api/reportages/comment/:id/:comment_id
// @desc    Remove comment from reportage
// @access  Private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Reportage.findById(req.params.id)
      .then(reportage => {
        // Check to see if comment exists
        if (
            reportage.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: 'Comment does not exist' });
        }

        // Get remove index
        const removeIndex = reportage.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        reportage.comments.splice(removeIndex, 1);

        reportage.save().then(reportage => res.json(reportage));
      })
      .catch(err => res.status(404).json({ reportagenotfound: 'No reportage found' }));
  }
);

module.exports = router;

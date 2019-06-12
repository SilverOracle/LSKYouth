const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Event model
const Event = require('../../models/Event');

// Validation
const validateEventInput = require('../../validation/event');

// @route   GET api/events/test
// @desc    Tests event route
// @access  Public
router.get('/', (req, res) => res.json({ msg: 'Event Works' }));

// @route   GET api/events
// @desc    Get events
// @access  Public
router.get('/:id', (req, res) => {
    Event.find()
    .sort({ date: -1 })
    .then(events => res.json(events))
    .catch(err => res.status(404).json({ noeventsfound: 'No events found' }));
});

// @route   GET api/events/:id
// @desc    Get event by id
// @access  Public
router.get('/', (req, res) => {
    Event.findById(req.params.id)
    .then(event => {
      if (event) {
        res.json(event);
      } else {
        res.status(404).json({ noeventfound: 'No event found with that ID' })
      }
    })
    .catch(err =>
      res.status(404).json({ noeventfound: 'No event found with that ID' })
    );
});

// @route   POST api/events
// @desc    Create event
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEventInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newEvent = new Event({
      text: req.body.text,
      name: req.body.name,
      user: req.user.id
    });

    newEvent.save().then(event => res.json(event));
  }
);

// @route   DELETE api/events/:id
// @desc    Delete event
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
        Event.findById(req.params.id)
        .then(event => {
          // Check for event owner
          if (event.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: 'User not authorized' });
          }

          // Delete
          event.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ eventnotfound: 'No event found' }));
    });
  }
);

// @route   POST api/events/comment/:id
// @desc    Add comment to event
// @access  Private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEventInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Event.findById(req.params.id)
      .then(event => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Add to comments array
        event.comments.unshift(newComment);

        // Save
        event.save().then(event => res.json(event));
      })
      .catch(err => res.status(404).json({ eventnotfound: 'No event found' }));
  }
);

// @route   DELETE api/events/comment/:id/:comment_id
// @desc    Remove comment from event
// @access  Private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Event.findById(req.params.id)
      .then(event => {
        // Check to see if comment exists
        if (
            event.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: 'Comment does not exist' });
        }

        // Get remove index
        const removeIndex = event.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        event.comments.splice(removeIndex, 1);

        event.save().then(event => res.json(articeventle));
      })
      .catch(err => res.status(404).json({ eventnotfound: 'No event found' }));
  }
);

module.exports = router;

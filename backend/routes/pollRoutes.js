const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');

module.exports = (io) => {

  router.post('/', async (req, res) => {
    const { question, options } = req.body;
    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        message: 'A question and at least two options are required.'
      });
    }
    try {
      const pollOptions = options.map(optionName => ({
        name: String(optionName),
        votes: 0
      }));
      const newPoll = new Poll({
        question,
        options: pollOptions
      });
      const savedPoll = await newPoll.save();

      io.emit('newPoll', savedPoll);

      res.status(201).json(savedPoll);
    } catch (error) {
      console.error("Error creating poll:", error);
      res.status(500).json({ message: 'Server error while creating poll.' });
    }
  });

  router.get('/', async (req, res) => {
    try {
      const polls = await Poll.find().sort({ createdAt: -1 });
      res.status(200).json(polls);
    } catch (error) {
      console.error("Error fetching polls:", error);
      res.status(500).json({ message: 'Server error while fetching polls.' });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const poll = await Poll.findById(req.params.id);
      if (!poll) {
        return res.status(404).json({ message: 'Poll not found.' });
      }
      res.status(200).json(poll);
    } catch (error) {
      console.error("Error fetching poll:", error);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Poll not found (invalid ID format).' });
      }
      res.status(500).json({ message: 'Server error while fetching poll.' });
    }
  });

  router.post('/:id/vote', async (req, res) => {
    const { optionId } = req.body;
    const pollId = req.params.id;

    if (!optionId) {
      return res.status(400).json({ message: 'Option ID is required.' });
    }

    try {
      const updatedPoll = await Poll.findOneAndUpdate(
        { "_id": pollId, "options._id": optionId },
        { $inc: { "options.$.votes": 1 } },
        { new: true } // Return the updated document
      );

      if (!updatedPoll) {
        return res.status(404).json({ message: 'Poll or Option not found.' });
      }

      io.emit('pollUpdated', updatedPoll);
      res.status(200).json(updatedPoll);
    } catch (error) {
      console.error("Error casting vote:", error);
      res.status(500).json({ message: 'Server error while casting vote.' });
    }
  });

  router.put('/:id', async (req, res) => {
    const pollId = req.params.id;
    const { question } = req.body;

    if (!question || typeof question !== 'string' || question.trim().length < 5) {
      return res.status(400).json({ message: 'The poll question must be at least 5 characters long.' });
    }

    try {
      const updatedPoll = await Poll.findByIdAndUpdate(
        pollId,
        { question: question.trim() },
        { new: true, runValidators: true }
      );

      if (!updatedPoll) {
        return res.status(404).json({ message: 'Poll not found.' });
      }

      io.emit('pollUpdated', updatedPoll);

      res.status(200).json(updatedPoll);

    } catch (error) {
      console.error("Error updating poll:", error);
      res.status(500).json({ message: 'Server error while updating poll.' });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const poll = await Poll.findByIdAndDelete(req.params.id);

      if (!poll) {
        return res.status(404).json({ message: 'Poll not found.' });
      }

      io.emit('pollDeleted', { id: req.params.id });

      res.status(200).json({ message: 'Poll deleted' });
    } catch (error) {
      console.error("Error deleting poll:", error);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Poll not found (invalid ID format).' });
      }
      res.status(500).json({ message: 'Server error while deleting poll.' });
    }
  });

  return router;
};
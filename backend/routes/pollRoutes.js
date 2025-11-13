const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');

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
    res.status(500).json({ message: 'Server error while fetching poll.' });
  }
});

module.exports = router;
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { candidateId } = req.body;
  try {
    const existingVote = await prisma.vote.findFirst({
      where: { userId: req.user.id, candidateId }
    });
    if (existingVote) return res.status(400).send('You have already voted');

    const vote = await prisma.vote.create({ 
      data: { userId: req.user.id, candidateId }
    });
    res.status(201).json(vote);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


/*
app.post('/votes', authenticateToken, async (req, res) => {
  const { candidateId } = req.body;
  const userId = req.user.id;
  const existingVote = await prisma.vote.findFirst({
    where: {
      userId,
      candidateId
    }
  });

  if (existingVote) {
    return res.status(403).json({ message: 'Duplicate voting is not allowed' });
  }

  const vote = await prisma.vote.create({
    data: { userId, candidateId }
  });

  res.json({ message: 'Vote cast successfully', vote });
});

// Route to view votes
app.get('/votes', async (req, res) => {
  const votes = await prisma.vote.findMany();
  res.json({ votes });
});
*/
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

router.post('/add', auth, admin, async (req, res) => {
  const { name } = req.body;
  try {
    const candidate = await prisma.candidate.create({
      data: { userId: req.user.id, name }
    });
    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
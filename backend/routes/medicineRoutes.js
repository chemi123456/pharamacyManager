const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');

// GET all medicines
router.get('/', async (req, res) => {
  try {
    const meds = await Medicine.find().sort({ createdAt: -1 });
    res.json(meds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new medicine
router.post('/', async (req, res) => {
  try {
    const newMed = new Medicine(req.body);
    await newMed.save();
    res.status(201).json(newMed);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE medicine
router.put('/:id', async (req, res) => {
  try {
    const updatedMed = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedMed);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE medicine
router.delete('/:id', async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ message: "Medicine deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

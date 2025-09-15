const express = require('express');
const router = express.Router();

// GET /history - Display translation history page (now uses localStorage)
router.get('/', (req, res) => {
  res.render('history', {
    title: 'Translation History',
    error: null
  });
});

// GET /history/:id/view - Display translation view page (now uses localStorage)
router.get('/:id/view', (req, res) => {
  res.render('translation-view', {
    translationId: req.params.id,
    title: 'Translation Details',
    error: null
  });
});

module.exports = router;

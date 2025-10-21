const slidesData = require('../src/data/slides.json');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    res.status(200).json({
      success: true,
      data: slidesData,
      total: slidesData.length
    });
  } else if (req.method === 'POST') {
    const { slideId, note } = req.body;
    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: { slideId, note, timestamp: new Date().toISOString() }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

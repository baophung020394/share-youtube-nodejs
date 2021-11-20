const mongoose = require('mongoose');

const YoutubeSchema = new mongoose.Schema({
  source: {type: String, required: true, unique: true}
}, { collection: 'youtubes'});

const model = mongoose.model('YoutubeSchema', YoutubeSchema);

module.exports = model;
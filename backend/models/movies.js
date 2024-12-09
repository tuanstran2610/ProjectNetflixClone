const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    movieID: Number,
    backdropPath: String,
    budget: Number,
    genres: [String],
    genreIds: [Number],
    originalTitle: String,
    overview: String,
    popularity: Number,
    posterPath: String,
    productionCompanies: [String],
    releaseDate: Date,
    revenue: Number,
    runtime: Number,
    status: String,
    title: String,
    watchProviders: [String],
    logo: String,
    downloadLink: String,
    rate: String
})

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie; 
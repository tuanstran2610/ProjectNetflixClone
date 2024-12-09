const express = require('express');
const router = express.Router();
const Movie = require('../models/movies');

router.get('/edit-movie-list', async (req, res) => {
    try {
        const movies = await Movie.find()
        res.render('editMovieList', { movies })
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})

router.get('/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        res.render('updateMovieDetails', { movie });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})



router.post('/update-movie/:id', async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            {
                movieID: Number(req.body.movieID), backdropPath: req.body.backdropPath, budget: Number(req.body.budget),
                genreids: req.body.genreIds.split(',').map(id => Number(id)),
                genres: req.body.genres.split(','),
                originalTitle: req.body.originalTitle,
                overview: req.body.overview,
                rate: Number(req.body.ratings),
                popularity: Number(req.body.popularity),
                posterPath: req.body.posterPath,
                productionCompanies: req.body.productionCompanies.split(','),
                releaseDate: req.body.releaseDate,
                revenue: Number(req.body.revenue),
                runtime: Number(req.body.runtime),
                status: req.body.status,
                title: req.body.title,
                watchProviders: [req.body.watchProviders],
                logo: 'https://image.tmdb.org/t/p/original' + req.body.logos,
                downloadLink: req.body.downloadLink,
            },
            { new: true }

        );


        res.render('updateMovieDetails', {
            movie: updatedMovie,
            successMessage: 'Movie updated successfully!',
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})
module.exports = router;
require('dotenv').config()
const { error } = require('console');
const express = require('express');
const router = express.Router();
const Movie = require('../models/movies');
const { release } = require('os');

router.post('/fetch-movie', async (req, res) => {
    const search_term = req.body.searchTerm
    console.log(search_term);
    try {

        const url = `https://api.themoviedb.org/3/search/movie?query=${search_term}&include_adult=false&language=en-US&page=1`
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_AUTH_KEY}`

            }
        }
        const responseData = await fetch(url, options);
        const result = await responseData.json();

        if (result.results.lengthe === 0) {
            return res.status(404).json({ error: 'No movies found with the given search term' });
        }

        res.render('addMovieList', { movieList: result.results })

        //res.json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch movie details' });
    }
})

router.get('/addMovie/:movieId', async (req, res) => {
    const movieId = req.params.movieId;
    //res.json(movieId);
    try {
        const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_AUTH_KEY}`
            }
        };

        const responseData = await fetch(url, options);
        const movieDetails = await responseData.json();

        const watchProviderUrl = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`;
        const watchProviderResponse = await fetch(watchProviderUrl, options);
        const watchProviderResult = await watchProviderResponse.json();
        const watchProvider = Object.keys(watchProviderResult.results).filter((country) => country === "US").map((country) => {
            const countryData = watchProviderResult.results[country];
            return {
                country,
                providerName: countryData.flatrate ? countryData.flatrate[0]?.provider_name : countryData.buy[0]?.provider_name
            }
        })


        movieDetails.watchProvider = watchProvider;

        const genreIds = movieDetails.genres.map(genre => genre.id);
        const genreNames = movieDetails.genres.map(genre => genre.name);
        movieDetails.genreIds = genreIds;
        movieDetails.gerneNames = genreNames;

        movieDetails.production_companies = movieDetails.production_companies.map(company => company.name);
        movieDetails.watchProvider = movieDetails.watchProvider.map(provider => provider.providerName);

        //res.json(movieDetails);

        res.render('addMovie', { movieDetails });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to fetch movie details' });
    }
})


router.post('/add-movie-details', async (req, res) => {
    try {
        const movieDetails = req.body;
        const genreIds = movieDetails.genreIds.split(',').map(id => Number(id));
        const genres = movieDetails.genres
            .split(/\s{2,}/)  // Split by two or more spaces
            .map(genre => genre.trim()) // Trim each genre
            .filter(genre => genre.length > 0); // Remove any empty strings
        const existingMovie = await Movie.findOne({ movieId: movieDetails.id });

        if (existingMovie) {
            console.log(`Movie with ID: ${movieDetails.id} already exists.`);
            res.status(500).json({ error: `Movie with ID: ${movieDetails.id} already exists.` });
        }

        const newMovie = new Movie({
            movieID: movieDetails.id,
            backdropPath: 'https://image.tmbd.org/t/p/original' + movieDetails.backdrop_path,
            budget: Number(movieDetails.budget),
            genreIds: genreIds,
            genres: genres,
            originalTitle: movieDetails.originalTitle,
            overview: movieDetails.overview,
            rate: movieDetails.vote_average,
            popularity: Number(movieDetails.popularity),
            posterPath: 'https://image.tmbd.org/t/p/original' + movieDetails.poster_path,
            productionCompanies: movieDetails.production_companies,
            releaseDate: movieDetails.release_date,
            revenue: Number(movieDetails.revenue),
            runtime: Number(movieDetails.runtime),
            status: movieDetails.status,
            title: movieDetails.title,
            watchProviders: movieDetails.watchProviders,
            logo: 'https://image.tmbd.org/t/p/original' + movieDetails.logos,
            downloadLink: movieDetails.downloadLink,

        })
        const saveMovie = await newMovie.save();

        res.render('addMovie', { successMessage: 'Movie details submitted successfully' });

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to submit movie details' });
    }

})

module.exports = router;
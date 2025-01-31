'use strict';
import { api_key, idToCategoryMovie, idToCategoryTV, idToCategoryColorMovie, top_movies, current_movies, upcoming_movies, tv_shows } from "./config.js";

// export let postersDataSend = [];

// const api = `https://api.themoviedb.org/3/movie/11?api_key=${api_key}`
const api = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&language=en-US&sort_by=popularity.desc&page=1`

// elements
const topPosters = document.querySelectorAll(".top-poster");
const topMoviePoster = document.querySelectorAll(".top_poster");
const currentMoviePoster = document.querySelectorAll(".current_poster");
const upcomingMoviePoster = document.querySelectorAll(".upcoming_poster");
const tvPoster = document.querySelectorAll(".tv_poster");
const middleSection = document.querySelector(".middle-section");
const moreModal = document.querySelector(".MORE-MODAL");
const closeModal = document.querySelector(".modal-cross");
const overlayModal = document.querySelector(".OVERLAY");
const modalTextPara = document.querySelector("#modal-text-para");
const searchBar = document.querySelector("#searchbar")
const searchIcon = document.querySelector(".search-icon");
const searchCategorySelector = document.querySelector(".search-category-selector")
const searchModal = document.querySelector(".SEARCH-MODAL");
const searchCross = document.querySelector(".search-cross")
const searchOverlay = document.querySelector(".OVERLAY-search");

const searchMovieName = document.querySelector(".search-movie-name");
const searchMoviePoster = document.querySelector(".search-movie-poster");
const searchMovieDescription = document.querySelector("#smd");
const releaseYear = document.querySelector("#release");
const isAdult = document.querySelector("#adult");
const searchMovieRating = document.querySelector("#ratingg");

// note - replace with movie names
const apiMovieSearch = `https://api.themoviedb.org/3/search/movie?query=Avengers+Endgame&${api_key}`;
const apiTVSearch = `https://api.themoviedb.org/3/search/tv?query=Stranger+Things&${api_key}`;


let top_index =  Math.floor(Math.random() * 14);

// helper function
function getImageUrl(imagePath) {
    const baseUrl = "https://image.tmdb.org/t/p/w500"; // You can adjust the size (w500, w300, etc.)
    return baseUrl + imagePath;
}


// ADDING MOVIES TO THE TOP 4 Posters
topPosters.forEach(topPoster => {
    const movie_request = fetch(api);
    movie_request.then(movie_data => {
        const movie_json = movie_data.json();
        movie_json.then(about_movie_data => {
            const movieName = topPoster.querySelector(".movie-name");
            const movieGenre = topPoster.querySelector(".movie_genre");
            const movieRating = topPoster.querySelector(".movie-rating");
            const about_movie_array = about_movie_data.results;
            const about_movie = about_movie_array[top_index];
            const posterPath = getImageUrl(about_movie.poster_path);
            topPoster.style.backgroundImage = `url(${posterPath})`;
            movieName.textContent = about_movie.original_title.split(":")[0];
            // movieGenre.textContent = idToCategoryMovie.get(about_movie.genre_ids[0]);
            // movieGenre.style.backgroundColor = idToCategoryColorMovie.get(about_movie.genre_ids[0]);
            movieRating.textContent = about_movie.vote_average;
            top_index+=1;
        })
    })
})

// MIDDLE MOVIE SECTION
const showMiddleMovies = (categoryPosters, apiKey) => {
    let middle_index = Math.floor(Math.random() * 14);
    categoryPosters.forEach(async (category_poster) => {
        const movie_data = await fetch(apiKey);
        const movie_json = await movie_data.json();
        const movie_array = movie_json.results;
        const current_movie = movie_array[middle_index];
        const current_movie_poster = getImageUrl(current_movie.poster_path);
        category_poster.style.backgroundImage = `url(${current_movie_poster})`;
        middle_index++;
    })
}
showMiddleMovies(topMoviePoster, top_movies);
showMiddleMovies(currentMoviePoster, current_movies);
showMiddleMovies(upcomingMoviePoster, upcoming_movies);
showMiddleMovies(tvPoster, tv_shows);

// SCROLLING - Using scrolIntoView and also implementing concepts of event delegation
// navMovies.addEventListener("click", function(){
//     ScrollToMovies.scrollIntoView({behavior : 'smooth'});
// })
// navTVShows.addEventListener("click", function(){
//     ScrollToTVShows.scrollIntoView({behavior : 'smooth'});
// })

const navElements = document.querySelector(".nav-elements");
navElements.addEventListener("click", function(e){
    if(e.target.classList.contains("navLink")){
        const whereToGo = e.target.getAttribute("scrollTo");
        if(whereToGo){
            // console.log(whereToGo);
            if(whereToGo == "about"){
                window.open("about.html", "_blank");
                return;
            }
            document.querySelector(whereToGo).scrollIntoView({behavior : 'smooth'});
        }
    }
})

// modal
function getText(apiTag){
    let ApiTags = new Map([
        ["movie/top_rated", "BROWSE TOP RATED MOVIES"],
        ["movie/now_playing", "BROWSE CURRENTLY PLAYING MOVIES"],
        ["movie/upcoming", "BROWSE UPCOMING MOVIES"],
        ["trending/tv/day", "BROWSE TOP T.V SHOWS"]  
    ])
    return ApiTags.get(apiTag);
}

function shuffleArray() {
    let arr = Array.from({ length: 20 }, (_, i) => i); 
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); 
        [arr[i], arr[j]] = [arr[j], arr[i]]; 
    }
    return arr;
}

middleSection.addEventListener("click", function(e){
    if(e.target.classList.contains("view-more")){

        // now we make the api call
        const apiTag = e.target.getAttribute("apiTag");
        const apiKey = `https://api.themoviedb.org/3/${apiTag}?api_key=${api_key}&language=en-US`;
        const apiRequest = fetch(apiKey);
        const indexArray = shuffleArray();
        let index = 0;
        apiRequest.then(apiData => {
            modalTextPara.textContent = "";
            modalTextPara.textContent = getText(apiTag);
            const apiJson = apiData.json();
            apiJson.then(movieData => {
                let MoviesList = movieData.results;
                overlayModal.style.display = "block";
                moreModal.style.display = "flex";
                document.body.style.overflowY = 'hidden';

                const posterForThings = document.querySelectorAll(".clicked-movie-area-poster");
                posterForThings.forEach(poster => {
                    const posterData = MoviesList[indexArray[index]].poster_path;
                    const posterUrl = getImageUrl(posterData);
                    poster.style.backgroundImage = `url(${posterUrl})`;
                    index+=1;
                })
            })
        })
    }
})

closeModal.addEventListener("click", function(){
    overlayModal.style.display = "none";
    moreModal.style.display = "none";
    document.body.style.overflowY = 'scroll';
})


// SEARCH MODAL
searchIcon.addEventListener("click", () => {
    const searchSelectorCategory = searchCategorySelector.value;
    const movieName = searchBar.value;
    
    // logic
    if(movieName != ""){
        const searchName = movieName.split(" ")
        .map(movie => movie[0].toUpperCase() + movie.slice(1))
        .join("+");;
        
        const apiCategory = searchSelectorCategory == "Movie" ? "movie" : "tv";
        const apiPath =  `https://api.themoviedb.org/3/search/${apiCategory}?query=${searchName}&api_key=${api_key}`;

        // requests
        const apiRequest = fetch(apiPath);
        apiRequest.then(apiData => {
            const apiJson = apiData.json();
            apiJson.then(movieData => {
                const movieAbout = movieData.results[0]; 
                searchMovieName.textContent = (searchSelectorCategory== "Movie") ?  movieAbout.original_title : movieAbout.original_name;
                releaseYear.textContent = (searchSelectorCategory== "Movie") ?  movieAbout.release_date.split("-")[0] : movieAbout.first_air_date.split("-")[0] ;
                isAdult.textContent = movieAbout.adult ? "Rated 18+" : "PG 13";
                const moviePosterUrl = getImageUrl(movieAbout.poster_path);
                searchMoviePoster.style.backgroundImage = `url(${moviePosterUrl})`; 
                searchMovieDescription.textContent = movieAbout.overview;
                searchMovieRating.textContent = movieAbout.vote_average;
                searchOverlay.style.display = "block";
                searchModal.style.display = "flex";
                document.body.style.overflowY = "hidden";
            }).catch(err => {
                alert("CANNOT GET THE MOVIE/ SHOW RIGHT NOW");
            })
        }).catch(err => {
            alert("CANNOT GET THE MOVIE/ SHOW RIGHT NOW");
        })


        }
})

searchCross.addEventListener("click", () => {
    searchOverlay.style.display = "none";
    searchModal.style.display = "none";
    document.body.style.overflowY = "scroll";
})

/*
{adult: false, backdrop_path: '/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg', genre_ids: Array(3), id: 299534, original_language: 'en', …}
adult
: 
false
backdrop_path
: 
"/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg"
genre_ids
: 
(3) [12, 878, 28]
id
: 
299534
original_language
: 
"en"
original_title
: 
"Avengers: Endgame"
overview
: 
"After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos' actions and restore order to the universe once and for all, no matter what consequences may be in store."
popularity
: 
105.628
poster_path
: 
"/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg"
release_date
: 
"2019-04-24"
title
: 
"Avengers: Endgame"
video
: 
false
vote_average
: 
8.2
vote_count
: 
25931
[[Prototype]]
: 
Object
*/




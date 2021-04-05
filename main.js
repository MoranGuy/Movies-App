import { createPagination, addPagesIntoHTML } from './pagination.js'

let API_URL =
  'https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=2020-09-15&primary_release_date.lte=2020-10-22&api_key=3e605ab33674d0579ec858822868d525&page=1'
const GENRES_API =
  'https://api.themoviedb.org/3/genre/movie/list?api_key=3e605ab33674d0579ec858822868d525&language=en-US'
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280'
const SEARCH_API =
  'https://api.themoviedb.org/3/search/movie?primary_release_date.gte=2020-09-15&primary_release_date.lte=2020-10-22&api_key=3e605ab33674d0579ec858822868d525&query="'
const form = document.getElementById('form')
const search = document.getElementById('search')
const main = document.getElementById('main')
const totalPages = 20
const genres = []

getGenres(GENRES_API)

async function getGenres(url) {
  const res = await fetch(url)
  const data = await res.json()

  data.genres.forEach(genre => genres.push(genre))
}

//Get movies
getMovies(API_URL)

async function getMovies(url) {
  const res = await fetch(url)
  const data = await res.json()

  showMovies(data.results)
}

function showMovies(movies) {
  main.innerHTML = ''
  movies.forEach(movie => {
    const {
      id,
      title,
      poster_path,
      vote_average,
      overview,
      release_date,
      backdrop_path,
      genre_ids,
      vote_count,
    } = movie

    const movieEl = document.createElement('div')
    movieEl.classList.add('movie')
    movieEl.innerHTML = `<img
          src="${IMG_PATH + poster_path}"
          alt="${title}" height="450px"
        />
        <div class="movie-info">
          <h3>${title}</h3>
          <span class="${getClassByRate(vote_average)}">${vote_average}</span>
        </div>
        <div class="overview">
          <h3>Overview</h3>
          ${overview}`

    movieEl.addEventListener('click', () => {
      //getting individual movie details from API on click
      const CAST_API = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=3e605ab33674d0579ec858822868d525&language=en-US`
      const MOVIE_API = `https://api.themoviedb.org/3/movie/${id}?api_key=3e605ab33674d0579ec858822868d525&language=en-US`
      const getMovieDetails = async MOVIE_API => {
        const res = await fetch(MOVIE_API)
        const data = await res.json()

        const { tagline, runtime } = data
        document.querySelector('.fas.fa-arrow-circle-left').style.opacity = '1'

        const getMovieCast = async CAST_API => {
          const res = await fetch(CAST_API)
          const data = await res.json()

          const cast = data.cast
          function getCast(cast) {
            if (cast.length < 6) {
              //we want to get the first 5 actors, but if the cast is less than 5, we'll get every one
              let fullCast = ''
              for (let i = 0; i < cast.length - 1; i++) {
                fullCast += cast[i].name + ', ' // because the last one doesn't need comma
              }
              fullCast += cast[cast.length - 1].name
              return fullCast
            } else {
              let fullCast = ''
              for (let i = 0; i < 4; i++) {
                fullCast += cast[i].name + ', '
              }
              fullCast += cast[4].name
              return fullCast
            }
          }

          main.innerHTML = `<div class="movie-container">
        <img
          class="poster"
          src="${IMG_PATH + poster_path}"
          alt="${title}"
        />
        <div class="description">
          <h1 class="title">${title} (${parseInt(release_date)})</h1>
        <h2 class="tagline">${tagline}</h2>
          <p class="genres-duration">
            ${genresList(genre_ids)} <i class="fas fa-circle"></i> ${getRuntime(
            runtime
          )}
          </p>
          <div class="rating-container"><h2 class="rating ${getClassByRate(
            vote_average
          )}">${vote_average}</h2>
          <div class="rating-overlay">
          <p>${vote_count} votes on MovieDB</p></div>
          </div>
          
          <h2>Overview</h2>
          <div class="overview-text">
          <p>
            ${overview}
          </p>
          
          </div>
          <h2>Cast</h2>
          <h2 class="cast">${getCast(cast)}</h2>
        </div>
      </div>`

          document
            .querySelector('.fas.fa-arrow-circle-left')
            .addEventListener('click', () => {
              const activePage = document.querySelector('.active').innerText
              getMovies(
                `https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=2020-09-15&primary_release_date.lte=2020-10-22&api_key=3e605ab33674d0579ec858822868d525&page=${activePage}`
              )
              document.querySelector('footer').style.display = 'flex'
              document.querySelector(
                '.fas.fa-arrow-circle-left'
              ).style.opacity = '0'
            })
        }
        getMovieCast(CAST_API)
      }
      getMovieDetails(MOVIE_API)

      window.scrollTo(0, 0)

      document.querySelector('footer').style.display = 'none'
      document
        .querySelector(':root')
        .style.setProperty(
          '--pseudo-background',
          `url(${IMG_PATH + backdrop_path})`
        )
    })

    main.appendChild(movieEl)
  })
}

function getClassByRate(vote) {
  if (vote >= 8) {
    return 'green'
  } else if (vote >= 5) {
    return 'orange'
  } else {
    return 'red'
  }
}

function genresList(genresArr) {
  const genresPerMovie = []
  for (let i = 0; i < genresArr.length; i++) {
    genresPerMovie.push(
      ' ' + genres[genres.findIndex(el => el.id === genresArr[i])].name
    )
  }
  return genresPerMovie
}

form.addEventListener('submit', e => {
  e.preventDefault()

  const searchTerm = search.value
  if (searchTerm && searchTerm !== '') {
    getMovies(SEARCH_API + searchTerm)

    search.value = ''
  } else {
    window.location.reload()
  }
})

addPagesIntoHTML(totalPages)
const btn = document.querySelectorAll('.btn')
const prevBtn = document.querySelector('.btn-prev')
const nextBtn = document.querySelector('.btn-next')
createPagination(totalPages)

btn.forEach(button => {
  button.addEventListener('click', () => {
    getMovies(
      `https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=2020-09-15&primary_release_date.lte=2020-10-22&api_key=3e605ab33674d0579ec858822868d525&page=${button.innerText}`
    )
    window.scrollTo(0, 0)
    removeActiveClass()
    button.classList.add('active')
    checkNextPrev()
    createPagination(totalPages)
  })
})

getPrevious()
getNext()

function removeActiveClass() {
  btn.forEach(button => {
    button.classList.remove('active')
  })
}

function getPrevious() {
  prevBtn.addEventListener('click', () => {
    let activeBtn = document.querySelector('.btn.active')
    let pageNum = activeBtn.innerText - 1
    getMovies(
      `https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=2020-09-15&primary_release_date.lte=2020-10-22&api_key=3e605ab33674d0579ec858822868d525&page=${pageNum}`
    )
    window.scrollTo(0, 0)
    removeActiveClass()
    btn[pageNum - 1].classList.add('active')
    checkNextPrev()
    createPagination(totalPages)
  })
}

function getNext() {
  nextBtn.addEventListener('click', () => {
    let activeBtn = document.querySelector('.btn.active')
    let nextPageNum = parseInt(activeBtn.innerText) + 1

    getMovies(
      `https://api.themoviedb.org/3/discover/movie?primary_release_date.gte=2020-09-15&primary_release_date.lte=2020-10-22&api_key=3e605ab33674d0579ec858822868d525&page=${nextPageNum}`
    )
    window.scrollTo(0, 0)
    removeActiveClass()
    btn[nextPageNum - 1].classList.add('active')
    createPagination(totalPages)
    checkNextPrev()
  })
}

function checkNextPrev() {
  const prevBtn = document.querySelector('.btn-prev')
  const nextBtn = document.querySelector('.btn-next')
  const button = document.querySelector('.btn.active')
  if (button.innerText === '1') {
    prevBtn.classList.add('hidden')
    nextBtn.classList.remove('hidden')
  } else if (button.innerText == totalPages) {
    //non-strict equality 'cause totalPages is a number, and innerText is string
    nextBtn.classList.add('hidden')
    prevBtn.classList.remove('hidden')
  } else {
    nextBtn.classList.remove('hidden')
    prevBtn.classList.remove('hidden')
  }
}

function getRuntime(minutes) {
  const hours = Math.floor(minutes / 60)
  const minutesRemaining = minutes % 60
  if (minutesRemaining === 0) {
    return `${hours}h`
  } else if (hours === 0) {
    return `${minutesRemaining}m`
  } else {
    return `${hours}h ${minutesRemaining}m`
  }
}

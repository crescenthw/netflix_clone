const API_KEY = "0f9100ad951cd63f9d4150e54a490aec";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  release_date: number;
  vote_average: number;
  genre_ids: [number];
}

export interface IGetMovie {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: [IMovie];
  total_pages: number;
  total_results: number;
}

export interface IGenre {
  id: number;
  name: string;
}

export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1&region=kr`
  ).then((response) => response.json());
}

export function getGenres() {
  return fetch(`${BASE_PATH}/genre/movie/list?api_key=${API_KEY}&language=ko-KR
  `).then((response) => response.json());
}

export interface ITvShow {
  first_air_date: number;
  id: number;
  genre_ids: [number];
  overview: string;
  name: string;
  vote_average: number;
  backdrop_path: string;
  poster_path: string;
}

export interface IGetTvShow {
  page: number;
  results: [ITvShow];
  total_pages: number;
  total_results: number;
}

export function getTvShow() {
  return fetch(
    `${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}&language=ko-KR&page=1`
  ).then((response) => response.json());
}

export interface IDetailMovie {
  backdrop_path: string;
  genres: [IGenre];
  overview: string;
  release_date: number;
  runtime: number;
  title: string;
  tagline: string;
  original_language: string;
}

export function getDetailMovies(id: number) {
  return fetch(
    `${BASE_PATH}/movie/${id}?api_key=${API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}

export interface ISearch {
  page: number;
  results: [IMovie];
  total_pages: number;
  total_results: number;
}

export function getSearch(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&language=ko-KR&query=${keyword}&page=1&include_adult=false`
  ).then((res) => res.json());
}

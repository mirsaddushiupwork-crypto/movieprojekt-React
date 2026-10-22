import { createContext, useContext, useEffect, useState } from "react";

const MovieContext = createContext(undefined);

export const useMovieContext = () => {
  const context = useContext(MovieContext);

  if (!context) {
    throw new Error("useMovieContext duhet përdorur brenda MovieProvider");
  }

  return context;
};

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem("favorites");
      if (!savedFavorites) return [];

      const parsedFavorites = JSON.parse(savedFavorites);
      return Array.isArray(parsedFavorites) ? parsedFavorites : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (movie) => {
    setFavorites((previousFavorites) => {
      const alreadyExists = previousFavorites.some(
        (favorite) => favorite.id === movie.id
      );

      return alreadyExists ? previousFavorites : [...previousFavorites, movie];
    });
  };

  const removeFromFavorites = (movieId) => {
    setFavorites((previousFavorites) =>
      previousFavorites.filter((movie) => movie.id !== movieId)
    );
  };

  const isFavorite = (movieId) =>
    favorites.some((movie) => movie.id === movieId);

  return (
    <MovieContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}
    >
      {children}
    </MovieContext.Provider>
  );
};
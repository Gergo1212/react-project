import React, {useEffect, useState, useContext} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {ThemeContext} from '../../context/ThemeContext';
import {DataContext} from "../../context/DataContext";
import AppTheme from './Colors';

export default function Navigation() {
    const [theme] = useContext(ThemeContext);
    const currentTheme = AppTheme[theme];

    const NavBar = styled.div`
    height: 120px;
    background-color: ${currentTheme.backgroundColor};
    margin-right: 60px;
  `;

    const NavLink = styled(Link)`
    text-decoration: none;
    color: ${currentTheme.textColor};
    &:hover {
      color: gray;
      text-decoration: none;
    }
  `;

    const DropdownContent = styled.div`
    display: none;
    position: absolute;
    background-color: ${currentTheme.dropDownBackgroundColor};
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0, 2);
    z-index: 1;
    margin-top: 20px;
    & a {
      color: ${currentTheme.textColor};
      padding: 12px 16px;
      text-decoration: none;
      display: block;
    }
    & a:hover {
      background-color: ${currentTheme.dropDownBackgroundHoverColor};
    }
  `;

    const Button = styled.div`
    position: relative;
    display: inline-block;
    width: 180px;
    height: 120px;
    background-color: ${currentTheme.backgroundColor};
    color: ${currentTheme.textColor};
    font-size: 16px;
    border: none;
    &:hover {
      color: gray;
    }
    &:hover ${DropdownContent} {
      display: block;
    }
  `;

    const ButtonTitle = styled.div`
    margin-top: 80px;
    &:hover ${DropdownContent} {
      display: block;
    }
  `;

    const dataContext = useContext(DataContext);
    const [bookMenu, setBookMenu] = useState([]);
    const [movieMenu, setMovieMenu] = useState([]);
    const [bookList, setBookList] = useState([]);
    const [movieList, setMovieList] = useState([]);

    const getBooks = () => {
        if (!dataContext.isBookLoaded) {
            axios
                .get("https://the-one-api.herokuapp.com/v1/book", {
                    headers: {
                        Authorization: "Bearer pmF8BDZT97okBAtf7_Ui",
                    },
                })
                .then((response) => {
                    setBookMenu(response.data.docs);
                    dataContext.setBookMenu(response.data.docs);
                    setBookList(
                        bookMenu.map((item) => (
                            <Link key={item._id} to={"/book/" + item._id}>
                                {item.name}
                            </Link>
                        ))
                    );
                    dataContext.setIsBookLoaded(true);
                });
        } else {
            setBookMenu(dataContext.bookMenu);
        }
    };

    const getMovies = () => {
        if (!dataContext.isMovieLoaded) {
            axios
                .get("https://the-one-api.herokuapp.com/v1/movie", {
                    headers: {
                        Authorization: "Bearer pmF8BDZT97okBAtf7_Ui",
                    },
                })
                .then((response) => {
                    setMovieMenu(response.data.docs);
                    dataContext.setMovieMenu(response.data.docs);
                    setMovieList(
                        movieMenu.map((item) => (
                            <Link key={item._id} to={"/movie/" + item._id}>
                                {item.name}
                            </Link>
                        ))
                    );
                    dataContext.setIsMovieLoaded(true);
                });
        } else {
            setMovieMenu(dataContext.movieMenu);
        }
    };

    const fetchData = () => {
        getBooks();
        getMovies();
    };

    useEffect(() => {
        fetchData();
    }, [bookList, movieList]);

    let books = <span></span>;
    let movies = <span></span>;
    if (dataContext.isBookLoaded && dataContext.isMovieLoaded) {
        books = bookList;
        movies = movieList;
    }
    return (
        <NavBar>
            <Button>
                <ButtonTitle>BOOKS</ButtonTitle>
                <DropdownContent>{books}</DropdownContent>
            </Button>
            <Button>
                <ButtonTitle>MOVIES</ButtonTitle>
                <DropdownContent>{movies}</DropdownContent>
            </Button>
            <Button>
                <NavLink to="/characters">
                    <ButtonTitle>CHARACTERS</ButtonTitle>
                </NavLink>
            </Button>
        </NavBar>
    );
}
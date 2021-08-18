import React, { EventHandler, useState, useRef } from 'react';
import {Button} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import MoviePanel from './MoviePanel';
import FlipMove from 'react-flip-move';
import { setSyntheticLeadingComments } from 'typescript';
import Loader from "react-loader-spinner";


export interface IMovie {
    _id: string;
    tconst: string;
    primaryTitle: string;
    originalTitle: string;
    startYear: number;
    genres: string;
    averageRating: number;
    numVotes: number;
    posterPath: string;
    description: string;
    language: string;
    runtimeMinutes: number;
}

const useStyles = makeStyles({ //also some in .css
    highlowButtons: {
        background: 'linear-gradient(to bottom, rgb(0, 0, 0, .5), rgba(0, 0, 0, .4))',     
        fontWeight: 'bold',
        fontSize: '2vh',
        '&:hover': {
            background: 'linear-gradient(to bottom, rgb(0, 0, 0, 1), rgba(0, 0, 0, .2)), linear-gradient(to top, rgb(255, 255, 255, 1), rgba(0, 0, 0, .2))'  
        }
    },
    highlowButtonsRight: {
        background: 'linear-gradient(to top, rgb(0, 204, 0, 1), rgba(0, 204, 0, .2))',
        fontWeight: 'bold',
        fontSize: '2vh',
        color: 'aqua'
    },
    highlowButtonsWrong: {
        background: 'linear-gradient(to top, rgb(255, 0, 0, 1), rgba(255, 0, 0, .2))',
        fontWeight: 'bold',
        fontSize: '2vh',
        color: 'aqua'
    },
});

function Game(props: any){
    const [moviesLoaded, setMoviesLoaded] = useState(false);
    const [moviesIds, setMoviesIds]= useState<string[]>([""]);
    const [isBlurred, setIsBlurred] = useState(true);
    const [lost, setLost] = useState(false);
    const [buttonHigherAnswer, setButtonHigherAnswer] = useState(useStyles().highlowButtons);
    const [buttonLowerAnswer, setButtonLowerAnswer] = useState(useStyles().highlowButtons);
    const [movies, setMovies] = useState<IMovie[]>([]);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [imgsLoaded, setImgsLoaded] = useState(0);
    const [wasSameData, setWasSameData] = useState(false);

    var aniDelay = 1000;

    React.useEffect(() => { //get 3 new movies
        console.log(`movies length: ${movies.length}`);
        setIsBlurred(true);
        if(movies.length < 3) {
            getMovie();
        }
    }, [movies]);

    async function getMovie() { //gets a movie from database
        let currRating = 0, currRuntime = 0, currYear = 0;
        if(movies.length > 0) {
            currRating = movies[movies.length - 1].averageRating;
            currRuntime = movies[movies.length - 1].runtimeMinutes;
            currYear = movies[movies.length - 1].startYear;
        }
        await axios.get(`https://nameless-gorge-59165.herokuapp.com/api/imdb/`, { params: {rating: currRating, runtime: currRuntime, year: currYear, difficulty: props.difficulty, mode: props.mode, same: wasSameData}})
            .then(res => {
                if(moviesIds.includes(res.data.tconst)) {
                    getMovie();
                }
                else {
                    setMovies(movies => [...movies, res.data]);
                    moviesIds.push(res.data.tconst);                    
                }
        })
    }

    async function handleButtons(event: any) { //handles higher or lower TODO: im checking averageratings only, need to do other data as well.
        setButtonDisabled(true);
        var isWrong = false;
        var leftMovieData = -1;
        var rightMovieData = -1;

        switch(props.mode) {
            case 'averageRating': 
                leftMovieData = movies[0].averageRating;
                rightMovieData = movies[1].averageRating;
                break;
            case 'runtimeMinutes': 
                leftMovieData = movies[0].runtimeMinutes;
                rightMovieData = movies[1].runtimeMinutes;
                break;
            case 'startYear': 
                leftMovieData = movies[0].startYear;
                rightMovieData = movies[1].startYear;
                break;
            default:
                console.log('none');
        }
        console.log(props.mode + " " + leftMovieData + " == " + rightMovieData);
        if(leftMovieData == rightMovieData)
            setWasSameData(true);
        else
            setWasSameData(false);

        if((event.currentTarget.id == 'Higher' && leftMovieData > rightMovieData)
            || event.currentTarget.id == 'Lower' && leftMovieData < rightMovieData) {
                setLost(true)
                isWrong = true;
                if(event.currentTarget.id == 'Higher')
                    setButtonHigherAnswer(classes.highlowButtonsWrong);
                else
                    setButtonLowerAnswer(classes.highlowButtonsWrong);
        } else {
            props.scoreInc();
            if(event.currentTarget.id == 'Higher')
                setButtonHigherAnswer(classes.highlowButtonsRight);
            else 
                setButtonLowerAnswer(classes.highlowButtonsRight);
        }
        revealMovie(isWrong)
    }

    async function revealMovie(isWrong: boolean) { 
        setIsBlurred(false);
        await timeout(aniDelay);
        setIsBlurred(true);
        if(isWrong == true) {
            props.handleEnd();
        }
        setMovies([movies[1], movies[2]]);
        setButtonDisabled(false);
        setButtonHigherAnswer(classes.highlowButtons);
        setButtonLowerAnswer(classes.highlowButtons);
    }
    
    function imageLoaded() { 
        setImgsLoaded(imgsLoaded => imgsLoaded + 1);
    }

    React.useEffect(() => { //Checks to see if all images are preloaded
        console.log('loaded: ' + imgsLoaded)
        if(imgsLoaded > 1) {
            setMoviesLoaded(true);
        }
    }, [imgsLoaded]);

    async function testin(){
        setButtonDisabled(false);
        console.log('testin')
        //await timeout(1000);
    }

    function timeout(delay: number) {
        return new Promise( res => setTimeout(res, delay) );
    }

    var displayedMovies = movies.slice(0,2);
    var classes = useStyles();
    return ( 
        <div className="grid-game">
            <div className="movie-container" style={{display: moviesLoaded ? 'block': 'none'}}>
                <FlipMove className="movie-panels" onFinishAll={()=>testin()} staggerDelayBy={200} leaveAnimation="fade" enterAnimation="fade" appearAnimation="elevator">
                    {displayedMovies.map((movie, index) => {
                        return index == 0 ?
                        <MoviePanel key={movie._id} mode={props.mode} movie={movie} imageLoaded={imageLoaded}/>
                        : 
                        <MoviePanel key={movie._id} mode={props.mode} isBlurred={isBlurred} movie={movie} imageLoaded={imageLoaded}>
                            <div className="game-buttons">
                                <Button className={buttonHigherAnswer} disabled={buttonDisabled} onClick={(e) => handleButtons(e)} id="Higher" >Higher</Button>
                                <Button className={buttonLowerAnswer} onClick={(e) => handleButtons(e)} disabled={buttonDisabled} id="Lower" >Lower</Button>
                            </div>
                        </MoviePanel>
                })}
                </FlipMove>
            </div>
            
            <div className="loading" style={{display: moviesLoaded ? 'none': 'block'}}>
                <h1 style={{color:"#000"}}>Loading</h1>
                <Loader
                    type="Circles"
                    color="#000"
                    height={50}
                    width={50}
                />
            </div>
        </div>
    );
    
}

export default Game;

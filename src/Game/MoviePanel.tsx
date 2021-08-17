import React, { useState, forwardRef, createRef } from 'react';
import { IMovie } from './Game';
import posterPlaceholder from '../Images/movieplaceholder.png'; 
import {MdStar} from 'react-icons/md'

const {Textfit} = require('react-textfit');
const { getLangNameFromCode, getLangCodeList } = require('language-name-map')

interface MovieProps {
    movie: IMovie;
    isBlurred?: boolean;
    imageLoaded: any;
    children?: any;
    mode: string; 
}
var isReady = false;

const MoviePanel = forwardRef((props: MovieProps,ref: React.ForwardedRef<HTMLDivElement>)=> {//({movie}: {movie: IMovie}) {;
  const [isDisplayed, setIsDisplayed] = useState(false);
  var genres = props.movie.genres.split(',');
  var imagePath = `https://image.tmdb.org/t/p/original${props.movie.posterPath}`;
  var isPosterMissing = props.movie.posterPath == "" ? true : false;
  const titleRef = createRef<HTMLDivElement>();

  React.useEffect(() => { //Caches background image
    const img = new Image()
    img.src = imagePath;
    img.onload = () => {
      props.imageLoaded();
    }
  }, [])  //FIGURE OUT IF YOU NEED TO DO SOME .completed bullshit for cached images for the backgroundimages. (onload might not fire if already cached?)

  React.useEffect(() => { //Checks for width of title div to see if displayed
    const width = titleRef?.current?.getBoundingClientRect().width;
    if(width && width > 0) {
      setIsDisplayed(true);
    }
  }, [titleRef])

  function getModeData() {
    console.log(props.mode)
    if(props.mode == 'averageRating') {
      return (
      <h2><MdStar style={{color: 'gold', height:'40px', stroke:'black', strokeWidth:'.5px'}}/>
        {props.isBlurred ? <span className="ratingBlurred">8.8</span>
          :
          <span className="rating">{props.movie.averageRating}</span>
        } 
        /10
        </h2>
      );
    } else if(props.mode == 'runtimeMinutes') {
      return (
        <h2>Runtime:
        {props.isBlurred ? <span className="runtimeBlurred">888</span>
          :
          <span className="runtime">{props.movie.runtimeMinutes}</span>
        } 
        minutes
        </h2>
      );
    } else if(props.mode == 'startYear') {
      return (
        <h2>Release year: 
        {props.isBlurred ? <span className="runtimeBlurred">8888</span>
          :
          <span className="runtime">{props.movie.startYear}</span>
        } 
        
        </h2>
      );
    }
  }

  return(
    
    <div ref={ref} className="movie-panel" style={{
      backgroundImage: `url(${imagePath})`,
      backgroundSize: '100% 100%'
    }}>
      <div className="movie-header">
        <div ref={titleRef} className="movie-title">
          {isDisplayed ?
            <Textfit style={{ display: 'block', height: '100%' }} mode="multi" throttle={200}>
              {props.movie.primaryTitle} {props.mode == 'startYear' ? '': `(${props.movie.startYear})`}
            </Textfit>
            :
            'loading...'}
        </div>
         {genres.map(genre => '\t' + genre + ', ')}
         {getLangNameFromCode(props.movie.language).name}
      </div>

      <div className="movie-info">
        {getModeData()}
      </div>

      {props.children}

    </div>
  );
    }
);


export default MoviePanel;

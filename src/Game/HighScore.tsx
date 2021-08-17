import React, { useState } from 'react';


function HighScore(props: any){
  const [ratingHighs, setRatingHighs] = useState(JSON.parse(localStorage.getItem('highScores') || 'null'))

  React.useEffect(() => { 
    checkHighScore(props.score, props.mode)
}, [props.score]);

  function getDiff() {
    if(props.difficulty == 'Easy')
      return 0;
    else if(props.difficulty == 'Medium')
      return 1;
    else if(props.difficulty == 'Hard')
      return 2;
    else
      return -1;
  }

  function getIndex() {
    var index = getDiff();
    if(props.mode == 'runtimeMinutes')
      index += 3;
    else if(props.mode == 'startYear')
      index += 6;
    return index;
  }

  function checkHighScore(score: number, mode: string) {
    console.log('score: ' + score)
    var currHighScore = 0;
    var temp;
    var diff = getDiff();
    var index = getIndex();

    if(ratingHighs != null)
    {
      console.log(ratingHighs)
      currHighScore = parseInt(ratingHighs[index]);
    } else {
      var arr = new Array(9).fill(0);
      setRatingHighs(arr);
      localStorage.setItem('highScores', JSON.stringify(arr));
    }
    console.log(currHighScore);

    if(score > currHighScore) {
      var newScores = [
        ...ratingHighs.slice(0, index),
        score,
        ...ratingHighs.slice(index + 1)
      ]
      console.log('scores: ' + newScores);
      localStorage.setItem('highScores', JSON.stringify(newScores));
      setRatingHighs(newScores);
    }
}

  
  return (
    <div className="high-score">
        High Score: {ratingHighs ? ratingHighs[getIndex()] : '0'}
    </div>
  );
    
}

export default HighScore;

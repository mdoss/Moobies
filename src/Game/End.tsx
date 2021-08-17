import React, { useState } from 'react';
import logo from './logo.svg';
import {Button, FormControl, InputLabel, makeStyles, MenuItem, Select} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(3),
    margin: theme.spacing(2),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));


function End(props: any){
  const classes = useStyles();
    return (
    <div className="MainMenu">

      <h1>You lost man.........</h1>
      <h2>Score: {props.score}</h2>
          <Button variant="contained" color="secondary" size="large" onClick={props.handlePlay}>Replay</Button>

          <div>
          <FormControl className={classes.formControl} color="secondary">
    <InputLabel shrink id="demo-simple-select-placeholder-label-label">
          Difficulty
        </InputLabel>
        <Select
          labelId="demo-simple-select-placeholder-label-label"
          id="demo-simple-select-placeholder-label"
          value={props.difficulty}
          onChange={props.handleDifficulty}
          displayEmpty
          className={classes.selectEmpty}
        >
          <MenuItem value={'Easy'}>Easy</MenuItem>
          <MenuItem value={'Medium'}>Medium</MenuItem>
          <MenuItem value={'Hard'}>Hard</MenuItem>
        </Select>
    </FormControl>
    <FormControl className={classes.formControl} color="secondary">
    <InputLabel shrink id="demo-simple-select-placeholder-label-label">
          Mode
        </InputLabel>
        <Select
          labelId="demo-simple-select-placeholder-label-label"
          id="demo-simple-select-placeholder-label"
          value={props.mode}
          onChange={props.handleMode}
          displayEmpty
          className={classes.selectEmpty}
        >
          <MenuItem value={'averageRating'}>Rating</MenuItem>
          <MenuItem value={'runtimeMinutes'}>Runtime</MenuItem>
          <MenuItem value={'startYear'}>Release Year</MenuItem>
        </Select>
    </FormControl>
    </div>
    </div>
  );
    
}

export default End;

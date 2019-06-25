import React from 'react'
import GameField from './GameField'
import ScoreField from "./ScoreField"
import GameFactory from '../Games/GameFactory';
import "./Game.css";


export default class GameContainer extends React.Component {
    constructor(props) {
        super(props);
        this.factory = this.factory ? this.factory : new GameFactory();
        this.game = this.factory.createGameByName(props.gameName);
        this.state = this.game.getEmptyState();
    }

    onTick(gameState) {
        this.setState(gameState);
    }

    onDefeat(gameState) {
        this.setState(gameState);
    }

    onKeyPress(event) {
        if (event.keyCode === 27) {
            this.game.onReset();
        }
        else if (event.keyCode === 80) {
            this.game.onPause();
        }
        else if (event.keyCode === 32) {
            this.game.onAction();
        }
        else if (event.keyCode === 37) {
            this.game.onArrowLeft();
        }
        else if (event.keyCode === 38) {
            this.game.onArrowUp()
        }
        else if (event.keyCode === 39) {
            this.game.onArrowRight();
        }
        else if (event.keyCode === 40) {
            this.game.onArrowDown();
        }

        event.preventDefault();
    }

    render() {
        return (
            <div tabIndex="-1" className="App-gameContainer" onKeyPress={this.onKeyPress}>
                <GameField fieldState={this.state.fieldState}></GameField>
                <ScoreField score={this.state.score}></ScoreField>
            </div>
        )
    }
}
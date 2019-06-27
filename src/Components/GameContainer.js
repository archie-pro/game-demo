import React from 'react'
import GameField from './GameField'
import ScoreField from "./ScoreField"
import GameFactory from '../Games/GameFactory';
import "./Game.css";


export default class GameContainer extends React.Component {
    constructor(props) {
        super(props);
        if (!this.state) {
            this.state = {};
            this.state.factory = new GameFactory();
            this.state.game = this.state.factory.createGameByName(props.gameName);
            let gameState = this.state.game.getEmptyState();
            this.state.fieldState = gameState.fieldState;
            this.state.score = gameState.score;
            this.state.controlState = "start";
        }

    }

    onControlButtonClick() {
        if (this.state.controlState === "start") {
            this.state.game.onStart(
                (gameState) => this.onTick(gameState),
                (gameState) => this.onDefeat(gameState));
            this.setState({ controlState: null });
        }
    }

    onTick(gameState) {
        this.setState(gameState);
    }

    onDefeat(gameState) {
        this.setState(gameState);
        this.setState({ controlState: "start" });
    }

    onKeyDown(event) {
        const game = this.state.game;
        if (event.keyCode === 27) {
            game.onReset();
            this.setState({ controlState: "start" });
        }
        else if (event.keyCode === 80) {
            game.onPause();
        }
        else if (event.keyCode === 32) {
            game.onAction();
        }
        else if (event.keyCode === 65) {
            game.onArrowLeft();
        }
        else if (event.keyCode === 87) {
            game.onArrowUp()
        }
        else if (event.keyCode === 68) {
            game.onArrowRight();
        }
        else if (event.keyCode === 83) {
            game.onArrowDown();
        }

        event.preventDefault();
    }

    render() {
        return (
            <div tabIndex="-1" className="App-gameContainer" onKeyDown={(event) => this.onKeyDown(event)}>
                <GameField fieldState={this.state.fieldState}>
                    <StartButton isVisible={this.state.controlState} onClick={() => this.onControlButtonClick()}></StartButton>
                </GameField>
                <ScoreField score={this.state.score}></ScoreField>
            </div>
        )
    }
}

class StartButton extends React.Component {
    render() {
        return (
            <div onClick={this.props.onClick} className={`App-controlButton ${this.props.isVisible ? 'startButton ' : ''}`} />
        )
    }
}
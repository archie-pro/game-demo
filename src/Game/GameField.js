import React from 'react'
import "./Game.css"

export default class GameField extends React.Component {

    createGameField(fieldState) {

    }

    render() {
        const gameFieldWidth = 10;
        const gameFieldHeight = 20;

        return (
            <div className="App-gameField">
                {this.createGameField()}
            </div>
        );
    }
}

class Square extends React.Component {
    render() {
        return (
            <div className="App-gameFieldSquare"></div>
        )
    }
}
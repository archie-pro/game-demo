import React from 'react'
import "./Game.css"

export default class GameField extends React.Component {

    createGameField(fieldState) {
        return fieldState.map((value, indexI) => <div className="App-gameFieldRow" key={indexI}>
            {value.map((e, indexJ) => <Square isActive={e} key={"" + indexI + indexJ} />)}
        </div>)
    }

    render() {
        return (
            <div className="App-gameField" onKeyDown={() => alert("123")}>
                {this.props.children}
                {this.createGameField(this.props.fieldState)}
            </div>
        );
    }
}

class Square extends React.Component {
    render() {
        return (
            <div className={`App-gameFieldSquare ${this.props.isActive ? 'active ' : ''}`}></div>
        )
    }
}

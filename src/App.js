import React from 'react';
import Header from './Shared/Header';
import Footer from './Shared/Footer'
import GameContainer from './Components/GameContainer'
import './App.css';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { gameName: "tetris" }
    }

    render() {
        return (
            <div className="App">
                <div className="App-body">
                    <Header />
                    <GameContainer game={this.state.gameName} />
                    <Footer />
                </div>
            </div>
        );
    }
}

export default App;

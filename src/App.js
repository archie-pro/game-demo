import React from 'react';
import Header from './Shared/Header';
import Footer from './Shared/Footer'
import Game from './Game/Game'
import './App.css';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { gameName: "Stub" }

    }
    render() {
        return (
            <div className="App" >
                <div className="App-body">
                    <Header />
                    <Game game={this.state.gameName} />
                    <Footer />
                </div>
            </div>
        );
    }
}

export default App;

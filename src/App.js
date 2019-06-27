import React from 'react';
import Header from './Shared/Header';
import Footer from './Shared/Footer'
import GameContainer from './Components/GameContainer'
import './App.css';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { gameName: "racing" }
    }

    render() {
        return (
            <div className="App">
                <div className="App-body">
                    <Header />
                    <GameContainer gameName={this.state.gameName} />
                    <Footer />
                </div>
            </div>
        );
    }
}

export default App;

import Tetris from "./Tetris";
import Racing from "./Racing";
import Tanks from "./Tanks";
import StubGame from "./StubGame";

export default class GameFactory {
    createGameByName(gameName) {
        if (gameName === "tetris")
            return new Tetris();
        else if (gameName === "racing")
            return new Racing();
        else if (gameName === "tanks")
            return new Tanks();
        else
            return new StubGame();
    }
}
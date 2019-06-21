import { GAME_FIELD_COLUMN_COUNT, GAME_FIELD_ROW_COUNT, getDefaultState } from './StubGame'

const TICKS_TO_FIGURE_DROP = 10;

export default class Tetris {

    constructor() {
        this._tetrisFigures = [
            {
                letter: "I",
                points: [
                    { x: 0, y: 0 },
                    { x: 0, y: -1 },
                    { x: 0, y: -2 },
                    { x: 0, y: -3 }
                ]
            },
            {
                letter: "J",
                points: [
                    { x: 0, y: 0 },
                    { x: 1, y: 0 },
                    { x: 1, y: -1 },
                    { x: 1, y: -2 }
                ]
            },
            {
                letter: "L",
                points: [
                    { x: 0, y: 0 },
                    { x: 0, y: -1 },
                    { x: 0, y: -2 },
                    { x: 1, y: 0 }
                ]
            },
            {
                letter: "O",
                points: [
                    { x: 0, y: 0 },
                    { x: 0, y: -1 },
                    { x: 1, y: 0 },
                    { x: 1, y: -1 }
                ]
            },
            {
                letter: "S",
                points: [
                    { x: -1, y: 0 },
                    { x: 0, y: 0 },
                    { x: 0, y: -1 },
                    { x: 1, y: -1 }
                ]
            },
            {
                letter: "T",
                points: [
                    { x: -1, y: 0 },
                    { x: 0, y: 0 },
                    { x: 1, y: 0 },
                    { x: 0, y: -1 }
                ]
            },
            {
                letter: "Z",
                points: [
                    { x: -1, y: -1 },
                    { x: 0, y: 0 },
                    { x: 0, y: -1 },
                    { x: 1, y: 0 }
                ]
            }];
    }

    onStart(updateCallback) {
        const intervalTime = 100;
        this._initiateGame();

        this._timerId = setInterval(() => { this._onTick(updateCallback) }, intervalTime);
    }

    onPause() {
        clearInterval(this._timerId);
    }

    onReset() {
        clearInterval(this._timerId);

    }

    onArrowUp() { }

    onArrowDown() {
        this._userInput.moveAxisY++;
    }

    onArrowLeft() {
        this._userInput.moveAxisX--;
    }

    onArrowRight() {
        this._userInput.moveAxisX++;
    }

    onAction() {
        this._userInput.actionButton++;
    }

    getEmptyState() {
        return getDefaultState();
    }

    _initiateGame() {
        const defaultState = this._getEmptyState();
        this._gameField = defaultState.fieldState;
        this._score = defaultState.score;
        this._userInput = this.getEmptyUserInputs();
        this._figureCoordinates = this._getNextFigure();
        this._ticksToDrop = TICKS_TO_FIGURE_DROP;
    }

    _onTick(updateCallback) {
        let figure = this._figureCoordinates;
        const moves = this._getNormalizedMovesByUserInput(this._userInput);
        this._userInput = this._getEmptyUserInputs();

        figure = this._updateFigureCoordinates(figure, moves);
    }

    _getEmptyUserInputs() {
        return { moveAxisX: 0, moveAxisY: 0, actionButton: 0 };
    }

    _getGameFieldPrint() {

    }

    _getNextFigure() {
        const figuresCount = this._tetrisFigures.length;
        const figure = this._tetrisFigures[Math.floor(Math.random() * figuresCount)];
        return this._getFigureCoordinates(figure);
    }

    _getFigureCoordinates(figure) {
        const indentX = Math.floor(GAME_FIELD_COLUMN_COUNT / 2);
        return figure.points.map(p => ({ x: p.x + indentX, y: p.y }));
    }

    _updateFigureCoordinates(figure, moves) {
        let updatedFigure = this._moveFigure(figure, { x: moves.x, y: moves.y });
        updatedFigure = this._rotateFigure(updatedFigure, moves.rotation);
    }

    _dropFigure(figure) {
        return this._moveFigure(figure, { x: 0, y: 1 })
    }

    _rotateFigure(figure, rotation) {
        if (!rotation) {
            return figure;
        }
    }

    _moveFigure(figure, moves) {
        if (!moves.x && !moves.y) {
            return figure;
        }
        let updatedFigure = figure.map(p => ({ x: p.x + moves.x, y: p.y + moves.y }));

    }



    _getNormalizedMovesByUserInput(userInput) {
        const maxXMove = GAME_FIELD_COLUMN_COUNT - 1;
        const maxYMove = GAME_FIELD_ROW_COUNT - 1;
        const maxRotatedPostition = 4;
        const moveX = userInput.moveAxisX > maxXMove
            ? maxXMove
            : userInput.moveAxisX < -maxXMove
                ? -maxXMove
                : userInput.moveAxisX;
        const moveY = userInput.moveAxisY > maxYMove
            ? maxYMove
            : userInput.moveAxisY < 0
                ? 0
                : userInput.moveAxisY;

        return {
            x: moveX,
            y: moveY,
            rotation: userInput.actionButton % maxRotatedPostition
        };
    }
}
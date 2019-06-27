import { GAME_FIELD_COLUMN_COUNT, GAME_FIELD_ROW_COUNT, getDefaultState } from './StubGame';
import { rotateFigureClockwise } from './Common/Matrix';
import Point from './Common/Point';

const TICKS_TO_FIGURE_DROP = 20;
const MAX_LEVEL = 15;
const TICK_INTERVAL = 50;
const ADDITIONAL_ROWS = 4;

export default class Tetris {

    constructor() {
        this._tetrisFigures = [
            {
                letter: "I",
                points: [
                    new Point(0, 0),
                    new Point(0, -1),
                    new Point(0, -2),
                    new Point(0, -3),
                ]
            },
            {
                letter: "J",
                points: [
                    new Point(0, 0),
                    new Point(1, 0),
                    new Point(1, 1),
                    new Point(1, 2),
                ]
            },
            {
                letter: "L",
                points: [
                    new Point(0, 0),
                    new Point(0, -1),
                    new Point(0, -2),
                    new Point(1, 0),
                ]
            },
            {
                letter: "O",
                points: [
                    new Point(0, 0),
                    new Point(0, -1),
                    new Point(1, 0),
                    new Point(1, -1),
                ]
            },
            {
                letter: "S",
                points: [
                    new Point(-1, 0),
                    new Point(0, 0),
                    new Point(0, -1),
                    new Point(1, -1),
                ]
            },
            {
                letter: "T",
                points: [
                    new Point(-1, 0),
                    new Point(0, 0),
                    new Point(1, 0),
                    new Point(0, -1),
                ]
            },
            {
                letter: "Z",
                points: [
                    new Point(-1, -1),
                    new Point(0, 0),
                    new Point(0, -1),
                    new Point(1, 0),
                ]
            }];
    }

    onStart(updateCallback, defeatCallback) {
        this._initiateGame();
        this._updateCallback = updateCallback;
        this._defeatCallback = defeatCallback;
        this._timerId = setInterval(() => { this._onTick() }, TICK_INTERVAL);
    }

    onPause() {
        this._pauseGame();
    }

    onReset() {
        this._resetGame();
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
        const defaultState = this.getEmptyState();
        this._gameField = this._createGameField();
        this._score = defaultState.score;
        this._userInput = this._getEmptyUserInputs();
        this._figureCoordinates = this._getNextFigure();
        this._ticksToDrop = this._getTicksToDrop();
    }

    _resetGame() {
        clearInterval(this._timerId);
        const defaultState = this.getEmptyState();
        this._gameField = defaultState.fieldState;
        this._score = defaultState.score;
        this._userInput = null;
        this._figureCoordinates = null;
        this._ticksToDrop = 0;
        this._updateCallback(defaultState);
    }

    _pauseGame() {
        if (!this._isPause) {
            clearInterval(this._timerId);
            this._isPause = true;
        }
        else {
            this._userInput = this._getEmptyUserInputs();
            this._timerId = setInterval(() => { this._onTick() }, TICK_INTERVAL);
            this._isPause = false;
        }
    }

    _onTick() {
        let moves = this._normailzeMovesByUserInput(this._userInput);
        this._userInput = this._getEmptyUserInputs();

        let gameField = this._gameField;
        let figure = this._figureCoordinates;
        let needDropLines = false;
        let score = { figure: false, rowCount: 0 };

        if (this._ticksToDrop === 0) {
            needDropLines = this._doFullLinesExist(gameField);
            if (needDropLines) {
                let rowCount = this._dropFullLines(gameField);
                score.rowCount = rowCount;
                needDropLines = this._doFullLinesExist(gameField);
            }
            moves = this._updateMovesToDropFigure(moves);
            this._ticksToDrop = this._getTicksToDrop();
        }
        else {
            this._ticksToDrop--;
        }


        figure = this._updateFigureCoordinates(figure, moves, gameField);

        const isFigureBlocked = this._isFigureIsBlocked(figure, gameField);
        if (isFigureBlocked) {
            this._blockFigureOnGameField(figure, gameField);
            score.figure = true;
            figure = this._getNextFigure();
            needDropLines = this._doFullLinesExist(gameField);
            score.figure = true;
        }

        this._figureCoordinates = figure;
        this._updateScoreAndLevel(score);

        let isDefeatState = isFigureBlocked && !needDropLines && this._checkDefeatStatement(this._gameField);
        this._processIsDefeatState(isDefeatState);
    }

    _processIsDefeatState(isDefeatState) {
        const state = {
            fieldState: this._getGameFieldPrint(),
            score: this._score
        }
        if (!isDefeatState) {
            this._updateCallback(state);
        }
        else {
            this.onPause();
            this._defeatCallback(state);
        }
    }

    _updateScoreAndLevel(state) {
        const POINTS_OF_FIGURE = 4;
        const POINTS_OF_ROW = 10;
        if (state.figure) {
            this._score.points += POINTS_OF_FIGURE;
        }
        if (state.rowCount) {
            this._score.points += state.rowCount * POINTS_OF_ROW;
        }
        let level = Math.floor(this._score.points / 100);
        this._score.level = level < MAX_LEVEL
            ? level
            : MAX_LEVEL;
    }

    _getTicksToDrop() {
        return TICKS_TO_FIGURE_DROP - this._score.level;
    }

    _createGameField() {
        let gameField = Array(GAME_FIELD_COLUMN_COUNT).fill(false)
            .map(e => Array(GAME_FIELD_ROW_COUNT).fill(false));
        gameField.forEach(column => {
            for (let i = 1; i <= ADDITIONAL_ROWS; i++) {
                column[-i] = false;
            }
        });

        return gameField;
    }

    _getEmptyUserInputs() {
        return { moveAxisX: 0, moveAxisY: 0, actionButton: 0 };
    }

    _getGameFieldPrint() {
        let fieldState = this._gameField.map(column => column.map(point => point))
        this._figureCoordinates.forEach(point => {
            if (point.x >= 0 && point.y >= 0) {
                fieldState[point.x][point.y] = true;
            }
        });
        return fieldState
    }

    _getNextFigure() {
        const figuresCount = this._tetrisFigures.length;
        const figure = this._tetrisFigures[Math.floor(Math.random() * figuresCount)];
        return this._getInitialFigureCoordinates(figure);
    }

    _getInitialFigureCoordinates(figure) {
        const indentX = Math.floor(GAME_FIELD_COLUMN_COUNT / 2);
        return figure.points.map(p => new Point(p.x + indentX, p.y - 1));
    }

    _updateFigureCoordinates(figure, moves, gameField) {
        let updatedFigure = this._makeSafetyMove(this._rotateFigure(figure, moves.rotation), figure, gameField);
        updatedFigure = this._makeSafetyMove(this._moveFigure(updatedFigure, new Point(moves.x, 0)), updatedFigure, gameField);
        updatedFigure = this._makeSafetyMove(this._moveFigure(updatedFigure, new Point(0, moves.y)), updatedFigure, gameField);
        return updatedFigure;
    }

    _updateMovesToDropFigure(moves) {
        moves.y++;
        return moves;
    }

    _rotateFigure(figure, rotation) {
        if (!rotation) {
            return figure;
        }
        return rotateFigureClockwise(figure, rotation);
    }

    _moveFigure(figure, moves) {
        if (moves.isZero()) {
            return figure;
        }

        return figure.map(p => p.add(moves));
    }

    _isFigureIsBlocked(figure, gameField) {
        return figure.findIndex(
            point => {
                const isFigureOnFieldBottom = point.y === GAME_FIELD_ROW_COUNT - 1;
                const isFigureOnWallBlock = gameField[point.x][point.y + 1];
                return isFigureOnFieldBottom || isFigureOnWallBlock;
            }
        ) !== -1
    }

    _makeSafetyMove(updatedFigure, figure, gameField) {
        updatedFigure = this._normalizeFigure(updatedFigure);
        return !this._isFigureIsStuck(updatedFigure, gameField)
            ? updatedFigure
            : figure;
    }

    _isFigureIsStuck(figure, gameField) {
        return figure.findIndex(
            point => {
                const isFigureInWallBlock = gameField[point.x][point.y]
                return isFigureInWallBlock;
            }
        ) !== -1
    }

    _normalizeFigure(figure) {
        figure = this._normalizeFigureAlongX(figure);
        figure = this._normalizeFigureAlongY(figure);
        return figure;
    }

    _normalizeFigureAlongX(figure) {
        const figureMaxX = Math.max.apply(null, figure.map(point => point.x));
        const figureMinX = Math.min.apply(null, figure.map(point => point.x));
        let diffX = 0;
        if (figureMaxX > GAME_FIELD_COLUMN_COUNT - 1) {
            diffX = GAME_FIELD_COLUMN_COUNT - 1 - figureMaxX;
        }
        else if (figureMinX < 0) {
            diffX = -figureMinX;
        }
        return diffX
            ? figure.map(point => point.add(new Point(diffX, 0)))
            : figure;
    }

    _normalizeFigureAlongY(figure) {
        const figureMaxY = Math.max.apply(null, figure.map(point => point.y));

        if (figureMaxY > GAME_FIELD_ROW_COUNT - 1) {
            let diffY = GAME_FIELD_ROW_COUNT - 1 - figureMaxY;
            figure = figure.map(point => point.add(new Point(0, diffY)));
        }

        return figure
    }

    _blockFigureOnGameField(figure, gameField) {
        figure.forEach(point => gameField[point.x][point.y] = true);
    }

    _normailzeMovesByUserInput(userInput) {
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
            rotation: (userInput.actionButton % maxRotatedPostition) * 90
        };
    }

    _doFullLinesExist(gameField) {
        for (let i = 0; i < GAME_FIELD_ROW_COUNT; i++) {
            if (this._isRowFull(gameField, i)) {
                return true;
            }
        }
        return false;
    }

    _dropFullLines(gameField) {
        let count = 0;
        for (let i = 0; i < GAME_FIELD_ROW_COUNT; i++) {
            if (this._isRowFull(gameField, i)) {
                count++;
                this._clearRow(gameField, i);
            }
        }
        this._dropBlocks(gameField);
        return count;
    }

    _isRowFull(gameField, rowIndex) {
        return gameField.every(column => column[rowIndex]);
    }

    _clearRow(gameField, rowIndex) {
        return gameField.forEach(column => column[rowIndex] = false);
    }

    _dropBlocks(gameField) {
        gameField.forEach(column => {
            let lastClearIndex = GAME_FIELD_ROW_COUNT - 1;
            for (let columnIndex = GAME_FIELD_ROW_COUNT - 1; columnIndex >= 0; columnIndex--) {
                if (column[columnIndex]) {
                    column[columnIndex] = false;
                    column[lastClearIndex] = true;
                    lastClearIndex--;
                }
            }
        });
    }

    _checkDefeatStatement(gameField) {
        for (let i = 0; i < GAME_FIELD_COLUMN_COUNT; i++) {
            if (gameField[i][-1]) {
                return true;
            }
        }
        return false;
    }
}
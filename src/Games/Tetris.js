import { GAME_FIELD_COLUMN_COUNT, GAME_FIELD_ROW_COUNT, getDefaultState } from './StubGame';
import { rotateFigureClockwise } from './Common/Matrix';
import Point from './Common/Point';

const TICKS_TO_FIGURE_DROP = 20;
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

        this._timerId = setInterval(() => { this._onTick(updateCallback, defeatCallback) }, TICK_INTERVAL);
    }

    onPause() {
        clearInterval(this._timerId);
    }

    onReset() {
        clearInterval(this._timerId);

    }

    onArrowUp() { }

    onArrowDown() {
        //this._userInput.moveAxisY++;
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
        this._ticksToDrop = TICKS_TO_FIGURE_DROP;
        this._linesWasCleared = false;
    }

    _onTick(updateCallback, defeatCallback) {
        const moves = this._getNormalizedMovesByUserInput(this._userInput);
        this._userInput = this._getEmptyUserInputs();

        let figure = this._figureCoordinates;
        if (this._ticksToDrop === 0) {
            figure = this._dropFigure(figure);
            this._ticksToDrop = TICKS_TO_FIGURE_DROP;
        }
        else {
            this._ticksToDrop--;
        }
        figure = this._updateFigureCoordinates(figure, moves);

        const buildingLine = this._getBuildingLine(this._gameField);
        const isFigureBlocked = this._checkFigureIsBlocked(figure, buildingLine);
        if (isFigureBlocked) {
            figure = this._normalizeFigureAlongY(figure, buildingLine);
            this._blockFigureOnGameField(figure);
            this._linesWasCleared = this._dropFullLines(this._gameField);
            this._figureCoordinates = this._getNextFigure();
        } else if (this._linesWasCleared) {
            this._linesWasCleared = this._dropFullLines(this._gameField)
        }

        if (isFigureBlocked && !this._linesWasCleared && this._checkDefeatStatement(this._gameField)) {
            this.onReset();
            defeatCallback({
                fieldState: this._getGameFieldPrint(),
                score: this._score
            });
        }
        else {
            updateCallback({
                fieldState: this._getGameFieldPrint(),
                score: this._score
            });
        }
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
            if (point.x > 0 && point.y > 0) {
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
        return figure.points.map(p => new Point(p.x + indentX, p.y));
    }

    _dropFigure(figure) {
        this._moveFigure(figure, new Point(0, 1));
    }

    _updateFigureCoordinates(figure, moves) {
        let updatedFigure = this._rotateFigure(figure, moves.rotation);
        updatedFigure = this._moveFigure(updatedFigure, new Point(moves.x, moves.y));
        return this._normalizeFigureAlongX(updatedFigure);
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

    _normalizeFigureAlongX(figure) {
        let maxX = GAME_FIELD_COLUMN_COUNT - 1;
        let minX = 0;
        for (let i = 0; i < figure.length; i++) {
            if (figure[i].x > maxX) {
                maxX = figure[i].x
            }
            else if (figure[i].x < minX) {
                minX = figure[i].x
            }
        }
        if (maxX > GAME_FIELD_COLUMN_COUNT - 1) {
            let diffX = maxX - (GAME_FIELD_COLUMN_COUNT - 1)
            figure = figure.map(point => point.substitute(new Point(diffX, 0)));
        }
        else if (minX < 0) {
            figure = figure.map(point => point.substitute(new Point(minX, 0)));
        }

        return figure;
    }

    _checkFigureIsBlocked(figure, buildingLine) {
        return !figure.every((point, index) => buildingLine[figure[index].x].y > point.y + 1);
    }

    _normalizeFigureAlongY(figure, buildingLine) {
        let offsetY = 0;
        for (let i = 0; i < figure.length; i++) {
            if (figure[i].y - buildingLine[figure[i].x].y > offsetY - 1) {
                offsetY = figure[i].y - buildingLine[figure[i].x].y + 1;
            }
        }
        if (offsetY) {
            return figure.map(point => point.add(new Point(0, offsetY)));
        }

        return figure
    }

    _getBuildingLine(gameField) {
        return gameField.map(
            (row, index) => new Point(index, row.indexOf(true))
        );
    }

    _blockFigureOnGameField(figure, gameField) {
        figure.forEach(point => gameField[point.x][point.y] = true);
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
            rotation: (userInput.actionButton % maxRotatedPostition) * 90
        };
    }

    _dropFullLines(gameField) {
        let isClear = false;
        for (let i = 0; i < GAME_FIELD_ROW_COUNT; i++) {
            if (this._isRowFull(gameField, i)) {
                this._clearRow(gameField, i);
                isClear = true;
            }
        }
        if (isClear) {
            this._dropBlocks(gameField);
            return true;
        }
        return false;
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
        for (let i = 0; i < GAME_FIELD_ROW_COUNT; i++) {
            if (gameField[-1][i]) {
                return true;
            }
        }
        return false;
    }
}
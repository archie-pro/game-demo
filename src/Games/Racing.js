import { GAME_FIELD_COLUMN_COUNT, GAME_FIELD_ROW_COUNT, getDefaultState } from './StubGame';
import { rotateFigureClockwise } from './Common/Matrix';
import Point from './Common/Point';

const TICK_INTERVAL = 50;
const LINES_COUNT = 3;
const CAR_LENGTH = 4;
const ADDITIONAL_ROWS = 4;
const TICKS_TO_CAR_DROP = 10;

export default class Racing {

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

    onArrowUp() {
        this._userInput.moveAxisY++;
    }

    onArrowDown() {
    }

    onArrowLeft() {
        this._userInput.moveAxisX--;
    }

    onArrowRight() {
        this._userInput.moveAxisX++;
    }

    onAction() {
    }

    getEmptyState() {
        return getDefaultState();
    }

    _resetGame() {
        clearInterval(this._timerId);
        const defaultState = this.getEmptyState();
        this._gameField = defaultState.fieldState;
        this._score = defaultState.score;
        this._userInput = null;
        this.userCar = null;
        this._gameCars = null;
        this._ticksToDrop = 0;
        this._updateCallback(defaultState);
    }

    _pauseGame() {
        if (!this._isPause) {
            clearInterval(this._timerId);
            this._isPause = true;
        }
        else {
            this._userInput = this._getEmptyUserInput();
            this._timerId = setInterval(() => { this._onTick() }, TICK_INTERVAL);
            this._isPause = false;
        }
    }

    _initiateGame() {
        const defaultState = this.getEmptyState();
        this._gameField = this._createGameField();
        this._score = defaultState.score;
        this._userInput = this._getEmptyUserInput();
        this._userCar = new Car(1, GAME_FIELD_ROW_COUNT - CAR_LENGTH);
        this._gameCars = this._getNewCars(1, []);
        this._ticksToDrop = this._getTicksToDrop();
    }

    _onTick() {
        let move = this._processUserInput(this._userInput, this._userCar);
        this._userInput = this._getEmptyUserInput();

        this._userCar = this._updateUserCarPoistion(this._userCar, move.x);

        if (this._ticksToDrop === 0) {
            this._dropCars(this._gameCars, 1);
            this._deleteOvertookCars(this._gameCars);
            if (this._isNewCarsNeeded(this._gameCars)) {
                this._addNewCars(this._gameCars);
            }
            this._ticksToDrop = this._getTicksToDrop();
        }
        else {
            this._ticksToDrop--;
        }

        this._updateScore();

        let isCrash = this._checkIfCrash(this._userCar, this._gameCars);
        this._processIsCrashState(isCrash);
    }

    _checkIfCrash(userCar, gameCars) {
        let crashedCarIndex = gameCars.findIndex(
            car => car.line === userCar.line
                && (car.offsetY > userCar.offsetY - CAR_LENGTH
                    && car.offsetY < GAME_FIELD_ROW_COUNT));
        return crashedCarIndex !== -1;
    }

    _processIsCrashState(isCrash) {
        const state = {
            fieldState: this._getGameFieldPrint(),
            score: this._score
        }
        if (!isCrash) {
            this._updateCallback(state);
        }
        else {
            this.onPause();
            this._defeatCallback(state);
        }
    }

    _getGameFieldPrint() {
        let allCars = this._gameCars.filter(() => true);
        allCars.push(this._userCar);
        let fieldState = getDefaultState().fieldState;
        allCars.forEach(car => {
            this._drawCar(car, fieldState);
        });

        return fieldState;
    }

    _updateScore() {
        this._score.points += 1;
    }

    _addNewCars(cars) {
        const maxCreatedCars = LINES_COUNT;
        let carsCount = Math.floor(Math.random() * maxCreatedCars);
        this._getNewCars(carsCount, cars);
    }

    _getNewCars(count, cars) {
        for (let i = 0; i < count; i++) {
            cars.push(new Car(this._getNextCarLine(), -CAR_LENGTH));
        }
        return cars;
    }

    _getNextCarLine() {
        return Math.floor(Math.random() * LINES_COUNT);
    }

    _getTicksToDrop() {
        return TICKS_TO_CAR_DROP;
    }

    _dropCars(cars, offsetY) {
        cars.forEach(car => car.offsetY += offsetY);
    }

    _deleteOvertookCars(cars) {
        cars.filter(car => car.offsetY <= GAME_FIELD_ROW_COUNT);
    }

    _isNewCarsNeeded(cars) {
        return cars.length === 0 || cars.every(car => car.offsetY >= CAR_LENGTH);
    }

    _getEmptyUserInput() {
        return {
            moveAxisX: 0,
            moveAxisY: 0
        }
    }

    _processUserInput(userInput, userCar) {
        let maxXOffset = LINES_COUNT - 1 - userCar.line;
        let minXOffset = -userCar.line;
        let move = {};
        move.x = userInput.moveAxisX > maxXOffset
            ? maxXOffset
            : userInput.moveAxisX < minXOffset
                ? minXOffset
                : userInput.moveAxisX;
        move.y = userInput.moveAxisY > GAME_FIELD_ROW_COUNT
            ? GAME_FIELD_ROW_COUNT
            : userInput.moveAxisY;
        return move;
    }

    _createGameField() {
        return Array(LINES_COUNT).fill(false)
            .map(e => Array(GAME_FIELD_ROW_COUNT).fill(false));
    }

    _updateUserCarPoistion(userCar, offsetX) {
        this._userCar.line += offsetX;
        return userCar;
    }

    _drawCar(car, fieldState) {
        const CAR = [
            new Point(1, 0),
            new Point(1, 1),
            new Point(1, 2),
            new Point(0, 1),
            new Point(0, 3),
            new Point(2, 1),
            new Point(2, 3)
        ]
        let offset = new Point(car.line * 3, car.offsetY);
        CAR.forEach(point => {
            let updatedPoint = point.add(offset);
            if (updatedPoint.y < GAME_FIELD_ROW_COUNT) {
                fieldState[updatedPoint.x][updatedPoint.y] = true;
            }
        });
    }
}

class Car {
    constructor(line = 0, offsetY = 0) {
        this.line = line;
        this.offsetY = offsetY;
    }
}
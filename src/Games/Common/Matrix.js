import Point from "./Point";

export function rotateFigureClockwise(figure, angle) {
    let rotaionMatrix;
    if (angle === 90) {
        rotaionMatrix = [
            [0, 1],
            [-1, 0]
        ];
    }
    else if (angle === 180) {
        rotaionMatrix = [
            [-1, 0],
            [0, -1]
        ]
    }
    else if (angle === 270) {
        rotaionMatrix = [
            [0, -1],
            [1, 0]
        ];
    }
    else {
        return figure;
    }

    const rotationPoint = findRotationPoint(figure);

    let updatedFigure = figure.map(point => rotatePoint(point, rotationPoint, rotaionMatrix));

    const updatedRotationPoint = findRotationPoint(updatedFigure);

    let pointDiff = updatedRotationPoint.substitute(rotatePoint);

    return updatedFigure.map(point => point.substitute(pointDiff));
}

function findRotationPoint(figure) {
    let index = 0;
    let length = 0;
    for (let i = 0; i < figure.length; i++) {
        let pointLength = figure[i].getSquareLength();
        if (pointLength > length) {
            index = i;
            pointLength = length;
        }
    }
    return figure[index];
}

function rotatePoint(point, rotationPoint, rotationMatrix) {
    let tempPoint = point.substitute(rotationPoint);
    let result = new Point(
        tempPoint.x * rotationMatrix[0][0] + tempPoint.y * rotationMatrix[0][1],
        tempPoint.x * rotationMatrix[1][0] + tempPoint.y * rotationMatrix[1][1]
    );
    return result.add(rotationPoint);
}

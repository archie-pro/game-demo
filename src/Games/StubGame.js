export const GAME_FIELD_COLUMN_COUNT = 10;
export const GAME_FIELD_ROW_COUNT = 20
export function getDefaultState() {

    return {
        fieldState: Array(GAME_FIELD_COLUMN_COUNT).fill(false)
            .map(e => Array(GAME_FIELD_ROW_COUNT).fill(false)),
        score: {
            points: 0,
            level: 0
        }
    };
}

export default class StubGame {
    getEmptyState() {
        return getDefaultState();
    }
}
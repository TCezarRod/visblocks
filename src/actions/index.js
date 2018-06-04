import { 
    MOVE_ARROW_END, 
    MOVE_ARROW_START,
    ADD_ARROW,
    DELETE_ARROW,
    MOVE_BLOCK
} from "../constants/action-types";

export const moveArrowEnd = (id, position) => ({ type: MOVE_ARROW_END, payload: {...position, id:id} });
export const moveArrowStart = (id, position) => ({ type: MOVE_ARROW_START, payload: {...position, id:id} });
export const addArrow = arrow => ({ type: ADD_ARROW, payload: {arrow: arrow} });
export const deleteArrow = id => ({ type: DELETE_ARROW, payload: {id: id} });
export const moveBlock = (id, props) => ({ type: MOVE_BLOCK, payload: {id: id, props: props} });
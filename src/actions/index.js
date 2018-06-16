import { 
    MOVE_ARROW_END, 
    MOVE_ARROW_START,
    ADD_ARROW,
    DELETE_ARROW,
    MOVE_BLOCK,
    CREATE_BLOCK,
    DELETE_BLOCK,
    UPDATE_DATA,
    START_CONNECT,
    FINISH_CONNECT,
    SELECT_BLOCK,
    INITIALIZE_OPTIONS,
    UPDATE_ATTRIBUTE_VALUES,
    UPDATE_ATTRIBUTE_SELECTION
} from "../constants/action-types";

export const moveArrowEnd = (id, position) => ({ type: MOVE_ARROW_END, payload: {...position, id:id} });
export const moveArrowStart = (id, position) => ({ type: MOVE_ARROW_START, payload: {...position, id:id} });
export const addArrow = arrow => ({ type: ADD_ARROW, payload: {arrow: arrow} });
export const deleteArrow = id => ({ type: DELETE_ARROW, payload: {id: id} });

export const moveBlock = (id, props) => ({ type: MOVE_BLOCK, payload: {id: id, props: props} });
export const createBlock = (block, data) => ({ type: CREATE_BLOCK, payload: {block: block, data: data}});
export const deleteBlock = id => ({ type: DELETE_BLOCK, payload: {id: id} });
export const updateBlockInput = (id, inputId) => ({ type: UPDATE_DATA, payload: {id: id, source: inputId, isInput: true} });
export const updateBlockSelection = (id, data) => ({ type: UPDATE_DATA, payload: {id: id, source: data, isSelection: true} });
export const updateBlockData = (id, data) => ({ type: UPDATE_DATA, payload: {id: id, source: data} });

export const startConnect = (sourceId) => ({ type: START_CONNECT, payload: {id: sourceId} });
export const finishConnect = () => ({ type: FINISH_CONNECT });

export const selectBlock = id => ({type: SELECT_BLOCK, payload: {id: id}})

export const initOptions = (id, attributes) => ({type: INITIALIZE_OPTIONS, payload: {id: id, attributes: attributes}})
export const updateAttrValues = (id, attribute, values) => ({type: UPDATE_ATTRIBUTE_VALUES, payload: {id: id, attribute: attribute, newValues: values}})
export const updateAttrSelection = (id, attribute, value) => ({type: UPDATE_ATTRIBUTE_SELECTION, payload: {id: id, attribute: attribute, value: value}})
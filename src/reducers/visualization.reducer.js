import { 
    MOVE_ARROW_END, 
    MOVE_ARROW_START,
    ADD_ARROW,
    DELETE_ARROW
 } from 'constants/action-types'
import { 
    MOVE_BLOCK,
    CREATE_BLOCK,
    DELETE_BLOCK,
    UPDATE_DATA,
    START_CONNECT,
    FINISH_CONNECT
} from '../constants/action-types';

const initialState = {
    controlState: {
      connecting: false,
      sourceId: -1
    },
    arrowsState: {
        lastId: 0,
        arrows: {}        
    },
    dataState: {
        data: {} // "id": {type: source/input, data: id/{data}}
    },
    blocksState: {
        lastId: 1,
        blocks: {}
    }
}

const visualizationReducer = (state = initialState, action) => {
    let arrows = Object.assign({}, state.arrowsState.arrows)
    let blocks = Object.assign({}, state.blocksState.blocks)
    switch (action.type) {
        case MOVE_ARROW_END:
            arrows[action.payload.id].xe = action.payload.x
            arrows[action.payload.id].ye = action.payload.y
            return {...state, arrowsState: {...state.arrowsState, arrows: arrows}}
        case MOVE_ARROW_START:
            arrows[action.payload.id].xi = action.payload.x
            arrows[action.payload.id].yi = action.payload.y
            return {...state, arrowsState: {...state.arrowsState, arrows: arrows}}
        case ADD_ARROW:
            Object.keys(arrows).forEach(arrowKey => {
              if (arrows[arrowKey].endBlock === action.payload.arrow.endBlock) {
                delete arrows[arrowKey]                   
              }
            })
            arrows[state.arrowsState.lastId] = action.payload.arrow;
            return {...state, arrowsState: {...state.arrowsState, arrows: arrows, lastId: state.arrowsState.lastId+1}}
        case DELETE_ARROW:
            delete arrows[action.payload.id]
            return {...state, arrowsState: {...state.arrowsState, arrows: arrows}}
        case MOVE_BLOCK:
            const { position, size } = action.payload.props
            blocks[action.payload.id].props.position = {left: position.x, top: position.y};
            blocks[action.payload.id].props.size = size;
            Object.values(arrows).forEach(arrow => {
                if (arrow.startBlock === action.payload.id) {
                    arrow.xi = position.x + size.width
                    arrow.yi = position.y + size.height/2
                }
                if (arrow.endBlock === action.payload.id) {
                    arrow.xe = position.x
                    arrow.ye = position.y + size.height/2                    
                }
            })
            return {...state, arrowsState: {...state.arrowsState, arrows: arrows}, blocksState: {...state.blocksState, blocks:blocks}}
        case CREATE_BLOCK:
            blocks[state.blocksState.lastId] = {...action.payload.block, id: state.blocksState.lastId}
            return {...state, blocksState: {...state.blocksState, blocks: blocks, lastId: state.blocksState.lastId+1}}
        case DELETE_BLOCK:
            delete blocks[action.payload.id]
            Object.keys(arrows).forEach(arrowKey => {
              if (arrows[arrowKey].endBlock === action.payload.id|| arrows[arrowKey].startBlock === action.payload.id ) {
                delete arrows[arrowKey]                   
              }
            })
            return {...state, blocksState: {...state.blocksState, blocks: blocks}, arrowsState: {...state.arrowsState, arrows: arrows}}
        case UPDATE_DATA:
            if (action.payload.isInput) {
              blocks[action.payload.id].input = action.payload.source
            } else {
              blocks[action.payload.id].data = action.payload.source
            }
            return {...state, blocksState: {...state.blocksState, blocks: blocks}}
        case START_CONNECT:
            return {...state, controlState: {connecting: true, sourceId: action.payload.id}}
        case FINISH_CONNECT:            
            return {...state, controlState: {connecting: false, sourceId: -1}}
        default:
            return state
    }
}

export default visualizationReducer
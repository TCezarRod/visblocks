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
    FINISH_CONNECT,
    SELECT_BLOCK,
    INITIALIZE_OPTIONS,
    UPDATE_ATTRIBUTE_SELECTION,
    UPDATE_ATTRIBUTE_VALUES
} from '../constants/action-types';

const initialState = {
    controlState: {
      connecting: false,
      sourceId: -1,
      selected: -1,
      options: {} // "id": {attributes: [], ...'attribute': {type: string, values?: [], selected: string/{}}
    },
    arrowsState: {
        lastId: 0,
        arrows: {}        
    },
    dataState: {
        data: {} // "id": {type: source/input, data: id/{data}, selection: {data}}
    },
    blocksState: {
        lastId: 1,
        blocks: {}
    }
}

const visualizationReducer = (state = initialState, action) => {
    let arrows = Object.assign({}, state.arrowsState.arrows)
    let blocks = Object.assign({}, state.blocksState.blocks)
    let data = Object.assign({}, state.dataState.data)
    let options = Object.assign({}, state.controlState.options)
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
            if (!blocks[action.payload.arrow.startBlock].forwardId) blocks[action.payload.arrow.startBlock].forwardId = []
            blocks[action.payload.arrow.startBlock].forwardId.push(action.payload.arrow.endBlock);
            arrows[state.arrowsState.lastId] = action.payload.arrow;
            return {...state, arrowsState: {...state.arrowsState, arrows: arrows, lastId: state.arrowsState.lastId+1}, blocksState: {...state.blocksState, blocks: blocks}}
        case DELETE_ARROW:
            let forwardIndex = blocks[arrows[action.payload.id]].forwardId.indexOf(arrows[action.payload.id].endBlock)
            if (forwardIndex > -1) {
                blocks[arrows[action.payload.id]].forwardId.splice(forwardIndex, 1)
            }            
            delete arrows[action.payload.id]
            return {...state, arrowsState: {...state.arrowsState, arrows: arrows}, blocksState: {...state.blocksState, blocks: blocks}}
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
            const newId = state.blocksState.lastId
            blocks[newId] = {...action.payload.block, id: newId}
            if (action.payload.data) {
              data = {...data, [newId]: {data: action.payload.data}}
              if (action.payload.isInput) {
                data[newId].type = "input"
                blocks[newId].input = action.payload.data
              } else {
                data[newId].type = "data"
                blocks[newId].data = action.payload.data
              }
            }
            return {...state, blocksState: {...state.blocksState, blocks: blocks, lastId: state.blocksState.lastId+1}, dataState: {...state.dataState, data: data}}
        case DELETE_BLOCK:
            let block = blocks[action.payload.id]
            let delData = (id) => delete data[id]
            while (block && (block.data || block.input) && block.forwardId && block.forwardId.length > 0) {
                block.forwardId.forEach(id => delData(id))
                block = block[block.forwardId]
            }            
            delete blocks[action.payload.id]
            delete data[action.payload.id]
            Object.keys(arrows).forEach(arrowKey => {
              if (arrows[arrowKey].endBlock === action.payload.id|| arrows[arrowKey].startBlock === action.payload.id ) {
                delete arrows[arrowKey]                   
              }
            })
            return {...state, blocksState: {...state.blocksState, blocks: blocks}, arrowsState: {...state.arrowsState, arrows: arrows}, dataState: {...state.dataState, data: data}}
        case UPDATE_DATA:
            const id = action.payload.id;
            data = {...data, [id]: {...data[id]}}
            if (action.payload.isInput) {
              data[id] = {type: 'input', data: action.payload.source};
              blocks[id].input = action.payload.source
            } else if (action.payload.isSelection) {
              data[id].selection = action.payload.source
              let block = blocks[id]
              let updateSel = (id) => data[id].selection = []
              while (block && block.forwardId && block.forwardId.length > 0) {
                  block.forwardId.forEach(id => updateSel(id))
                  block = block[block.forwardId]
              } 
            } else {
              data[id] = {type: 'data', data: action.payload.source};
              blocks[id].data = action.payload.source
            }
            return {...state, blocksState: {...state.blocksState, blocks: blocks}, dataState: {...state.dataState, data: data}}
        case START_CONNECT:
            return {...state, controlState: {...state.controlState, connecting: true, sourceId: action.payload.id, selected: action.payload.id}}
        case FINISH_CONNECT:            
            return {...state, controlState: {...state.controlState, connecting: false, sourceId: -1}}
        case SELECT_BLOCK:
            return {...state, controlState: {...state.controlState, selected: action.payload.id}}
        case INITIALIZE_OPTIONS:
            let blockOptions = Object.assign({attributes: []}, action.payload.attributes)
            Object.keys(action.payload.attributes).forEach(attribute => {
                blockOptions.attributes.push(attribute)
                blockOptions[attribute].selected = undefined;
            })
            options[action.payload.id] = blockOptions
            return {...state, controlState: {...state.controlState, options: options}}        
        case UPDATE_ATTRIBUTE_VALUES:
            options[action.payload.id][action.payload.attribute].values = action.payload.newValues
            return {...state, controlState: {...state.controlState, options: options}}         
        case UPDATE_ATTRIBUTE_SELECTION:
            options[action.payload.id][action.payload.attribute].selected = action.payload.value
            return {...state, controlState: {...state.controlState, options: options}}   

        default:
            return state
    }
}

export default visualizationReducer
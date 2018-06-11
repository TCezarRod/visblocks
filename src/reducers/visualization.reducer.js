import { 
    MOVE_ARROW_END, 
    MOVE_ARROW_START,
    ADD_ARROW,
    DELETE_ARROW
 } from 'constants/action-types'
import { 
    MOVE_BLOCK,
    CREATE_BLOCK,
    DELETE_BLOCK 
} from '../constants/action-types';

const initialState = {
    arrowsState: {
        lastId: 0,
        arrows: {}        
    },
    dataState: {
        data: {} // "id": {type: source/input, data: id/{data}}
    },
    blocksState: {
        lastId: 5,
        blocks: {
            '0': {
            id: 0,
            type: 'Data',
            data: [
              {"sepalLength": 5.1, "sepalWidth": 3.5, "petalLength": 1.4, "petalWidth": 0.2, "species": "setosa"},
              {"sepalLength": 4.9, "sepalWidth": 3.0, "petalLength": 1.4, "petalWidth": 0.2, "species": "setosa"},
              {"sepalLength": 4.7, "sepalWidth": 3.2, "petalLength": 1.3, "petalWidth": 0.2, "species": "setosa"},
              {"sepalLength": 4.6, "sepalWidth": 3.1, "petalLength": 1.5, "petalWidth": 0.2, "species": "setosa"},
              {"sepalLength": 5.0, "sepalWidth": 3.6, "petalLength": 1.4, "petalWidth": 0.2, "species": "setosa"},
              {"sepalLength": 5.4, "sepalWidth": 3.9, "petalLength": 1.7, "petalWidth": 0.4, "species": "setosa"},
              {"sepalLength": 4.6, "sepalWidth": 3.4, "petalLength": 1.4, "petalWidth": 0.3, "species": "setosa"},
              {"sepalLength": 5.0, "sepalWidth": 3.4, "petalLength": 1.5, "petalWidth": 0.2, "species": "setosa"},
              {"sepalLength": 4.4, "sepalWidth": 2.9, "petalLength": 1.4, "petalWidth": 0.2, "species": "setosa"},
              {"sepalLength": 4.9, "sepalWidth": 3.1, "petalLength": 1.5, "petalWidth": 0.1, "species": "setosa"},
              {"sepalLength": 5.4, "sepalWidth": 3.7, "petalLength": 1.5, "petalWidth": 0.2, "species": "setosa"},
              {"sepalLength": 4.8, "sepalWidth": 3.4, "petalLength": 1.6, "petalWidth": 0.2, "species": "setosa"},
              {"sepalLength": 4.8, "sepalWidth": 3.0, "petalLength": 1.4, "petalWidth": 0.1, "species": "setosa"},
              {"sepalLength": 4.3, "sepalWidth": 3.0, "petalLength": 1.1, "petalWidth": 0.1, "species": "setosa"},
              {"sepalLength": 5.8, "sepalWidth": 4.0, "petalLength": 1.2, "petalWidth": 0.2, "species": "setosa"},
              {"sepalLength": 5.7, "sepalWidth": 4.4, "petalLength": 1.5, "petalWidth": 0.4, "species": "setosa"},
              {"sepalLength": 5.4, "sepalWidth": 3.9, "petalLength": 1.3, "petalWidth": 0.4, "species": "setosa"},
              {"sepalLength": 5.1, "sepalWidth": 3.5, "petalLength": 1.4, "petalWidth": 0.3, "species": "setosa"},
              {"sepalLength": 5.7, "sepalWidth": 3.8, "petalLength": 1.7, "petalWidth": 0.3, "species": "setosa"},
              {"sepalLength": 5.1, "sepalWidth": 3.8, "petalLength": 1.5, "petalWidth": 0.3, "species": "setosa"},
              {"sepalLength": 5.4, "sepalWidth": 3.4, "petalLength": 1.7, "petalWidth": 0.2, "species": "setosa"},
              {"sepalLength": 5.1, "sepalWidth": 3.7, "petalLength": 1.5, "petalWidth": 0.4, "species": "setosa"},
              {"sepalLength": 4.6, "sepalWidth": 3.6, "petalLength": 1.0, "petalWidth": 0.2, "species": "setosa"},
              {"sepalLength": 5.1, "sepalWidth": 3.3, "petalLength": 1.7, "petalWidth": 0.5, "species": "setosa"},
              {"sepalLength": 4.8, "sepalWidth": 3.4, "petalLength": 1.9, "petalWidth": 0.6, "species": "setosa"},
              {"sepalLength": 5.0, "sepalWidth": 3.0, "petalLength": 1.6, "petalWidth": 0.2, "species": "setosa"},
              {"sepalLength": 5.0, "sepalWidth": 3.4, "petalLength": 1.6, "petalWidth": 0.4, "species": "setosa"},
              {"sepalLength": 5.2, "sepalWidth": 3.5, "petalLength": 1.5, "petalWidth": 0.2, "species": "setosa"},
              {"sepalLength": 5.2, "sepalWidth": 3.4, "petalLength": 1.4, "petalWidth": 0.2, "species": "setosa"},
              {"sepalLength": 4.7, "sepalWidth": 3.2, "petalLength": 1.6, "petalWidth": 0.2, "species": "setosa"},
              {"sepalLength": 4.8, "sepalWidth": 3.1, "petalLength": 1.6, "petalWidth": 0.2, "species": "setosa"},
              {"sepalLength": 5.4, "sepalWidth": 3.4, "petalLength": 1.5, "petalWidth": 0.4, "species": "setosa"},
              {"sepalLength": 5.2, "sepalWidth": 4.1, "petalLength": 1.5, "petalWidth": 0.1, "species": "setosa"},
              {"sepalLength": 5.5, "sepalWidth": 4.2, "petalLength": 1.4, "petalWidth": 0.2, "species": "setosa"},
              {"sepalLength": 4.9, "sepalWidth": 3.1, "petalLength": 1.5, "petalWidth": 0.2, "species": "setosa"},
              {"sepalLength": 5.0, "sepalWidth": 3.2, "petalLength": 1.2, "petalWidth": 0.2, "species": "setosa"},
              {"sepalLength": 5.5, "sepalWidth": 3.5, "petalLength": 1.3, "petalWidth": 0.2, "species": "setosa"},
              {"sepalLength": 4.9, "sepalWidth": 3.6, "petalLength": 1.4, "petalWidth": 0.1, "species": "setosa"},
              {"sepalLength": 4.4, "sepalWidth": 3.0, "petalLength": 1.3, "petalWidth": 0.2, "species": "setosa"}],
            props: {
              position: {
                top: 0,
                left: 0
              },
              size: {
                height: 50,
                width: 50
              }
            }
          },
          '1': {
            id: 1,
            type: 'ScatterPlot',
            input: '0',
            props: {
              xDimension: 'sepalLength',
              yDimension: 'sepalWidth',
              position: {
                top:  50,
                left: 200
              },
              size: {
                height: 200,
                width: 300
              }
            }
          },
          '2': {
            id: 2,
            type: 'LineChart',
            input: '1',
            props: {
              xDimension: 'sepalLength',
              yDimension: 'sepalWidth',
              position: {
                top: 0,
                left: 700
              },
              size: {
                height: 200,
                width: 300
              }
            }
          },
          '3': {
            id: 3,
            type: 'Histogram',
            input: '1',
            props: {
              dimension: 'sepalWidth',
              bins: 10,
              position: {
                top: 300,
                left: 250
              },
              size: {
                height: 200,
                width: 300
              }
            }
          },
          '4' :{
            id: 4,
            type: 'Histogram',
            input: undefined,
            props: {
              dimension: undefined,
              bins: 10,
              position: {
                top: 200,
                left: 0
              },
              size: {
                height: 212,
                width: 300
              }
            }
          }
        }
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
            arrows[state.arrowsState.lastId] = action.payload.arrow;
            return {...state, arrowsState: {...state.arrowsState, arrows: arrows, lastId: state.arrowsState.lastId+1}}
        case DELETE_ARROW:
            delete arrows[action.payload.id]
            return {...state, arrowsState: {...state.arrowsState, arrows: arrows}}
        case MOVE_BLOCK:
            Object.values(arrows).forEach(arrow => {
                let props = action.payload.props
                if (arrow.startBlock === action.payload.id) {
                    arrow.xi = props.position.x + props.size.width
                    arrow.yi = props.position.y + props.size.height/2
                }
                if (arrow.endBlock === action.payload.id) {
                    arrow.xe = props.position.x
                    arrow.ye = props.position.y + props.size.height/2                    
                }
            })
            return {...state, arrowsState: {...state.arrowsState, arrows: arrows}}
        case CREATE_BLOCK:
            blocks[state.blocksState.lastId] = action.payload.block
            return {...state, blocksState: {...state.blocksState, blocks: blocks, lastId: state.blocksState.lastId+1}}
        case DELETE_BLOCK:
            delete blocks[action.payload.id]
            return {...state, blocksState: {...state.blocksState, blocks: blocks}}
        default:
            return state
    }
}

export default visualizationReducer
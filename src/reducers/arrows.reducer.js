import { 
    MOVE_ARROW_END, 
    MOVE_ARROW_START,
    ADD_ARROW,
    DELETE_ARROW
 } from 'constants/action-types'
import { MOVE_BLOCK } from '../constants/action-types';

const initialState = {
    lastId: 0,
    arrows: {}
}

const arrowReducer = (state = initialState, action) => {
    let arrows = Object.assign({}, state.arrows)
    switch (action.type) {
        case MOVE_ARROW_END:
            arrows[action.payload.id].xe = action.payload.x
            arrows[action.payload.id].ye = action.payload.y
            return {...state, arrows: arrows}
        case MOVE_ARROW_START:
            arrows[action.payload.id].xi = action.payload.x
            arrows[action.payload.id].yi = action.payload.y
            return {...state, arrows: arrows}
        case ADD_ARROW:
            arrows[state.lastId] = action.payload.arrow;
            return {...state, arrows: arrows, lastId: state.lastId+1}
        case DELETE_ARROW:
            delete arrows[action.payload.id]
            return {...state, arrows: arrows}
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
            return {...state, arrows: arrows}
        default:
            return state
    }
}

export default arrowReducer
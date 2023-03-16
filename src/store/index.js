import {createStore,applyMiddleware} from "redux"
import reduxLogger from "redux-logger"
import reduxThunk from "redux-thunk"
import reduxPromise from "redux-promise"
import reducer from "./reducers/index"

//根据不同环境使用不同的中间件
let middleWare = [reduxThunk,reduxPromise],
    env = process.env.NODE_ENV;
    
if(env === "development"){
    middleWare.push(reduxLogger)
}


const store = createStore(
    reducer,
    applyMiddleware(...middleWare)
)
export default store;
import {configureStore} from '@reduxjs/toolkit'
import authReducer from './userActions'

export const store = configureStore({
    reducer: {
        auth : authReducer,
    }
})
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

//redux
import {Provider} from "react-redux"
import store from "./store/index"

//REM  改变rem换算比例
import "lib-flexible"

import "./index.less"

//antd mobile
import { ConfigProvider } from "antd-mobile";
import enUS from 'antd-mobile/es/locales/en-US'

//处理最大宽度
(function(){
  const handleMax = function handleMax(){
    let html = document.documentElement,
      root = document.getElementById("root"),
      deviceW = html.clientWidth;
      
    root.style.maxWidth = "750px";
    if (deviceW >= 750){
      html.style.fontSize = "75px"
    }
  }
  handleMax();
  window.addEventListener("resize",handleMax)
})()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider locale={enUS}>
    <Provider store={store}>
      <App /> 
    </Provider>
  </ConfigProvider>
);
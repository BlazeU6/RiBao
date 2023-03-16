import React,{useEffect} from 'react'
import {connect} from "react-redux"
import styled from "styled-components"
import { SwipeAction, Toast } from 'antd-mobile';
import NavBarAgain from "../components/NavBarAgain"
import NewsItem from '../components/NewsItem';
import SkeletonAgain from '../components/SkeletonAgain';
import action from "../store/actions/index";
import api from "../api/index"


//样式
const StoreBox = styled.div`
    .box {
      padding:30px;
    }
`

function Store(props) {
  let {list:storeList,queryStoreListAsync,removeStoreListById} = props

  //第一次加载完毕，若获取不到收藏列表，那就派发action获取
  useEffect(()=>{
    if(!storeList){
      queryStoreListAsync()
    }
  },[storeList,queryStoreListAsync])

  //移除收藏
  const handleRemove = async (id) => {
    try {
      let {code} = await api.storeRemove(id)
      if(+code !== 0) {
        Toast.show({
          icon:"fail",
          content:"移除成功"
        })
        return
      }
      Toast.show({
          icon:"success",
          content:"移除成功"
      })
      removeStoreListById(id)
    } catch (_) {}
  }

  return (
      <StoreBox>
          <NavBarAgain title="我的收藏" />
          {
            storeList ?
            <div className="box">
              {
                storeList.map(item => {
                  let {id,news} = item;
                  return <SwipeAction
                      key={id}
                      rightActions={[{
                        key:"delete",
                        text:"删除",
                        color:"danger",
                        onClick(){
                          handleRemove(id)
                        }
                      }]}
                    >
                      <NewsItem info={news} />
                  </SwipeAction>
                })
              }
            </div> :
            <SkeletonAgain />
          }
          
      </StoreBox>
  )
}
export default connect(
  state => state.store,
  action.store
)(Store)
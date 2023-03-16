import React from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from "styled-components";
import { Toast } from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons';
import NavBarAgain from "../components/NavBarAgain"
import action from "../store/actions/index"
import _ from "../assets/utils"

/* 样式 */
const PersonalBox = styled.div`
    .baseInfo {
        box-sizing: border-box;
        margin: 40px 0;
        .pic {
            display: block;
            margin: 0 auto;
            width: 172px;
            height: 172px;
            border-radius: 50%;
        }
        .name {
            line-height: 100px;
            font-size: 36px;
            text-align: center;
            color: #000;
        }
    }
    .tab {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 30px;
        height: 120px;
        line-height: 120px;
        font-size: 32px;
        color: #000;
        border-bottom: 2px solid #EEE;
    }
`;

function Personal(props) {
    let {info,clearUserInfo,clearStoreList,navigate} = props;
    
    //退出登录
    const signOut = () => {
        //清除redux中的信息
        clearUserInfo()
        clearStoreList()
        //清除token
        _.storage.remove("tk")
        //提示
        Toast.show({
            icon:"success",
            content:"已成功退出"
        })
        //跳转
        navigate("/login?to=/personal",{replace:true})
    }
    return (
        <PersonalBox>
            <NavBarAgain title="个人中心" />
            <div className="baseInfo">
                <Link to="/update">
                    <img src={info.pic} alt="" className='pic'/>
                    <p className='name'>{info.name}</p>
                </Link>
            </div>

            <div>
                <Link to="/store" className='tab'>
                    我的收藏
                    <RightOutline />
                </Link>
                <div className="tab" onClick={signOut}>
                    退出登录
                    <RightOutline />
                </div>
            </div>
        </PersonalBox> 
    )
}
export default connect(
    state => state.base,
    {
        clearUserInfo:action.base.clearUserInfo,
        clearStoreList:action.store.clearStoreList
    }
)(Personal)
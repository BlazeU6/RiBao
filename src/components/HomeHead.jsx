import React,{useEffect, useMemo} from 'react'
import {connect} from "react-redux"
import {useNavigate} from "react-router-dom"
import action from "../store/actions/index"
import timg from "../assets/images/timg.jpg"
import "./HomeHead.less"


function HomeHead(props) {
    let { today,info,queryUserInfoAsync } = props;
    const navigate = useNavigate()
    
    let time = useMemo(()=>{
        let [,month,day] = today.match(/^\d{4}(\d{2})(\d{2})$/),
            monthList = ["","一","二","三","四","五","六","七","八","九","十","十一","十二"]
        return {
            day,
            month:monthList[+month] + "月"//month前的＋是将字符串转为数字
        }
    },[today])

    //第一次渲染完，info中若没有信息，我们尝试派发一次，获取登录者信息
    useEffect(()=>{
        if(!info){
            queryUserInfoAsync();
        }
        
    },[])
    

    return (
        <header className='home-head-box'>
            <div className="info">
                <div className="time">
                    <span>{time.day}</span>
                    <span>{time.month}</span>
                </div>
                <h2 className='title'>头条日报</h2>
            </div>
            <div className="picture" onClick={()=>{
                navigate("/personal")
            }}>
                <img src={info ? info.pic : timg} alt="" />
            </div>
        </header>
    )
}
export default connect(
    state => state.base,
    action.base
)(HomeHead)
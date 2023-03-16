import React,{useState,useEffect,useMemo} from 'react'
import { flushSync } from 'react-dom'
import {connect} from "react-redux"
import action from "../store/actions/index"
import { LeftOutline,MessageOutline,LikeOutline,StarOutline,MoreOutline } from 'antd-mobile-icons'
import { Badge,Toast } from 'antd-mobile'
import SkeletonAgain from "../components/SkeletonAgain"
import "./Detail.less"
import api from "../api/index"

function Detail(props) {
    let {navigate,params} = props;
    let [extra,setExtra] = useState(null),
        [info,setInfo] = useState(null);

    let link;
    //第一次渲染完毕：获取数据
    const handleStyle = (res) => {
        let {css} = res;
        //判断css是不是一个数组
        if(!Array.isArray(css)) return;
        css = css[0];
        //如果css不存在
        if(!css) return;

        link = document.createElement("link");
        link.rel = "stylesheet"
        link.href = css
        document.head.appendChild(link)
    }
    const handleImage = (res) => {
        let imgPlaceHolder = document.querySelector('.img-place-holder');
        if (!imgPlaceHolder) return;
        // 创建大图
        let tempImg = new Image();
        tempImg.src = res.image;
        tempImg.onload = () => {
            imgPlaceHolder.appendChild(tempImg);
        };
        tempImg.onerror = () => {
            let parent = imgPlaceHolder.parentNode;
            parent.parentNode.removeChild(parent);
        };
    }

    useEffect(()=>{
        (async () => {
            try {
                let res = await api.queryNewsInfo(params.id)
                flushSync(()=> {
                    setInfo(res)
                    //处理样式和图片
                    handleStyle(res)
                })
                handleImage(res)
            } catch (_) {}
        })()
        return ()=>{
            //组件销毁时，移除我们上面创建的样式
            if(link) document.head.removeChild(link)
        }
    },[])
    useEffect(()=>{
        (async () => {
            try {
                let res = await api.queryStoryExtra(params.id)
                setExtra(res)
            } catch (_) {}
        })()
    },[])

    //收藏登录处理
    let {
        base:{info : userInfo},queryUserInfoAsync,
        location,
        store:{list:storeList},queryStoreListAsync,removeStoreListById
    } = props

    useEffect(()=>{
        (async ()=>{
            if(!userInfo) {
                //第一次渲染完，如果userInfo若不存在，则派发任务同步登录者信息
                let {info} = await queryUserInfoAsync()
                userInfo = info
            };
            //如果已经登录 && 但没有收藏信息，就派发任务同步至收藏列表
            if(userInfo && !storeList){
                queryStoreListAsync()
            }
        })()
    },[])

    //依赖于收藏列表和路径参数，计算出此新闻是否收藏
    const isStore = useMemo(()=>{
        if(!storeList) return false;
        return storeList.some(item => {
            return +item.news.id === +params.id
        })
    },[storeList,params])

    //点击收藏按钮的回调
    const handleStore = async () => {
        if(!userInfo){
            //没有登录
            Toast.show({
                icon:"fail",
                content:"请先登录"
            })
            console.log(location.pathname);
            navigate(`/login?to=${location.pathname}`,{replace:false})
            return;
        }
        //已经登录：收藏或者移除收藏
        if(isStore){
            //移除收藏
            let item = storeList.find(item =>{
                return +item.news.id === +params.id
            })
            //如果item不存在
            if(!item) return;

            //通知服务器移除收藏
            let {code} = await api.storeRemove(item.id)
            if(+code !== 0){
                //失败
                Toast.show({
                    icon:"fail",
                    content:"操作失败"
                })
                return;
            }
            Toast.show({
                icon:"success",
                content:"操作成功"
            })
            //通知redux也把这一项移除掉
            removeStoreListById(params.id)
            return;
        }
        //收藏
        try {
            
            let {code} = await api.store(params.id);
            
            if(+code !== 0){
                Toast.show({
                    icon:"fail",
                    content:"收藏失败"
                })
                return;
            }
            Toast.show({
                icon:"success",
                content:"收藏成功"
            })
            //收藏成功后，同步最新的收藏列表到redux中
            queryStoreListAsync()
        } catch (_) {}
    }

    return (
        <div className='detail-box'>
            {/* 新闻内容 */}
            {
                !info ? 
                <SkeletonAgain /> :
                <div 
                    className="content" 
                    dangerouslySetInnerHTML={{
                        __html:info.body
                    }}
                ></div>
            }

            {/* 底部图标 */}
            <div className="tab-bar">
                <div className="back" onClick={()=>{
                    navigate(-1)
                }}>
                    <LeftOutline />
                </div>
                <div className="icons">
                    <Badge content={extra ? extra.comments : 0}>
                        <MessageOutline />
                    </Badge>
                    <Badge content={extra ? extra.popularity : 0}>
                        <LikeOutline />
                    </Badge>
                    <span className={isStore ? "stored" : ""} onClick={handleStore}><StarOutline /></span>
                    <span><MoreOutline /></span>
                </div>
            </div>
        </div>
    )
}
export default connect(
    state => {
        return {
            base:state.base,
            store:state.store
        }
    },
    {   
        ...action.base,
        ...action.store
    }
)(Detail)
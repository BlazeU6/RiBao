import React,{useEffect, useState,useRef} from 'react'
import {Link} from "react-router-dom"
import {Swiper,Image,Divider,DotLoading} from "antd-mobile"
import HomeHead from "../components/HomeHead"
import NewsItem from "../components/NewsItem"
import SkeletonAgain from "../components/SkeletonAgain"
import _ from "../assets/utils"
import api from "../api/index"
import "./Home.less"

export default function Home() {
    let [today,setToday] = useState(_.formatTime(null,"{0}{1}{2}")),
        [bannerData,setBannerList] = useState([]),
        [newsList,setNewsList] = useState([]);

    let loadMoreRef = useRef();

    //第一次渲染完毕:向服务器发送请求
    useEffect(()=>{
        (async () => {
            try {
                let {date,stories,top_stories} = await api.queryNewsLatest()
                setToday(date)
                setBannerList(top_stories)

                newsList.push({
                    date,stories
                })
                setNewsList([...newsList])
            } catch (error) {
                
            }
        })()
    },[])

    // console.log("@@",newsList);
    
    //第一次渲染完毕：设置监听器，实现触底加载更多
    useEffect(()=>{
        //创建监听器
        let ob = new IntersectionObserver(async changes => {
            let {isIntersecting} = changes[0]
            if(isIntersecting){
                //此时加载更多的按钮出现在视口中，也就是触底了
                
                try {
                    //获取选定的日期，最终得到此天之前的数据
                    let time = newsList[newsList.length - 1]["date"]
                    let res = await api.queryNewsBefore(time)
                    newsList.push(res)
                    setNewsList([...newsList])
                } catch (_) {}
            }
        })
        let loadMoreBox = loadMoreRef.current
        ob.observe(loadMoreBox)

        return () => {
            //组件释放的时候执行此回调函数
            //手动销毁监听器
            //这里不用loadMoreRef.current的原因是：
            //在组件释放后，已经访问不到loadMoreRef了，所以利用闭包将它提前保存起来
            ob.unobserve(loadMoreBox)
            ob = null
        }
    },[])

    return (
        <div className='home-box'>
            <HomeHead today={today}/>

            {/* 轮播图 */}
            <div className="swiper-box">
            { bannerData.length > 0 ? <Swiper autoplay={true} loop={true} >
                    
                    { bannerData.map(item => {
                        let {id,image,title,hint} = item
                        return <Swiper.Item key={id}>
                                    <Link to={{pathname:`/detail/${id}`}}>
                                        <Image src={image} lazy/>
                                        <div className="desc">
                                            <h3 className='desc-title'>{title}</h3>
                                            <p className='desc-author'>{hint}</p>
                                        </div>
                                    </Link>
                                </Swiper.Item>
                    })}
                </Swiper> : null }
            </div>

            {/* 新闻列表 */}
            { newsList.length === 0 ? 
                <SkeletonAgain /> : 
                <>
                    { 
                        newsList.map((item,index) => {
                            let { date,stories } = item;
                            return <div className="news-box" key={date}>
                                        {/* 第一项不需要日期分割线 */}
                                        {
                                            index !== 0 ? 
                                            <Divider contentPosition='left'>
                                                {_.formatTime(date,"{1}月{2}日")}
                                            </Divider> : null
                                        }  

                                        <div className="list">
                                            {
                                                stories.map(cur => {
                                                    return <NewsItem key={cur.id} info={cur}/>
                                                })
                                            }
                                        </div>
                                    </div>
                        })
                    }
                </>
                
            }
            
            {/* 加载更多 */}
            <div className="loadmore-box" 
                ref={loadMoreRef} 
                style={{
                    display:newsList.length === 0 ? "null" : "block"
                }}>
                <DotLoading />数据加载中
            </div>
        </div>
    )
}

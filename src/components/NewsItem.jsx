import React from 'react'
import {Link} from "react-router-dom"
import {Image} from "antd-mobile"
import PropTypes from "prop-types"
import "./NewsItem.less"

function NewsItem(props) {
    let {info} = props,
        {id,title,hint,images,image} = info;
        
    if(!images) images = [image]

    //判断images是否是一个数组
    if(!Array.isArray(images)){
        images = [""]
    }

    //如果没传info，就不渲染了
    if(!info) return null;
    return (
        <div className='news-item-box'>
            <Link to={{pathname:`/detail/${id}`}}>
                <div className="content">
                    <h4 className='content-title'>{title}</h4>
                    {
                        hint ? 
                        <p className='content-author'>{hint}</p> :
                        null
                    }
                </div>
                <Image src={images[0]} lazy/>
            </Link>
        </div>
    )
}

//属性规则处理
NewsItem.defaultProps = {
    info:null
}
NewsItem.propTypes = {
    info:PropTypes.object
}
export default NewsItem
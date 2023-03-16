import http from "./http"

//获取今日新闻信息 & 轮播图信息
const queryNewsLatest = () => http.get("/news_latest")

//获取往日的新闻信息
const queryNewsBefore = (time) => {
    return http.get("/news_before",{
        params:{
            time
        }
    })
}

//获取新闻详细信息
const queryNewsInfo = (id) => {
    return http.get("/news_info",{
        params:{
            id
        }
    })
}

//获取新闻点赞信息
const queryStoryExtra = (id) => {
    return http.get("/story_extra",{
        params:{
            id
        }
    })
}

//发送验证码
const sendPhoneCode = (phone) => {
    return http.post("/phone_code",{
        phone
    })
}

//登录
const login = (phone,code) =>{
    return http.post("/login",{
        phone,
        code
    })
}

//获取登录者信息
const queryUserInfo = () => {return http.get("/user_info")}

//收藏新闻
const store = (newsId) => {
    return http.post("/store",{newsId})
}

//移除收藏
const storeRemove = (id) => {
    return http.get("/store_remove",{
        params:{
            id
        }
    })
}

//获取收藏列表
const storeList = () => {
    return http.get("/store_list")
}

//图片上传,要求是FormData
const upload = (file) => {
    let fm = new FormData();
    fm.append("file",file);
    return http.post("/upload",fm)
}

//修改个人信息
const userUpdate = (username,pic) => {
    return http.post("/user_update",{
        username,
        pic
    })
}

//暴露API
const api = {
    queryNewsLatest,
    queryNewsBefore,
    queryNewsInfo,
    queryStoryExtra,
    sendPhoneCode,
    login,
    queryUserInfo,
    store,
    storeRemove,
    storeList,
    upload,
    userUpdate
}
export default api;
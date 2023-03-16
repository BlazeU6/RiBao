import { Suspense, useEffect,useState } from "react";
import {Routes,Route,useNavigate,useLocation,useParams,useSearchParams,navigate} from "react-router-dom"
import routes from "./routes"
import { Mask,DotLoading,Toast } from "antd-mobile"
import store from "../store/index"
import action from "../store/actions/index"


const isCheckLogin = (path) => {
    let {base:{info}}  = store.getState(),
        checkList = ["/personal","/store","/update"];
    //如果info值不存在并且跳转的地址是列表中的某一个,则需要做登录态校验
    return !info && checkList.includes(path)
}
// 统一路由
const Element = function Element(props){
    let {component:Component,meta,path} = props
    let [_,setRandom] = useState(0)

    //isShow控制的是组件是否显示，isShow为true的话说明不用登录，那么就直接渲染就好了
    let isShow = !isCheckLogin(path)
    
    //登录态校验
    //每一次组件更新完毕后都会执行
    useEffect(()=>{
        if(isShow) return;//这里就不需要校验
        (async ()=>{
            //先从服务器获取登录信息
            let infoAction = await action.base.queryUserInfoAsync();
            let info = infoAction.info

            if(!info){
                //获取后还不存在的话，说明没有登录
                Toast.show({
                    icon:"fail",
                    content:"请先登录"
                })
                navigate({
                    pathname:"/login",
                    search:`?to=${path}`
                },{replace:true})
                return;
            }
            //如果获取到了信息，说明已经登录
            //我们把信息传给容器中
            store.dispatch(infoAction)
            setRandom(+new Date())//更新Element组件
        })()
    })

    //修改页面title
    let {title = "头条日报-WebApp"} = meta || {}
    document.title = title
    //获取路由信息，基于属性传递给组件
    const navigate = useNavigate(),
        location = useLocation(),
        params = useParams(),
        [userSearchParams] = useSearchParams();


    return <>
        { 
            isShow ?
            <Component 
                navigate={navigate} 
                location={location} 
                params={params} 
                usp={userSearchParams}
            /> :
            <Mask visible={true}>
                <DotLoading color='white' />
            </Mask>
        }
        
    </>
}

export default function RouterView(){
    return <Suspense fullback={
                <Mask visible={true}>
                    <DotLoading color='white' />
                </Mask>
            }>
            <Routes>
                {routes.map(item => {
                    let {name,path} = item
                    return <Route key={name} path={path} element={<Element {...item}/>}/>
                })}
            </Routes>
    </Suspense>
}
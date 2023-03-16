import React,{useState} from 'react'
import { Button } from 'antd-mobile';

export default function ButtonAgain(props) {
    //props中包含了调用<Button>组件时的属性
    //props是只读的
    let options = {...props}
    let {children,onClick:handle} = options
    delete options.children;
    
    //状态
    let [loading,setLoading] = useState(false)

    const handleClick = async () => {
        setLoading(true)
        try {
            //这是真正要做的事情
            await handle()
        } catch (_) {}
        setLoading(false)
    }

    // 调用ButtonAgain组件，如果传递了onclick,我们也处理，如果没传递，我们也不处理
    if(handle){
        options.onClick = handleClick
    }

    return (
        <Button loading={loading} {...options} >
            {children}
        </Button>
    )
}

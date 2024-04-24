import React,{useState,useEffect} from 'react'
import {connect} from "react-redux"
import action from "../store/actions/index"
import {Form,Input,Toast} from "antd-mobile"
import NavBarAgain from '../components/NavBarAgain'
import ButtonAgain from '../components/ButtonAgain';
import "./Login.less"
import api from "../api/index"
import _ from "../assets/utils"

import { SM4 } from 'gm-crypto'

const key = '0123456789abcdeffedcba9876543210'
const originalData = 'SM4 国标对称加密'

//自定义表单校验规则
const validate = {
    phone(_,value){
        let reg = /^(?:(?:\+|00)86)?1\d{10}$/
        value = value.trim()
        if(value.length === 0 ) return Promise.reject(new Error("手机号是必填项！"))
        if(!reg.test(value))return Promise.reject(new Error("手机号格式有误！"))
        return Promise.resolve()
    },
    // code(_,value){
    //     let reg = /^\d{6}$/
    //     value = value.trim()
    //     if(value.length === 0 ) return Promise.reject(new Error("验证码是必填项！"))
    //     if(!reg.test(value))return Promise.reject(new Error("验证码格式有误！"))
    //     return Promise.resolve()
    // }
}

function Login(props) {
    //获取登录信息然后派发action存在redux中
    let {queryUserInfoAsync,navigate,usp} = props;

    let [formIns] = Form.useForm(),
        [btnDisabled,setDisabled] = useState(false),
        [sendText,setSendText] = useState("发送验证码");

    //表单提交
    const submit = async() => {
        try {
            //表单校验
            await formIns.validateFields()
            let {phone,code} = formIns.getFieldsValue()

            const encryptedData = SM4.encrypt(code, key, {
                inputEncoding: 'utf8',
                outputEncoding: 'base64'
            })
            //发请求
            let { code: codeHttp,token } = await api.login(phone, encryptedData)
            if(+codeHttp !== 0){
                Toast.show({
                    icon:"fail",
                    content:"登录失败"
                })
                formIns.resetFields(["code"])
                return;
            }

            //登录成功：存储token、存储登录者信息到redux、提示、跳转
            _.storage.set("tk",token)
            //派发任务，同步redux中的状态信息
            await queryUserInfoAsync()
            //提示
            Toast.show({
                icon:"success",
                content:"登录/注册成功"
            })
            //跳转
            let to = usp.get("to")
            to ? navigate(to,{replace:true}) : navigate(-1)
            
        } catch (_) {}
    }
    // 发送验证码
    //存储倒计时
    let timer = null,
        num = 31;
    //倒计时函数
    const countdown = () =>{
        num--;
        if(num === 0){
            clearInterval(timer);
            timer = null;
            setSendText("发送验证码");
            setDisabled(false)
            return;
        };
        setSendText(`${num}秒后重发`);
    }

    const send = async () => {
        try {
            await formIns.validateFields(["phone"])
            //手机号格式校验通过
            let phone = formIns.getFieldValue("phone");
            let {code} = await api.sendPhoneCode(phone);
            if(+code !== 0){
                Toast.show({
                    icon:"fail",
                    content:"发送失败"
                })
            }
            //发送成功 --将按钮改成不可操作状态
            setDisabled(true)

            //倒计时
            countdown()
            if(!timer){
                timer = setInterval(countdown,1000)
            } 

        } catch (_) {}
    }

    //组件销毁的时候:把没有清除的定时器干掉
    useEffect(()=>{
        return ()=> {
            if(timer){
                clearInterval(timer)
                timer = null
            }
        }
    },[])

    return (
        <div className='login-box'>
            <NavBarAgain title="登录/注册"/>
            <Form
                layout="horizontal"
                style={{
                    "--border-top":"none"
                }}
                footer={
                    <ButtonAgain 
                        color="primary"
                        onClick={submit}
                    > 
                        提交
                    </ButtonAgain>
                }
                form={formIns}
                initialValues={{
                    phone:"",
                    code:""
                }}
                requiredMarkStyle={false}
            >
                <Form.Item
                    name='phone'
                    label='手机号'
                    rules={[{validator:validate.phone}]}
                    >
                    <Input placeholder='请输入手机号' />
                </Form.Item> 

                <Form.Item
                    name='code'
                    label='验证码'
                    extra={
                        <ButtonAgain 
                            size="small"
                            color="primary" 
                            onClick={send} 
                            disabled={btnDisabled} 
                            >
                            {sendText}
                        </ButtonAgain>
                    }
                    // rules={[{validator:validate.code}]}
                    rules={[
                        { required:true,message:"验证码是必须要填的!" },
                        { pattern: /^\d{6}$/,message:"验证码格式有误!"}
                    ]}
                    >
                        <Input />
                </Form.Item>
            </Form>
        </div>
    )
}

export default connect(
    null,
    action.base
)(Login)
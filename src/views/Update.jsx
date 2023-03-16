import React,{useState} from 'react'
import {connect} from "react-redux"
import styled from "styled-components"
import {ImageUploader,Input,Toast} from "antd-mobile"
import ButtonAgain from "../components/ButtonAgain"
import NavBarAgain from "../components/NavBarAgain"
import action from "../store/actions/index"
import api from "../api/index"

//样式
const UpdateBox = styled.div`
    .formBox {
        padding: 30px;

        .item {
            display: flex;
            align-items: center;
            height: 110px;
            line-height: 110px;
            font-size: 28px;

            .label {
                width: 20%;
                text-align: center;
            }

            .input {
                width: 80%;
            }
        }
    }

    .submit {
        display: block;
        margin: 0 auto;
        width: 60%;
        height: 70px;
        font-size: 28px;
    }
`;

function Update(props) {
    let {navigate,info,queryUserInfoAsync} = props;
    //定义状态
    let [pic,setPic] = useState([{url:info.pic}]),
        [userName,setUserName] = useState(info.name);


    //图片上传
    //限制大小
    const limitImage = (file) => {
        let limit = 1024 * 1024
        if(file.size > limit){
            Toast.show({
                icon:"fail",
                content:"图片大小必须在1MB以内"
            })
            return null
        }
        return file
    }
    //上传至服务器
    const uploadImage = async (file) =>{
        let temp;
        try {
            let {code,pic} = await api.upload(file)
            if(+code !== 0){
                Toast.show({
                    icon:"fail",
                    content:"图片上传失败"
                })
                return;
            }
            //服务器会返回上传图片成功后的图片地址
            setPic([{
                url:pic
            }])
            temp = pic
        } catch (_) {}

        //upload事件绑定的方法执行完一定要返回一个对象，包含url和图片的地址，否则会报错！
        return {
            url:temp
        }
    }

    //提交信息
    const submit = async () => {
        //表单校验
        //pic是个数组[{url:xxxx}]
        if(pic.length === 0) {
            Toast.show({
                icon:"fail",
                content:"请先上传图片"
            })
            return;
        }
        if(userName.trim() === ""){
            Toast.show({
                icon:"fail",
                content:"请先输入账号"
            })
            return;
        }
        //获取信息,发送请求
        let [{url}] = pic;
        try {
            let { code} = await api.userUpdate(userName.trim(),url)
            if(+code !== 0) {
                Toast.show({
                    icon:"fail",
                    content:"修改信息失败"
                })
                return;
            }
            Toast.show({
                icon:"success",
                content:"修改信息成功"
            })
            //同步redux
            queryUserInfoAsync()
            navigate(-1)
            
        } catch (_) {}
    }

    return (
        <UpdateBox>
            <NavBarAgain title="修改信息"/>
            <div className="formBox">
                <div className="item">
                    <div className="label">头像</div>
                    <div className="input">
                        <ImageUploader 
                            maxCount={1} 
                            value={pic}
                            onDelete={() =>{setPic([])}}
                            beforeUpload={limitImage}
                            upload={uploadImage}
                        />
                    </div>
                </div>
                <div className="item">
                    <div className="label">姓名</div>
                    <div className="input">
                        <Input placeholder='请输入账号名称' value={userName} onChange={val => {
                            setUserName(val)
                        }}/>
                    </div>
                </div>
                <ButtonAgain color='primary' className="submit" onClick={submit}>
                    提交
                </ButtonAgain>
            </div>
        </UpdateBox>
    )
}
export default connect(
    state => state.base,
    action.base
)(Update)
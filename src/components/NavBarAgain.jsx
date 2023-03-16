import React from 'react'
import { useNavigate,useLocation,useSearchParams } from 'react-router-dom';
import {NavBar} from "antd-mobile"
import PropTypes from "prop-types"
import './NavBarAgain.less';

function NavBarAgain(props) {
    let {title} = props;
    const navigate = useNavigate(),
        location = useLocation(),
        [usp] = useSearchParams();
    
    const handleBack = () => {
        //特殊：登录页 && to的值是/detail/xxx
        let to = usp.get("to")
        
        if(location.pathname === "/login" && /^\/detail\/d+$/.test(to)){
            navigate(to,{replace:true})
        }
        navigate(-1)
    }
    return (
        <NavBar className="navbar-again-box" onBack={handleBack}>
            {title}
        </NavBar>
    )
}
NavBarAgain.defaultProps = {
    title:"个人中心"
}
NavBarAgain.propTypes = {
    title:PropTypes.string
}
export default NavBarAgain;
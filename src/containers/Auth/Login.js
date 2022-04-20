import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";

import * as actions from "../../store/actions";

import './Login.scss';
import { FormattedMessage } from 'react-intl';
import { handleLoginApi } from '../../services/userService';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isShowPassword: false,
            errorMessage: '',
        }
    }
    handleOnchangeUserName = (e) => {
        this.setState({ username: e.target.value })
    }
    handleOnchangePassword = (e) => {
        this.setState({ password: e.target.value })
    }

    handleLogin = async () => {
        this.setState({
            errorMessage: '',
        })
        console.log('userName:', this.state.username, 'password:', this.state.password)
        console.log('all', this.state)
        try {
            let data = await handleLoginApi(this.state.username, this.state.password);
            if (data && data.errCode !== 0) {
                this.setState({
                    errorMessage: data.message,
                })
            }
            if (data && data.errCode === 0) {
                this.props.userLoginSuccess(data.user)
                console.log('login succeeds');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({ errorMessage: error.response.data.message })
                }
            }
        }
    }
    handleShowPassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword
        })
    }
    render() {

        return (
            <div className='login-background'>
                <div className='login-container'>
                    <div className='login-content row'>
                        <div className='col-12 text-center text-login'>
                            Login
                        </div>
                        <div className='col-12 form-group login-input'>
                            <label>Username:</label>
                            <input type='text'
                                placeholder='Enter your username'
                                className='form-control'
                                value={this.state.username}
                                onChange={(e) => {
                                    this.handleOnchangeUserName(e)
                                }} />
                        </div>
                        <div className='col-12 form-group login-input'>
                            <label>Password:</label>
                            <input type={this.state.isShowPassword ? 'text' : 'password'}
                                placeholder='Enter your password' className='form-control'
                                value={this.state.password}
                                onChange={(e) => {
                                    this.handleOnchangePassword(e)
                                }} />
                            <span className='eye'
                                onClick={() => { this.handleShowPassword() }}
                            >
                                <i className={this.state.isShowPassword ? 'fas fa-eye' : 'fas fa-eye-slash'}></i>
                            </span>
                        </div>
                        <div className='col-12 errMessage'>
                            {this.state.errorMessage}
                        </div>
                        <div className='col-12'>
                            <button
                                className='btn-login'
                                onClick={() => { this.handleLogin() }}
                            >Login</button>
                        </div>
                        <div className='col-12'>
                            <span className='forgot-password'>Forgot your password</span>
                        </div>
                        <div className='col-12 text-center mt-3'>
                            <span>Or login with:</span>
                        </div>
                        <div className='col-12 social-login'>
                            <i className="fab fa-google-plus-g google"></i>
                            <i className="fab fa-facebook-f facebook" ></i>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

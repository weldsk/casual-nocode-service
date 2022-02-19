import React, { Component, FormEvent } from "react";
import axios, {AxiosResponse, AxiosError} from "axios";

type LoginState = {
  email:string,
  password:string
};
export default class Login extends Component<{}, LoginState> {
  constructor(props: {}){
    super(props);
    this.state={
      email:"",
      password:"",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event:FormEvent<HTMLFormElement>) {//Post Request
    const postData = {
        email:this.state.email,
        password:this.state.password
    }
    axios.post(process.env.REACT_APP_API_URL+"/login",postData
    ).then((response:AxiosResponse)=>{
      if(response.data.token) {
        localStorage.setItem("user",JSON.stringify(response.data))
      }
    }).catch((error:AxiosError)=>{
      /*TOOD*/
    })
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Sign In</h3>
        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={this.state.email}
            onChange={(event:React.ChangeEvent<HTMLInputElement>) =>
              this.setState({email:event.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={this.state.password}
            onChange={(event:React.ChangeEvent<HTMLInputElement>) =>
              this.setState({password:event.target.value})}
          />
        </div>
        <div className="form-group">
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id="customCheck1"
            />
            <label className="custom-control-label" htmlFor="customCheck1">
              Remember me
            </label>
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          Login
        </button>
        <p className="forgot-password text-right">
          Forgot <a href="#">password?</a>
        </p>
      </form>
    );
  }
}

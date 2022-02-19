import React, { Component, FormEvent } from "react";
import axios, {AxiosResponse, AxiosError} from "axios";

type RegistrationState = {
  name:string,
  email:string,
  password:string
};
export default class SignUp extends Component<{}, RegistrationState> {
  constructor(props: {}){
    super(props);
    this.state={
      name:"",
      email:"",
      password:"",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event:FormEvent<HTMLFormElement>) {//Post Request
    const postData = {
        name:this.state.name,
        email:this.state.email,
        password:this.state.password
    }
    axios.post(process.env.REACT_APP_API_URL+"/signup",postData
    ).then((response:AxiosResponse)=>{
      /*TODO*/
    }).catch((error:AxiosError)=>{
      /*TODO*/
    })
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Sign Up</h3>

        <div className="form-group">
          <label>User name</label>
          <input
            type="text"
            className="form-control"
            placeholder="User name"
            value={this.state.name}
            onChange={(event:React.ChangeEvent<HTMLInputElement>) =>
              this.setState({name:event.target.value})}
          />
        </div>

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

        <button
         type="submit"
         className="btn btn-primary btn-block"
        >
          Sign Up
        </button>
        <p className="forgot-password text-right">
          Already registered <a href="#">sign in?</a>
        </p>
      </form>
    );
  }
}

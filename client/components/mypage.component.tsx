
import React, { Component, FormEvent } from "react";
import { Form } from 'react-bootstrap';
import axios, {AxiosResponse, AxiosError} from "axios";
import authHeader from "../services/auth-header";

export default class MyPage extends Component<{}, {}> {
  constructor(props: {}){
    super(props);
  }

  render() {
    return (
      <div className="fill-page">
        <h3>MyPage</h3>
        <label>{this.getName()}</label>
      </div>
    );
  }
  getName(): string
  {
    axios.get(process.env.REACT_APP_PRIVATE_API_URL + "/status", { headers: authHeader() })
      .then((response: AxiosResponse) => {
        return ""
      }).catch((error: AxiosError) => {
        // TODO
      })
    return ""
  }
}
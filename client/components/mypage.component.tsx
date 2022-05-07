
import React, { Component, FormEvent } from "react";
import { Card, Form } from 'react-bootstrap';
import axios, {AxiosResponse, AxiosError} from "axios";
import authHeader from "../services/auth-header";

export default class MyPage extends Component<{}, {}> {
  constructor(props: {}){
    super(props);
  }

  render() {
    return (
      <div className="fill-page">
        <h2>MyPage</h2>
        <Card>
          <Card.Header as="h3">Username</Card.Header>
          <Card.Text>
          {this.getName()}
          </Card.Text>
        </Card>
      </div>
    );
  }
  getName(): string
  {
    axios.get(process.env.REACT_APP_PRIVATE_API_URL + "/userinfo", { headers: authHeader() })
      .then((response: AxiosResponse) => {
        return "aa"
      }).catch((error: AxiosError) => {
        // TODO
        return "bb"
      })
    return "(Loading...)"
  }
}
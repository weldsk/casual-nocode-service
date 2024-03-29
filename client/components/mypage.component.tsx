
import { Component } from "react";
import { Card } from 'react-bootstrap';
import axios, {AxiosResponse, AxiosError} from "axios";
import authHeader from "../services/auth-header";

export default class MyPage extends Component<{}, { name: string, email: string }> {
  constructor(props: {}){
    super(props);
    this.state={
      name: "Loading...",
      email: "Loading...",
    }
  }
  componentDidMount(){
    axios.get(process.env.REACT_APP_PRIVATE_API_URL + "/userinfo", { headers: authHeader() })
      .then((response: AxiosResponse) => {
        this.setState({
          name: response.data.username,
          email: response.data.email,
        });
      }).catch((error: AxiosError) => {
        this.setState({
          name: "Error!",
          email: "Error!",
        });
      })
  }
  render() {
    return (
      <div className="full-page">
        <h2>MyPage</h2>
        <Card>
          <Card.Header as="h3">Username</Card.Header>
          <Card.Text>{this.state.name}</Card.Text>
        </Card>
        <Card>
          <Card.Header as="h3">Email Address</Card.Header>
          <Card.Text>{this.state.email}</Card.Text>
        </Card>
      </div>
    );
  }
}

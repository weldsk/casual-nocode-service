import prof from "../img/test.jpg";
import { Component } from "react";
import { Card, Button } from 'react-bootstrap';
import axios, { AxiosResponse, AxiosError, Axios } from "axios";
import authHeader from "../services/auth-header";
import React, { useState, useRef } from 'react'
import { useAsyncCallback } from 'react-async-hook'


export default class MyPage extends Component<{}, { name: string, email: string, mode: string }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      name: "Loading...",
      email: "Loading...",
      mode: "profile",
    }
    this.handlemode = this.handlemode.bind(this)

  }
  componentDidMount() {
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
  renderContent() {
    switch (this.state.mode) {
      case "profile":
        return (
          <><Card>
            <Card.Header as="h3">Username</Card.Header>
            <Card.Text>{this.state.name}</Card.Text>
          </Card><Card>
              <Card.Header as="h3">Email Address</Card.Header>
              <Card.Text>{this.state.email}</Card.Text>
            </Card></>
        )
      case "figure":
        const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          console.log(e.target.files);
        };
        const initialState = {
          file: null,
        }
        /* アップロード処理 */
        const handleSubmit = async (event: React.MouseEvent) => {
          event.preventDefault()
          const submitData = new FormData()
          if (fileInput.current instanceof HTMLInputElement && fileInput.current.files) {
            submitData.append("image", fileInput.current.files[0])
            await axios.post(process.env.REACT_APP_PRIVATE_API_URL + "/seticon", fileInput,
              {
                headers: {
                  'content-type': 'multipart/form-data',
                },
              })
          }
        };
        const fileInput = React.createRef<HTMLInputElement>()
        const displayIcon = async () => {
          console.log("bbbbbbbbbbbbbbbbb");
          await axios.get(process.env.REACT_APP_PRIVATE_API_URL + "/geticon",
            {
              headers: {
                'content-type': 'multipart/form-data',
              },
            }).then((response: AxiosResponse) => {
              return (<img src={response.data} alt="ユーザー設定" title="ユーザー設定"></img>)
            }).catch((error: AxiosError) => {
              console.log("aaaaaaaaaaaaaaaa");
              return (<img src="../img/defaulticon.png" alt="デフォルト" title="デフォルト"></img>)
            })
        };

        return (
          <div>
            {displayIcon()}
            <button onClick={handleSubmit}>ファイルアップロード</button>
            <input
              type="file"
              ref={fileInput}
              accept="image/*"
              onChange={onFileInputChange}
            />
          </div>

          // <><Card>
          //   <Card.Header as="h3">Username</Card.Header>
          //   <Card.Text>{this.state.name}</Card.Text>
          // </Card></>
        )
    }
  }
  render() {
    return (
      <div className="FullPage">
        <div className="MypageButton"><h2>MyPage</h2>
          <button onClick={() => this.handlemode("profile")}>ユーザー情報</button>
          <button onClick={() => this.handlemode("figure")}>プロフィール画像</button>
          {/* <Button onClick={this.handleProfile} >プロフィール</Button>
          <Button as="input" type="button" value="ユーザー名変更" />{' '}
          <Button as="input" type="button" value="ユーザー画像変更" />{' '}
          <Button as="input" type="button" value="テスト" />{' '} */}
        </div>


        <div className="MypageContents">
          {this.renderContent()}
          {/* <Card>
            <Card.Header as="h3">Username</Card.Header>
            <Card.Text>{this.state.name}</Card.Text>
          </Card>
          <Card>
            <Card.Header as="h3">Email Address</Card.Header>
            <Card.Text>{this.state.email}</Card.Text>
          </Card> */}
        </div>
      </div>
    );
  }
  handlemode(nextmode: string) {
    this.setState({
      mode: nextmode,
    })
  }
}


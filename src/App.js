import React from 'react';
import {
  Link,
  Route,
} from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import Home from './components/Home';
import Canvas from './components/Canvas';
import HostPage from './components/HostPage';
import JoinPage from './components/JoinPage';
import HostOrJoin from './components/HostOrJoin';
import HowToPlay from './components/HowToPlay';
import WaitPage from './components/WaitPage';
import styles from './css/JoinPage.module.css';
import Answer from './components/Answer';
// import SubmitAnswer from './components/SubmitAnswer';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      drawingData: '',
      drawing: '',
      drawEnd: false,
      name: '',
      gamePin: '',
      roomId: '',
      saveRoomId: '',
      socketRoomId: '',
      users: '',
      redirect: false,
      joined: styles.joinButton,
      isHost: false,
      answerChoices: ['bird', 'birdDog', 'Flying Panda!'],
      start: false,
      pointsArray: '',
      showHost: true,
      kickUsers: false,
      showJoin: false
    };  
  }

  componentDidMount() {
    // const { host } = window.location;
    const url = `ws://10.150.41.125:4000/ws`;
    this.connection = new WebSocket(url);

    this.connection.onmessage = (e) => {
      console.log(e.data);
      const data = JSON.parse(e.data);
      console.log(data);
      const {users, newUsers, roomPin, start, pointsArray, showHostButton, kickUsers, showJoinButton} = JSON.parse(e.data)
      console.log("================= You put a console log here =================");
      console.log(newUsers);

      Object.keys(data).forEach((key) => {
        switch(key){
          // case 'drawData':
          //   console.log("drawData did a thing in new switch");
          //   this.setState({
          //     drawingData: drawData
          //   })
          //   break;
          case 'users': 
            console.log("users did a thing in new switch");
            this.setState({
              users: users
            })
            break;
          case 'roomPin': 
            console.log("roomId did a thing in new switch");
            this.setState({
              socketRoomId: roomPin
            })
            break;
          case 'start': 
            console.log("start did a thing in new switch");
            this.setState({
              start,
              users: newUsers,
            })
            break;
          case 'pointsArray':
            this.setState({
              pointsArray
            })
            break;
          case 'showHostButton':
            this.setState({
              showHost: showHostButton
            })
            break;
          case 'kickUsers':
            this.setState({
              kickUsers
            })
            break;
          case 'showJoinButton':
            this.setState({
              showJoin: showJoinButton
            })
            break;
          default: 
            console.log('Not working - NEW switch')
            break;
        }
      })
      // console.log(this.state.socketRoomId.roomId);
      // console.log (this.state.drawing)
    }
  }
  
  render() {
    return (
      <div className="App">
        <Route exact path='/' component={Home} />
        <Route exact path='/how-to-play' component={HowToPlay} />
        <Route path="/answer" component={(props) => (
            <Answer {...props} answerChoices={this.state.answerChoices} />
          )}/>
        {/* <Route path="/submitanswer" component={(props) => (
            <SubmitAnswer {...props} submitAnswer={this._addAnswerChoice}/>
          )}/> */}
        <Route path='/host-or-join' render={(props) => (
            <HostOrJoin {...props} showJoin={this.state.showJoin} isHost={this.state.isHost} handleClickHost={this._setPin} showHost={this.state.showHost} />
          )} />
        <Route path='/host' render={(props) => (
            <HostPage {...props} users={this.state.users} pin={this.state.roomId} resetData={this._resetData} confirmHost={this._confirmHost} />
          )} />
        <Route path='/join' render={(props) => (
            <JoinPage {...props} nameValue={this.state.name} name={this._handleChangeName} pinValue={this.state.gamePin} pin={this._handleChangePin} submit={this._handleSubmitJoin} activate={this.state.joined} />
        )} />
        <Route path ='/wait' render={(props) =>(
          <WaitPage {...props} kickUsers={this.state.kickUsers} isHost={this.state.isHost} gameStart={this.state.start} handleLeave={this._leaveWaitPage}/>
        ) } />
        <Route path ='/canvas' render={(props) =>(

          <Canvas users={this.state.users} hostStatus={this.state.isHost} isHost={this.state.isHost} connection={this.connection} name={this.state.name} points={this.state.pointsArray}/>
        ) } />

        {/* {this.state.start && !this.state.isHost ? <Canvas setDrawingData={this._setDrawingData} handleSend={this._sendDrawing} drawing={this.state.drawingData} saveableCanvas={this.saveableCanvas} /> : null} */}
      </div>
    )
  }
  _login = () => {
    this.connection.send(JSON.stringify({
      login: 1
    }))
  }

  _drawTimeCount = () => {
    this.setState({
      drawEnd: true
    })
  }
  
  _handleChangeName =(event)=> {
    console.log (event.target.value)
    this.setState({
        name: event.target.value
    })
  }
  _handleChangePin =(event)=> {
    console.log (event.target.value)
    
    this.setState({
        gamePin: event.target.value
    })
    if(event.target.value === this.state.socketRoomId) {
      this.setState({
        joined: styles.joinButtonActivated
      })
    }
  }
  _handleSubmitJoin = e =>{
    if (this.state.gamePin === this.state.socketRoomId) {
      this.connection.send(JSON.stringify({
        name: this.state.name,
        gamePin: this.state.gamePin,
        showHost: this.state.showHost
      }))
      // window.location.assign('http://localhost:3000/wait')
    } else if(this.state.gamePin !== this.state.socketRoomId){
      alert("WRONG PIN")
    }
  }
  _setPin = (roomId) => {
    this.setState({
      roomId,
      showHost: false,
      kickUsers: false,
      showJoin: true
    }, () => {
      this.connection.send(JSON.stringify({
        showJoin: this.state.showJoin, 
        kickUsers: this.state.kickUsers, 
        roomId: this.state.roomId, 
        showHost: this.state.showHost
      }));
    })
  }
  _resetData = () => {
    this.setState({
      saveRoomId: this.state.roomId,
      roomId: true,
      showHost: true,
      kickUsers: true,
      showJoin: false
    }, () => {
      this.connection.send(JSON.stringify({
        showJoin: this.state.showJoin, 
        kickUsers: this.state.kickUsers, 
        roomId: this.state.roomId, 
        saveRoomId: this.state.saveRoomId, 
        showHost: this.state.showHost
      }))
    })
  }

  _confirmHost = () => {
    this.setState({
      isHost: true
    }, () => {
      this.connection.send(JSON.stringify({
        start: true, 
        roomId: this.state.socketRoomId
      }));
    })
    console.log(this.state.isHost);
    console.log(this.state.start);
  }

  _addAnswerChoice = (newAnswer) => {
    this.setState({
      answerChoices: [...this.state.answerChoices, newAnswer]
    })
    console.log("Did you ring?");
  }

}


export default App;

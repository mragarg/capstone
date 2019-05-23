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

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      drawingData: '',
      drawing: '',
      activePlayer: true,
      drawEnd: false,
      name: '',
      gamePin: '',
      roomId: '',
      socketRoomId: '',
      users: '',
      redirect: false
    };  
  }

  componentDidMount() {
          //  If player is active player, draw data from state will be sent over websocket to database 
        // if (this.state.activePlayer=== true) {
        //     setInterval(async () => {
        //       const saveData = this.saveableCanvas.getSaveData(); 
        //           const object = []
        //           object.push(saveData)
        //             this.setState({
        //               drawingData: object
        //           })
        //       this.connection.send(JSON.stringify({message: this.state.drawingData[0]}));
        //       // this.saveableCanvas.loadSaveData(this.state.drawing[this.state.drawing.length-1])
        //     }, 8000);

        //       // If player is not active player, canvas should load new save data from state every 10 seconds
        // } else if (this.state.activePlayer=== false) {
        //     setInterval(async () => {
        //       this.saveableCanvas.loadSaveData(this.state.drawing[this.state.drawing.length-1])
        //     }, 10000)


        // }
    /// need to create countdown (30-45 seconds) that sets activePlayer to false;
    /// perhaps have another state variable that passes in ID of sorts based on when the 
    // player enters the room. 

    // const { host } = window.location;
    const url = `ws://localhost:4000/ws`;  // Sadly, the react proxy not playing well with websockets
    this.connection = new WebSocket(url);

    this.connection.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const {drawData,roomId,users} = JSON.parse(e.data)

      // switch(Object.keys(data)[0]){
      //   case 'users':
      //       this.setState({
      //         users
      //       })
      //     break;
      //   default:
      //     console.log("Still not working - first switch");
      //     break;
      // }
      // switch(Object.keys(data)[1]){
      //   case 'drawData':
      //     this.setState({
      //       drawingData: drawData
      //     })
      //     break;
      //   case 'users': 
      //     this.setState({
      //       users: users,
      //       socketRoomId:roomId
      //     })
      //     break;
      //   default: 
      //     console.log('Not working - second switch')
      //     break;
      // }

      Object.keys(data).forEach((key) => {
        switch(key){
          case 'drawData':
            console.log("drawData did a thing in new switch");
            this.setState({
              drawingData: drawData
            })
            break;
          case 'users': 
            console.log("users did a thing in new switch");
            this.setState({
              users: users
            })
            break;
          case 'roomId': 
            console.log("roomId did a thing in new switch");
            this.setState({
              socketRoomId:roomId
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
        <Route path='/host-or-join' render={(props) => (
            <HostOrJoin {...props} handleClickHost={this._setPin} />
          )} />
        <Route path='/host' render={(props) => (
            <HostPage {...props} users={this.state.users} pin={this.state.roomId} resetPin={this._resetPin} />
          )} />
        <Route path='/join' render={(props) => (
            <JoinPage {...props} nameValue={this.state.name} name={this._handleChangeName} pinValue={this.state.gamePin} pin={this._handleChangePin} submit={this._handleSubmitJoin}/>
        )} />
        <Route path ='/wait' render={(props) =>(
          <WaitPage {...props} />
        ) } />
        {/* <Canvas setDrawingData={this._setDrawingData} handleSend={this._sendDrawing} drawing={this.state.drawingData} saveableCanvas={this.saveableCanvas} /> */}
      </div>
    )
  }
  _login = async () => {
    this.connection.send(JSON.stringify({
      login: 1
    }))
  }

  _sendDrawing = async () => {  
    this.connection.send(JSON.stringify({drawData: this.state.drawingData[0]}));
  }
  
  _setDrawingData = (object) => {
    this.setState({
      drawingData: object
    })
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
  }
  _handleSubmitJoin = async ()=>{
    if (this.state.gamePin === this.state.socketRoomId) {
      this.connection.send(JSON.stringify({
        name: this.state.name,
        gamePin: this.state.gamePin
      }))
      window.location.assign('http://localhost:3000/wait')
    } else if(this.state.gamePin !== this.state.socketRoomId){
      alert("WRONG PIN YOU FUCK")
    }
  }
  _setPin = async (roomId) => {
    await this.setState({
      roomId
    })
    this.connection.send(JSON.stringify({roomId: this.state.roomId}));
  }
  _resetPin = () => {
    this.setState({
      roomId: '',
      socketRoomId: ''
    })
  }
}


export default App;

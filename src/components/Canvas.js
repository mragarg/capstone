import React from 'react';
import CanvasDraw from 'react-canvas-draw';
import styled from 'styled-components';
import logo from '../img/picme-logo.png';
import AnswerSubmit from './AnswerSubmit'
import ReactCountdownClock from 'react-countdown-clock';
import {
    Link
  } from 'react-router-dom';

export default class Canvas extends React.Component {
    // {handleSend, drawingData, saveableCanvas, setDrawingData, hostStatus}
    constructor(props) {
        super(props);
        this.state = {
            saveableCanvas: '',
            userAnswer: '',
            drawingData: '',
            userAnswers: '',
            submittedAnswer: false,
            playerNumber: '',
            activePlayer: 0,
            currentPoints: 0,
            pointsArray: '',
            prompts: ['talking bird', 'bird dog', 'flying panda', 'chicken taco', 'wizard on a pole', 'Seil on a seal', 'airplane pencil', 'aliens telling secrets', 'intelligent soil', 'fighting noodles', 'fake moon landing', 'dog on a boat', 'pitcher of nachos', 'missed high five', 'shakey knees', 'dinosaur baby', 'radishmouse', 'harambae', 'owl in pants', 'a lunch tray on fire', 'banana big toe', 'cat fart', 'lazy zebra', 'crying hyena', 'jake from state farm', 'tony the tiger eating the fruit loops bird', 'running turtle', 'm&m rapping', 'a packet of eminems', 'couch on fire', 'embarassing photo of spongebob', 'christmas tree during halloween', 'crying dinosaur', 'pug on a treadmill', 'pirate in a hammock', 'person with donuts for eyes', 'cowboy on a polar bear', 'flamingo doing ballet', 'coal under pressure', 'shakesbeer', 'souperhero', 'a person under a tack'],
            randomNum: 0,
            timerOn: true,
            receivedPoint: false,
            selectedUser: '',
            timerOn: true,
            picked: false        
        }
    }
    
    componentDidMount(){
    let max = this.state.prompts.length;
    let min = 0;
    this.state.randomNum = Math.floor(Math.random() * (+max - +min)) + +min;
    if(this.props.connection) {
        this.setState({
            playerNumber:this.props.users.indexOf(this.props.name)
        })

        this.props.connection.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log(data)
            const {drawData, userAnswers, nextPlayer, pointsArray, timerOn, selectedUser} = JSON.parse(e.data);
            Object.keys(data).forEach((key) => {
                switch(key){
                    case 'drawData':
                        console.log("drawData did a thing in new switch");
                        this.setState({
                        drawingData: drawData
                        })
                    break;
                    case 'userAnswers':
                        console.log('userAnswers is getting pushed to setState')
                        if(userAnswers.length >= this.props.users.length -1 && this.state.picked === true) {
                            this.setState({
                                userAnswers: '' 
                            })
                        } else {
                        this.setState({
                            userAnswers
                        })
                    }
                        console.log(this.state.userAnswers)
                        break;
                    case 'nextPlayer':
                        console.log('nextPlayer did a thing')
                        this.setState({
                            receivedPoint: true,
                            selectedUser
                        })
                        if(this.state.selectedUser !== this.state.activePlayer) {
                        setTimeout(() => {
                            this.setState({
                                activePlayer: nextPlayer,
                                submittedAnswer:false,
                                userAnswers: '',
                                timerOn: timerOn,
                                selectedUser: -2
                            })
                            this.setState({
                                timerOn: true,
                                receivedPoint: false
                            })
                        }, 4500);
                    }
                        console.log(this.state.activePlayer)
                        break;
                    case 'pointsArray':
                        console.log('pointsArray did a thing')
                        this.setState({
                            pointsArray
                        })
                default:
                    break;
                }
            })
        }
    } else {
        console.log('no props! Start again from the beginning :)')
    }
}
    
    render() {
        if(this.props.hostStatus){
            console.log("YOU ARE IN IF HOSTSTATUS")
            if(this.state.drawingData){
                console.log("YOU ARE INSIDE THE OF set interval. check to see if data is still there")
                this.saveableCanvas.loadSaveData( //get derived states from props CONVERT TO CLASS
                    this.state.drawingData
                )
            }
        }
        // let max = this.state.prompts.length;
        // let min = 0;
        // let randomNum = Math.floor(Math.random() * (+max - +min)) + +min;

        return (
            <div>
            <AppLogo src={logo} />
            <Wrapper> 
                {/* Prompts */}
                <div>
                {(this.state.selectedUser === this.state.playerNumber) ? <h1>YOU DID IT</h1> : null}
                    <p>
                        {(this.state.activePlayer === this.state.playerNumber) ? this.state.prompts[this.state.randomNum] : null}
                    </p>
                </div>
                {/*   Host disabled canvas ternary render  */}
                {this.state.timerOn ? <ReactCountdownClock seconds={20}
                        color="#E50066"
                        alpha={1}
                        size={100}
                        paused={false}
                        onComplete={this._hideTimer}
                        // pausedText="00"
                        // onComplete={}
                    /> : null }
                
                { this.props.hostStatus  ?  
                <div >
                    {/* <ReactCountdownClock seconds={20}
                        color="#E50066"
                        alpha={1}
                        size={100}
                        paused={false}
                        // pausedText="00"
                        // onComplete={}
                    /> */}
                    
                    <CanvasDraw lazyRadius={0} immediateLoading={true} disabled ref={canvasDraw => {
                    (this.saveableCanvas = canvasDraw)
                    }} />
                    {/* End Game Button */}
                    <Link onClick={() => console.log("You clicked endgame")} to='/endgame'>
                        <Button1>End Game</Button1>
                    </Link>
                    {/*   User list and user points data render  */}
                    <ul>
                        {this.props.users ? this.props.users.map((user, i) => (<li key={i}>Player:{' '}{user} Points{' '}:{this.state.pointsArray[i]}</li>)) : null}
                    </ul> 
                    <h4> Answers </h4>
                        {this.state.userAnswers ? this.state.userAnswers.map((answer, i )=>(<li key={i}>{answer}</li>)): null}
                </div> : (this.state.activePlayer === this.state.playerNumber && this.state.picked ===false) ?
                // {/* //  User enabled canvas ternary render */}
                    <div onTouchEnd={async() => {
                        const saveData = await this.saveableCanvas.getSaveData();
                        const object = [];
                        object.push(saveData);
                        this._setDrawingData(object);
                        console.log(object);
                        this._sendDrawing();
                    }}
                    onMouseUp={async() => {
                        const saveData = await this.saveableCanvas.getSaveData();
                        const object = [];
                        object.push(saveData); 
                        this._setDrawingData(object);
                        console.log(object);
                        this._sendDrawing();
                    }}>

                        <CanvasDraw lazyRadius={0} brushRadius={5} immediateLoading={true} ref={canvasDraw => {
                            (this.saveableCanvas = canvasDraw)
                        }} />
                        {/* Maps user answers as buttons to the active player */}
                        { (this.state.userAnswers !== '') ? this.state.userAnswers.map((answer, i )=>(<li key={i}><button onClick={this._chooseAnswer} value={answer}>{answer}</button></li>)) : null}
                    </div> : 
                    // Answer Submit form
                    (this.state.activePlayer !== this.state.playerNumber && this.state.submittedAnswer === false) ?
                    <AnswerSubmit answerValue={this.state.userAnswer} handleChangeAnswer={this._handleChangeAnswer} submitAnswer={this._handleSubmit}/>
                    // Submitted answer 
                    : (this.state.activePlayer !== this.state.playerNumber && this.state.submittedAnswer === true) ? <div> Submitted answer! Good luck</div> 
                    : null}
                </Wrapper>
                </div>
        )
    }
    _sendDrawing = () => {  
        this.props.connection.send(JSON.stringify({drawData: this.state.drawingData[0]}));
      }

    _setDrawingData = (object) => {
        this.setState({
          drawingData: object
        })
      }
    _handleChangeAnswer =(event)=> {
        console.log (event.target.value)
        this.setState({
            userAnswer: event.target.value
        })
    }
    _handleSubmit = () => {
        console.log('submitted! Now have to send to the host')
        this.props.connection.send(JSON.stringify({
            answer: this.state.userAnswer,
            name: this.props.name}))
        this.setState({
            submittedAnswer: true
        })
    }

    _chooseAnswer = (event) => {
        this.setState({
            userAnswers: '',
            picked: true,
            timerOn: false
        })
        this.props.connection.send(JSON.stringify({
            nextPlayer: this.state.activePlayer+1,
            selectedAnswer: event.target.value,
            timerOn: false
        }))
    }

    _displayRandomPrompts = () => {
        let promptArray = this.state.prompts;
        let max = promptArray.length;
        let min = 0;
        let randomNum = Math.floor(Math.random() * (+max - +min)) + +min;
        console.log(promptArray[randomNum]);
        return promptArray[randomNum];
    }
    _hideTimer = () => {
        this.setState({
            timerOn: false
        })
    }
}


const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-wrap: wrap;
    background-color: black;
`;
    
const Button = styled.button`
    background-color: #1A2230;
    color: white;
    width: 125px;
    height: 25px;
    border-radius: 4px;
    font-family: 'Avenir';
    font-size: 16px;
    &:hover {
        cursor: pointer;
        background-color: red;
    }
`;

const AppLogo = styled.img`
  height: 70px;
`
// start game button  
const Button1 = styled.button`
    background-color: #FF2D55;
    color: white;
    width: 200px;
    height: 50px;
    margin-top: 80px;
    margin-bottom: 10px;
    border-radius: 25px;
    border-color: black;
    font-family: 'Montserrat';
    font-weight: bold;
    font-size: 20px;
    &:hover {
        cursor: pointer;
        background-color: #b82640;;
        color: white;
    }
`;

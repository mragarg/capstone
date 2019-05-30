import React from 'react';
import CanvasDraw from 'react-canvas-draw';
import styled from 'styled-components';
import logo from '../img/picme-logo.png';
import AnswerSubmit from './AnswerSubmit'
import ReactCountdownClock from 'react-countdown-clock';
import '../css/Canvas.css'
import Confetti from 'react-confetti'
import { Link, Redirect } from 'react-router-dom';

export default class Canvas extends React.Component {
    targetElement = null;

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
            picked: false, 
            completed: false,
            disabled: false,
            hideGrid: false ,
            timesUp: false,
            answerStyle: 'answerChoicesShow',
            endGame: false,
            resetUserAnswer: false
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

        const originalOnMessage = this.props.connection.onmessage;
        this.props.connection.onmessage = (e) => {
            originalOnMessage(e);
            const data = JSON.parse(e.data);
            console.log(data)
            const {drawData, userAnswers, nextPlayer, pointsArray, timerOn, selectedUser, changeClass, toggleAnswers} = JSON.parse(e.data);
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
                        console.log('completed is gon be trueeeeee');
                        console.log(this.state.completed);
                        this.setState({
                            receivedPoint: true,
                            selectedUser,
                            completed: true
                        })
                        console.log(this.state.completed);
                        
                        setTimeout(() => {
                            console.log('activeplayer', this.state.activePlayer)
                            console.log('nextplayer',nextPlayer)

                            this.setState({
                                hideGrid: false,
                                disabled: false,
                                picked:false,
                                activePlayer: nextPlayer,
                                submittedAnswer: false,
                                userAnswers: '',
                                timerOn: timerOn,
                                selectedUser: '',
                                changeClass: 'answerChoicesHidden',
                                toggleAnswers: 'answerListHidden',
                            })
                            console.log('activeplayer', this.state.activePlayer)
                            console.log('nextplayer',nextPlayer)
                            this.setState({
                                timerOn: true,
                                receivedPoint: false,
                                completed: false
                            })
                        }, 4500);
                    
                        console.log(this.state.activePlayer)
                        break;
                    case 'pointsArray':
                        console.log('pointsArray did a thing')
                        this.setState({
                            pointsArray
                        })
                        break;
                    case 'changeClass':
                        this.setState({
                            changeClass
                        })
                        break;
                    case 'toggleAnswers':
                        this.setState({
                            toggleAnswers
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
        if (this.props.hostStatus){
            console.log("YOU ARE IN IF HOSTSTATUS")
            if(this.state.drawingData){
                console.log("YOU ARE INSIDE THE OF set interval. check to see if data is still there")
                this.saveableCanvas.loadSaveData( //get derived states from props CONVERT TO CLASS
                    this.state.drawingData
                )
            }
        }

        const { width, height } = 400
        return (
            <div>
                {this.props.endGame ? <Redirect to="/" /> : null}
                <div className='logoAndTimer'>
            <AppLogo src={logo} />
                    {/*   Host disabled canvas ternary render  */}
                    {this.state.timerOn && !this.props.endGame ? <ReactCountdownClock seconds={30}
                            color="#E50066"
                            alpha={1}
                            size={100}
                            paused={false}
                            onComplete={this._hideTimer}
                            // pausedText="00"
                            // onComplete={}
                        /> : null }
                    </div>
            <Wrapper> 
                {/* Prompts */}
                <div>
                {(this.state.selectedUser === this.state.playerNumber) ? 
                <div>   <Confetti
                width={width}
                height={height}
                run={this.state.completed}
                /> <h1>You win this round!</h1> </div>  : null}
                    <p>
                        {(this.state.activePlayer === this.state.playerNumber) ? this.state.prompts[this.state.randomNum] : null}
                    </p>
                </div>
                { this.props.hostStatus ?  
                <div>
                    {!this.props.endGame ? <div className='canvasAndAnswers'>
                    <CanvasDraw lazyRadius={0} immediateLoading={true} disabled hideGrid={true}ref={canvasDraw => {
                    (this.saveableCanvas = canvasDraw)
                    }} />
                    {/*   User list and user points data render  */}
                    {/* <h4> Answers </h4> */}
                        
                        <div className={this.state.toggleAnswers}>
                            {this.state.userAnswers ? this.state.userAnswers.map((answer, i )=>(<li key={i}>{answer}</li>)): null}
                        </div>
                    </div> : null}
                    <div>
                        {/* users and respective points to render on the screen */}
                        <ul className='users'>
                            {this.props.users ? this.props.users.map((user, i) => (<li key={i}>{user}: {' '}{this.state.pointsArray[i]}</li>)) : null}
                        </ul> 
                    </div>

                    {/* End Game Button */}
                    <EndButton onClick={() => {
                        this.props.setEndGame();
                        this.props.resetData();
                        this.setState({
                            userAnswers: ''
                        })
                        }}>END GAME</EndButton>
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

                        <CanvasDraw disable={this._showTargetElement} className='canvas' lazyRadius={0} brushRadius={5} immediateLoading={true} disabled={this.state.disabled} hideGrid={this.state.hideGrid} ref={canvasDraw => {
                            (this.saveableCanvas = canvasDraw)
                        }} />
                        {/* Maps user answers as buttons to the active player */}
                    {/* <div className='answerChoices'>
                        {(this.state.userAnswers !== '') ? this.state.userAnswers.map((answer, i )=>(<li key={i} onClick={this._chooseAnswer} value={answer}> {answer}</li>)) : null}
                    </div> */}
                    { (this.state.userAnswers !== '') ? this.state.userAnswers.map((answer, i )=>(<button className={this.state.changeClass} key={i} onClick={this._chooseAnswer} value={answer}>{answer}</button>)) : null}   
                    </div> : 
                    // Answer Submit form
                    (this.state.activePlayer !== this.state.playerNumber && this.state.submittedAnswer === false && this.state.timesUp === false) ? 
                        <div> You have 30 seconds to answer! Hurry Up. 
                            <AnswerSubmit answerValue={this.state.userAnswer} handleChangeAnswer={this._handleChangeAnswer} submitAnswer={this._handleSubmit}/> 
                        </div>
                        : 
                    // (this.state.activePlayer !== this.state.playerNumber && this.state.submittedAnswer=== false && this.state.timesUp === false) ? <div> You have 30 seconds to answer! Hurry Up. </div> : null
                    (this.state.activePlayer !== this.state.playerNumber && this.state.submittedAnswer=== false && this.state.timesUp === true) ? <div> Your time is up. Submit answer.                             <AnswerSubmit answerValue={this.state.userAnswer} handleChangeAnswer={this._handleChangeAnswer} submitAnswer={this._handleSubmit}/> 
                    </div> : 
                    // (this.state.activePlayer !== this.state.playerNumber && this.state.submittedAnswer === false) ?
                    // <AnswerSubmit answerValue={this.state.userAnswer} handleChangeAnswer={this._handleChangeAnswer} submitAnswer={this._handleSubmit}/>
                    // Submitted answer 
                    (this.state.activePlayer !== this.state.playerNumber && this.state.submittedAnswer === true) ? <div> Submitted answer! Good luck</div> 
                    : null}
                    {/* {(this.state.activePlayer !== this.state.playerNumber && this.state.selectedUser === this.state.playerNumber) ? 
                    <Confetti active= {this.state.completed} /> : null } */}
                </Wrapper>
                </div>
        )
    }

    _sendDrawing = () => {  
        this.props.connection.send(JSON.stringify({drawData: this.state.drawingData[0]}));
    }

    _setDrawingData = (object) => {
        this.setState({
            drawingData: object,
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
        this.setState({
            submittedAnswer: true,
            userAnswer: ''
        })
        this.props.connection.send(JSON.stringify({
            answer: this.state.userAnswer,
            name: this.props.name,
            changeClass: 'answerChoicesShow',
            toggleAnswers: 'answerListShow'}))
    }

    _chooseAnswer = (event) => {
        this.setState({
            userAnswers: '',
            picked: true
        })
        this.props.connection.send(JSON.stringify({
            nextPlayer: this.state.activePlayer+1,
            selectedAnswer: event.target.value,
            timerOn: false,
            resetUserAnswer: true
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
            disabled: true,
            hideGrid: true,
            timesUp: true
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
    
const EndButton = styled.button`
    background-color: #E50066;
    color: white;
    width: 150px;
    height: 35px;
    border-color: black;
    border-radius: 25px;
    font-family: 'Avenir';
    font-size: 16px;
    margin-left: 29%;
    &:hover {
        cursor: pointer;
        background-color: darkred;
    }
`;

const AppLogo = styled.img`
    height: 100px;
`

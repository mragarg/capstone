import React from 'react';
import CanvasDraw from 'react-canvas-draw';
import styled from 'styled-components';
import AnswerSubmit from './AnswerSubmit'

export default class Canvas extends React.Component {
    // {handleSend, drawingData, saveableCanvas, setDrawingData, hostStatus}
    constructor(props) {
        super(props);
        this.state = {
            saveableCanvas: '',
            userAnswer: ''
        }
    }
    // componentDidMount(){
    //     setInterval(() => {
    //         if(this.props.hostStatus){
    //             console.log("YOU ARE IN IF HOSTSTATUS")
    //             // console.log(saveableCanvas);
    //             // console.log(drawingData)
    //             if(this.props.drawingData){
    //                 console.log("YOU ARE INSIDE THE OF fucking set interval. check to see if data is still there")
    //                 this.saveableCanvas.loadSaveData( //get derived states from props CONVERT TO CLASS
    //                     this.props.drawingData
    //                 )
    //             }
    //         }
    //     }, 5000);
    // }

    // static getDerivedStateFromProps(props, state) {
    //     console.log("did you call me?")
    //     state.saveableCanvas.loadSaveData( 
    //         props.drawingData
    //     )
    //     console.log(props.drawingData)
    // }
    
    render() {
        if(this.props.hostStatus){
            console.log("YOU ARE IN IF HOSTSTATUS")
            // console.log(saveableCanvas);
            // console.log(drawingData)
            if(this.props.drawingData){
                console.log("YOU ARE INSIDE THE OF fucking set interval. check to see if data is still there")
                this.saveableCanvas.loadSaveData( //get derived states from props CONVERT TO CLASS
                    this.props.drawingData
                )
            }
        }
        return (
            <div>
            <Wrapper> 
                <Button onClick={() => {
                      // localStorage.setItem( "savedDrawing",this.saveableCanvas.getSaveData());
                      // Retrieves from local storage and  pushes into empty array 
                      // const save = localStorage.getItem("savedDrawing")
    
                      // stores canvas data in variable and pushes to array 
    
                    const saveData = this.saveableCanvas.getSaveData(); 
                    const object = [];
                    object.push(saveData);
                    this.props.setDrawingData(object);
                    console.log(object)
                    // this.setState({
                    //     drawingData: object
                    // })
                    // console.log(drawingData)
                }}>
                Save
                </Button>
    
                {/*               Load button will retrieve the last drawing from state  */}
                <Button
                    onClick={() => {
                        console.log('loading data')
                        console.log(this.props.drawingData)
                        this.saveableCanvas.loadSaveData(
                            this.props.drawingData
                        )
                }}
                >Load</Button>
            <Button
                onClick={this.props.handleSend}
                >
                Send Drawing
                </Button>
                {/*   Host disabled canvas ternary render  */}
                { this.props.hostStatus ?  
                <div >
                    <CanvasDraw immediateLoading={true} disabled ref={canvasDraw => {
                    (this.saveableCanvas = canvasDraw)
                    }} />
                    {/*   User list and user points data render  */}
                    <ul>
                        {this.props.users ? this.props.users.map((user, i) => (<li key={i}> {this.props.users[i]}</li>)) : null}
                    </ul> 
                </div> : 
                //  User enabled canvas ternary render
                <div onTouchEnd={async() => {
                    const saveData = await this.saveableCanvas.getSaveData();
                    const object = [];
                    object.push(saveData);
                    this.props.setDrawingData(object);
                    console.log(object);
                    this.props.handleSend();
                }}
                onMouseUp={async() => {
                    const saveData = await this.saveableCanvas.getSaveData();
                    const object = [];
                    object.push(saveData);
                    this.props.setDrawingData(object);
                    console.log(object);
                    this.props.handleSend();
                }}>
                    <CanvasDraw immediateLoading={true} ref={canvasDraw => {
                        (this.saveableCanvas = canvasDraw)
                        // this.setState({
                        //     saveableCanvas: canvasDraw
                        // })
                    }} />
                    <AnswerSubmit answerValue={this.state.userAnswer} handleChangeAnswer={this._handleChangeAnswer} submitAnswer={this._handleSubmit}/>

                    </div>}
            
            </Wrapper>
                
            </div>
        )
    }
    _handleChangeAnswer =(event)=> {
        console.log (event.target.value)
        this.setState({
            userAnswer: event.target.value
        })
    }
    _handleSubmit = () => {
        console.log('submitted! Now have to send to the host')
        const connection = this.props.connection 
        connection.send(JSON.stringify({answer: this.state.userAnswer}))
    }
}


const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-wrap: wrap;
    background-color: black;
    position:fixed;
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


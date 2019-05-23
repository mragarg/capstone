import React from 'react';
import styles from '../css/JoinPage.module.css';
import { Link } from 'react-router-dom'; 



export default function JoinPage ({nameValue, name, pinValue, pin, submit}){
        return (
            <div>
                <div className={styles.text}>
                    <h1>PicMe</h1>
                    <h3>Join a Game</h3>
                </div>
                <div className={styles.inputContainer}>
                    <div className={styles.nameInputContainer}>
                        <h3>Display Name</h3>
                        <input value ={nameValue} className={styles.nameInput} type="text" onChange={name}/>
                    </div>
                    <div className={styles.pinInputContainer}>
                        <h3>Game Pin</h3>
                        <input value= {pinValue} className={styles.pinInput} onChange={pin}/>
                    </div>
                </div>
            <div className={styles.ButtonContainer}>
                <button onClick={submit} className={styles.joinButton}> Join </button>
                <Link to='/host-or-join' className={styles.cancelButton}>Cancel</Link>
            </div>
        </div>
    )
}

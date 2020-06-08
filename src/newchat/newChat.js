import React, { Component } from 'react';
import { FormControl, InputLabel, Input, Button, Paper, withStyles, CssBaseline, Typography } from '@material-ui/core';
import styles from './styles';
const firebase = require("firebase");
class NewChat extends Component {
    constructor()
    {
        super();
        this.state={
            username:null,
            message:null,
            serverError:null,
            //currentUser:null,
        }
    }
    userTyping=(e)=>{
        const {name,value}=e.target;
        this.setState({
            [name]:value,
        })
    }
    submitNewChat=async(e)=>{
        e.preventDefault();
        const userExists=await this.userExists();
        if(userExists)
        {
            const chatExists=await this.chatExists();
            // console.log(chatExists);
            if(chatExists)
                this.gotoChat()
                //console.log("exist")
            else
                this.createChat()
                
        }
        
    }
    createChat=()=>{
        console.log("inside create chat")
       this.props.createChatFn(this.getKey(),this.state.message); 
    }
    gotoChat=()=>{
        this.props.gotoChatFn(this.getKey(),this.state.message);
    }
    // getCurrentUser=async()=>{
    //     var user=await firebase.auth().currentUser;
    //     this.setState({currentUser:user.email})
    // }
    getKey=()=>{
        return [firebase.auth().currentUser.email,this.state.username].sort().reverse().join(':');
    }
    userExists=async()=>{
        const snapshot=await firebase
                        .firestore()
                        .collection('users')
                        .get();
        const exists=snapshot.docs.map(doc=>doc.data().email).includes(this.state.username);
        //this.setState({serverError:!exists})
        return exists;
    }
    chatExists=async ()=>{
        const key=this.getKey();
       // console.log(key)
        const chat=await firebase
            .firestore()
            .collection('chats')
            .doc(key)
            .get()
            console.log(chat.exists);
        return chat.exists;
            

    }
    render() {
        const {classes}=this.props;
        return (
            <main className={classes.name}>
                <CssBaseline></CssBaseline>
                <Paper fullWidth className={classes.paper}>
                    <Typography component="h1" variant="h5">Send a Message</Typography>
                <form className={classes.form}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="new-chat-username">Enter your friend's Email</InputLabel>
                        <Input 
                            name="username"
                            required 
                            className={classes.input}
                            onChange={(e)=>this.userTyping(e)} 
                            id="new-chat-username"
                        />
                    </FormControl>
                    <br></br>
                    <br></br>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="new-chat-message">Enter Your Message</InputLabel>
                    <Input 
                        name="message"
                        required
                        className={classes.input}
                        onChange={(e)=>this.userTyping(e)} 
                        id="new-chat-message"
                    />
                    <br></br>
                    <Button 
                        variant='contained' 
                        color='primary'
                        className={classes.newChatBtn}
                        fullwidth
                        onClick={(e)=>this.submitNewChat(e)}
                    >
                           Send Message
                    </Button>
                    </FormControl>

                </form>
                </Paper>
            </main>
        );
    }
}

export default withStyles(styles)(NewChat);
import React, { Component } from 'react';
import ChatList from '../chatlist/ChatList'
import {Button,withStyles} from '@material-ui/core'
import styles from './styles'
import ChatView from '../chatview/chatView';
import ChatTextBox from '../chattextbox/chatTextBox';
import NewChat from '../newchat/newChat';
const firebase=require('firebase')
class DashboardComponent extends Component {
    constructor()
    {
        super();
        this.state={
            selectedChat:null,
            newChatFormVisible:false,
            email:'',
            chats:[],
           
        }
    }
    
    componentDidMount() {
        firebase.auth().onAuthStateChanged(async user=>{
            if(!user)
                this.props.history.push('/login')
            else
               // console.log(user.email);
                await firebase
                    .firestore()
                    .collection('chats')
                    .where('users','array-contains',user.email)
                    .onSnapshot(async res=>{
                        const chats=res.docs.map(doc=>doc.data())
                        await this.setState({
                            email:user.email,
                            chats:chats
                        })
                        //console.log(this.state);
                    })
                    
        })
    }
    signOut=()=>{
        firebase.auth().signOut();
    }
    
    selectChatFn=async (index)=>{
        this.setState({
            newChatFormVisible:false,
            selectedChat:index
        },()=>this.messageRead())
     
    }
    clickChatWhereNotSender=(chatIndex)=>{
        console.log(chatIndex);
        return(
            this.state.chats[chatIndex].messages[this.state.chats[chatIndex].messages.length-1].sender!==this.state.email
        )
    }
    messageRead=()=>{
        const friend=this.state.chats[this.state.selectedChat].users.filter(user=>user!==this.state.email)[0];
        const docKey=this.buildDocKey(friend);
        //const docKey=this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(user=>user!==this.state.email)[0]);
        if(this.clickChatWhereNotSender(this.state.selectedChat)){
            firebase
            .firestore()
            .collection('chats')
            .doc(docKey)
            .update({
              isRead:true,  
            })
        }
        else{
            console.log("clicked message where the user was not the sender");
        }
    }
    submitMessage=(msg)=>{
        console.log(msg);
        const friend=this.state.chats[this.state.selectedChat].users.filter(user=>user!==this.state.email)[0];
        const docKey=this.buildDocKey(friend);
        console.log(docKey);
        const data=firebase
            .firestore()
            .collection('chats')
            .doc(docKey)
            .update({
                messages:firebase.firestore.FieldValue.arrayUnion({
                    sender:this.state.email,
                    message:msg,
                    timestamp:Date.now()
                }),
                isRead:false,
            })
        console.log(data);
            
       // const docKey=this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(user=>user!==this.state.email)[0]);
        //console.log(docKey);    
    }
    buildDocKey=(friend)=>{
        return [friend,this.state.email].sort().reverse().join(':');
    }
    newChat=async ()=>{
        //console.log("new chat button clicked")
        this.setState({
            newChatFormVisible:true,
            selectedChat:null
        });
        await console.log(this.state.newChatFormVisible)
    }
    createChat=async(key,message)=>{
            const currentUser=await firebase.auth().currentUser.email;
            const users=key.split(":");
           // console.log();
            const receiver=await users.filter(user=>user!==currentUser)
            console.log(receiver[0]);
            await firebase
                .firestore()
                .collection('chats')
                .doc(key)
                .set({
                    isRead:false,
                    users:[currentUser,receiver[0]],
                    messages:[{
                        message:message,
                        sender:currentUser,
                    }]

                })
                await firebase
                    .firestore()
                    .collection('chats')
                    .where('users','array-contains',currentUser)
                    .onSnapshot(async res=>{
                        const chats=res.docs.map(doc=>doc.data())
                        await this.setState({
                            email:currentUser,
                            chats:chats
                        })
                        //console.log(this.state);
                    })
                let chatIndex=await this.state.chats.map((chat,index)=>JSON.stringify(users.sort())===JSON.stringify(chat.users.sort())?index:null);
                let index=chatIndex.filter((index)=>index!==null)
                console.log(index[0])
                this.setState({
                    newChatFormVisible:false,
                    selectedChat:index[0],
                })
    }
    gotoChat=async (key,msg)=>{
        const userInChat=key.split(":");
        const currentUser=await firebase.auth().currentUser.email;
        //const receiver=userInChat.filter((user)=>user!==currentUser);
        firebase
            .firestore()
            .collection('chats')
            .doc(key)
            .update({
                messages:firebase.firestore.FieldValue.arrayUnion({
                    sender:currentUser,
                    message:msg,
                    timestamp:Date.now()
                }),
                isRead:false,
            })
            // console.log(JSON.stringify(userInChat));
            // console.log(this.state.chats);
            
            let chatIndex=await this.state.chats.map((chat,index)=>JSON.stringify(userInChat.sort())===JSON.stringify(chat.users.sort())?index:null);
            let index=chatIndex.filter((index)=>index!==null)
            console.log(index[0])
            this.setState({
                newChatFormVisible:false,
                selectedChat:index[0],
            })
       // console.log(chats);
        //     //this.setState({newChatFormVisible:false})
        
            // this.setState({
            //     newChatFormVisible:false,
            //     selectedChat:0,
            // })
    }
    render() {
        const {classes}=this.props;
        return (
            <div>
                
                <ChatList 
                    history={this.props.history} 
                    newChatFn={this.newChat}
                    selectChatFn={this.selectChatFn}
                    chats={this.state.chats}
                    userEmail={this.state.email}
                    selectedChat={this.state.selectedChat}
                    messageReadFn={this.props.messageRead}
                />
            
            
                {
                    this.state.newChatFormVisible?
                    null:
                    <ChatView 
                        user={this.state.email}
                        chat={this.state.chats[this.state.selectedChat]}
                     />
                }
                {
                    this.state.newChatFormVisible ? <NewChat
                                                        gotoChatFn={this.gotoChat}
                                                        createChatFn={this.createChat}
                                                    />
                     :null
                }
                {
                    this.state.selectedChat!==null && !this.state.newChatFormVisible?
                    <ChatTextBox messageReadFn={this.messageRead} submitMessageFn={this.submitMessage}></ChatTextBox>:
                    null
                }
                <Button style={{display:this.state.display}} className={classes.signOutBtn} onClick={this.signOut}>Sign Out</Button>
            </div>
        );
    }
}

export default withStyles(styles)(DashboardComponent);
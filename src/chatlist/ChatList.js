import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import styles from './styles';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import NotificationImportant from '@material-ui/icons/NotificationImportant'; 
class ChatList extends Component {
    render() {
        const {classes}=this.props;
        if(this.props.chats.length>0)
        {
            return (
                <main className={classes.root}>
                    <Button 
                        variant='contained' 
                        color='primary'
                        className={classes.newChatBtn}
                        fullWidth
                        onClick={()=>this.props.newChatFn()}>
                            New Message
                    </Button>
                    <List>
                        {
                            this.props.chats.map((chat,index)=>{
                            
                                return(
                                        <div key={index}><ListItem  onClick={()=>this.selectChatFn(index)}
                                        className={classes.listItem}
                                        selected={this.props.selectedChat===index}
                                        
                                        alignItems='flex-start'>
                                         
                                        <ListItemAvatar>
                                            <Avatar alt="Remy Sharp">{chat.users.filter(user=>user!==this.props.userEmail)[0].split('')[0]}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={chat.users.filter(user=>user!==this.props.userEmail)}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography component='span' color='text-primary'>
                                                        {
                                                            chat.messages[chat.messages.length-1].message.substring(0,20)
                                                        }
                                                    </Typography>
                                                </React.Fragment>
                                            }>
        
                                        </ListItemText>
                                            {
                                                chat.isRead===false && !this.userIsSender(chat)?
                                                <ListItemIcon>
                                                    <NotificationImportant className={classes.unreadMessage}></NotificationImportant>
                                                </ListItemIcon>
                                                :
                                                null
                                            }
                                    </ListItem>
                                    <Divider></Divider></div>
                                )
                            })
                                
                            
                        }
                    </List>
    
    
                </main>
            );
        }
        else{
            return(
            <main className={classes.root}>
                <Button 
                        variant='contained' 
                        color='primary'
                        className={classes.newChatBtn}
                        fullWidth
                        onClick={()=>this.props.newChatFn()}>
                            New Message
                    </Button>
                <List></List>
            </main>
            );
            
        }
    }
    userIsSender=(chat)=>{
        return(
        chat.messages[chat.messages.length-1].sender===this.props.userEmail
        )
    }
    
    selectChatFn=(index)=>{
        //console.log(index);
        //this.props.selectChatFn(index)
    
        this.props.selectChatFn(index);
    }
}

export default withStyles(styles)(ChatList);
import React, { Component } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styles from './styles';
import {Link} from 'react-router-dom'
const firebase=require('firebase');
class LoginComponent extends Component {
    constructor(props)
    {
        super(props)
        this.state={
            email:null,
            password:null,
            signinError:''
        }
    }
    submitLogin=(e)=>
    {
        e.preventDefault();
        console.log(this.state);
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email,this.state.password)
            .then(()=>{
              this.props.history.push('/dashboard')  
            })
            .catch(error=>{
                this.setState({
                    signinError:error.message
                })
                console.log(error.message);
            })



    }
    userTyping=(e)=>{
        const {name,value}=e.target;
        this.setState({
            [name]:value,
        })
    }
    render() {
        const {classes}=this.props;
        return (
            <main className={classes.main}>
                <CssBaseline>
                </CssBaseline>                
                <Paper className={classes.paper}>
                <Typography variant="h5" component="h1">
                    Login !!
                </Typography>
                <form className={classes.form} onSubmit={(e)=>this.submitLogin(e)}>
                    <FormControl required fullWidth margin="normal">
                        <InputLabel htmlFor='login-email-input'>Enter Your Email</InputLabel>
                        <Input autoComplete="on" type="email" onChange={(e)=>this.userTyping(e)} id="login-email-input" name="email" ></Input>
                    </FormControl>
                    <FormControl required fullWidth margin="normal">
                        <InputLabel htmlFor='login-password-input'>Enter Your Password</InputLabel>
                        <Input  type="password" onChange={(e)=>this.userTyping(e)} id="login-password-input" name="password" ></Input>
                    </FormControl>
                    <Button className={classes.submit} type="submit" fullWidth variant='contained' color='primary'>Login</Button>
                </form>
                {
                    this.state.signinError?
                        <Typography className={classes.errorText} components='h5' variant='h6'>{this.state.signinError}</Typography>
                    :
                    null
                }
                <br></br>
                <Typography className={classes.noAccountHeader}>Doesn't Have an Account ?</Typography>
                <Link className={classes.signUpLink} to='/signup'>Sign Up!!</Link>
                </Paper>
            </main>
        );
    }
}

export default withStyles(styles)(LoginComponent);
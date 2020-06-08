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
class SignupComponent extends Component {
    constructor(props)
    {
        super(props)
        this.state={
            email:null,
            password:null,
            passwordConfirmation:null,
            signupError:''

        }
    }
    formIsValid=()=>{
        return  this.state.password===this.state.passwordConfirmation
    }
    submitSignup=(e)=>
    {
        e.preventDefault();
        if(!this.formIsValid())
        {
            this.setState({
                signupError:'Passwords Do Not Match'
            })
            return;
        }
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email,this.state.password)
            .then(response=>{
                const userObj={
                    email:response.user.email,
                }
                firebase
                    .firestore()
                    .collection('users')
                    .doc(this.state.email)
                    .set(userObj)
                    .then(()=>this.props.history.push('/dashboard'))
                    .catch((dbError)=>{
                        console.log(dbError)
                        this.setState({signupError:'failed to add user'})
                    })
            })
            .catch(authError=>{
                console.log(authError)
                this.setState({signupError:'Failed to create auth'})
            })



    }
    userTyping=(type,e)=>{
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
                    <Paper className={classes.paper}>
                        <Typography component='h1' variant='h5'>
                            Sign Up !
                        </Typography>
                        <form onSubmit={(e)=>this.submitSignup(e)} className={classes.form}>
                            <FormControl required fullWidth margin='normal'>
                                <InputLabel htmlFor='signup-email-input'>
                                    Enter Your Email
                                </InputLabel>
                                <Input name="email" onChange={(e)=>this.userTyping('email',e)} type='email' autoComplete='on' id='signup-email-input'></Input>
                            </FormControl>
                            <FormControl required fullWidth margin="normal">
                                <InputLabel htmlFor='signup-password-input'>
                                    Enter Password
                                </InputLabel>
                                <Input name="password" type="password" onChange={(e)=>this.userTyping('password',e)} id='signup-password-input'></Input>
                            </FormControl>
                            <FormControl required fullWidth margin="normal">
                                <InputLabel htmlFor='signup-password-confirmation-input'>
                                    Confirm your Password
                                </InputLabel>
                                <Input name="passwordConfirmation" type="password" onChange={(e)=>this.userTyping('passwordConfirmation',e)} id='signup-password-confirmation-input'></Input>
                            </FormControl>
                            <Button type='submit' className={classes.submit} fullWidth variant='contained' color='primary'>Sign Up</Button>
                        </form>
                        {
                            (this.state.signupError) ?
                            (
                            <Typography component="h5" variant="h6" className={classes.errorText}>{this.state.signupError}</Typography>
                            )
                            :
                            null
                        }
                        <br></br>
                        <Typography className={classes.hasAccountHeader}>Already Have An Account ?</Typography>
                        <Link className={classes.logInLink} to='/'>Login !!</Link>
                    </Paper>
                </CssBaseline>

            </main>
        );
    }
}

export default withStyles(styles)(SignupComponent);
import React, { Component } from 'react';
import {
  Container, Col, Form,
  FormGroup, Label, Input,
  Button, FormText, FormFeedback,
} from 'reactstrap';
import './Login.css';
import axios from '../../hoc/axios-instance';
import Hoc from '../../hoc/hoc';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'email': '',
      'password': '',
      validate: {
        emailState: '',
        passwordState: '',
        errorMessage: 'Emailid is invalid.'
      },
    }
    this.handleChange = this.handleChange.bind(this);
  }
  // logic for validate password 
  validatePassword(e) {
    // const re = new RegExp("^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$");
    const { validate } = this.state
    const isOk = e.target.value;
    if (isOk.length < 8) {
      validate.passwordState = 'has-danger'
    }
    else {
      validate.passwordState = 'has-success'
    }
    this.setState({ validate })
  }
  // logic for validate email Id 
  validateEmail(e) {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validate } = this.state
    if (emailRex.test(e.target.value)) {
      validate.emailState = 'has-success'
    } else {
      validate.emailState = 'has-danger'
    }
    this.setState({ validate })
  }

  handleChange = async (event) => {
    const { target } = event;
    const value = target.value;
    const { name } = target;
    await this.setState({
      [name]: value,
    });
  }

  // // logic for Submitting form
  submitForm(e) {
    const { validate } = this.state
    if (validate.emailState === 'has-danger' || validate.emailState === '') {
      validate.emailState = 'has-danger'
      this.setState({ validate });
    }
    else if (validate.passwordState === 'has-danger' || validate.passwordState === '') {
      validate.passwordState = 'has-danger'
      this.setState({ validate });
    }
    else {
      axios.get('Tasks/emailValidation/' + this.state.email).then((response) => {
        if (response.data.response[0].validEmail === 0) {
          validate.emailState = 'has-danger';
          validate.errorMessage = "Email id is missing. Please Signup.";
          this.setState({ validate });
        }
        else {
          validate.emailState = 'has-success'
          validate.passwordState = 'has-success'
          this.setState({ validate });
          axios.get('Tasks/signInController/' + btoa(this.state.email) + '?sendName=' + btoa(this.state.password)).then((response) => {
            if (response.data.response.length == 0) {
              alert('Please Check Your Password.');
            }
            else {
              localStorage.setItem('customerId', response.data.response[0].customerId)
              localStorage.setItem('emailId', this.state.email);
              localStorage.setItem('profileImage', response.data.response[0].CustImageName);
              localStorage.setItem('ProfileName', response.data.response[0].Name);
              this.props.history.push("/feeds");
            }
          }).catch(error => {
            console.log(error);
            alert('Something Went Wrong');
          });
        }
      });
    }
  }
  signUpHandler = () => {
    this.props.history.push("/Signup");
  }
  render() {
    const { email, password } = this.state;
    return (
      <Container className="Login">
        <h2>Sign In</h2>
        <Form className="form">
          <Col>
            <FormGroup>
              <Label>Email ID</Label>
              <Input
                type="email"
                name="email"
                ref="email"
                placeholder="myemail@email.com"
                value={email}
                valid={this.state.validate.emailState === 'has-success'}
                invalid={this.state.validate.emailState === 'has-danger'}
                onChange={(e) => {
                  this.validateEmail(e)
                  this.handleChange(e)
                }}
              />
              {this.state.validate.emailState ? (<Hoc><FormFeedback valid style={{ color: 'white' }}>
                Email Id is valid.
              </FormFeedback>
                <FormFeedback invalid style={{ color: 'white' }}>
                  {this.state.validate.errorMessage}
                </FormFeedback></Hoc>) : null}

            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="examplePassword">Password</Label>
              <Input
                type="password"
                name="password"
                ref="password"
                placeholder="********"
                value={password}
                valid={this.state.validate.passwordState === 'has-success'}
                invalid={this.state.validate.passwordState === 'has-danger'}
                onChange={(e) => {
                  this.validatePassword(e)
                  this.handleChange(e)
                }}
              />
              {this.state.validate.passwordState ? (<Hoc><FormFeedback invalid style={{ color: 'white' }} >
                {/* Password Length should be 8. */}
              </FormFeedback>
                <FormFeedback valid style={{ color: 'white' }}>
                  {/* Password is good. */}
                </FormFeedback></Hoc>) : null}
            </FormGroup>
          </Col>
          <Button color="primary" size="lg" onClick={(e) => this.submitForm(e)}>SUBMIT</Button>{' '}
          <Button color="primary" size="lg" onClick={this.signUpHandler}>SIGNUP</Button>
        </Form>
      </Container>
    );
  }
}

export default withErrorHandler(Login, axios);
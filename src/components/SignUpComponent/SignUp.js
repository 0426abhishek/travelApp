import React from 'react';
import './SignUp.css';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Label, Input, FormFeedback, Container } from 'reactstrap';
import axios from '../../hoc/axios-instance';
import { Alert } from 'reactstrap';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      'name': '',
      'email': '',
      'password': '',
      'confirmPassword': '',
      'mobile': '',
      'selectedFile': '',
      'ImageName': '',
      validate: {
        nameState: '',
        emailState: '',
        passwordState: '',
        confimrPasswordState: '',
        mobileState: '',
        imageFile: '',
        alertBox: '',
        emailErrorMesage: 'Email Id is invalid',
      },
    };
    var imageData;
    this.handleChange = this.handleChange.bind(this);
  }

  // Logic For user name validation.
  validateName(e) {
    const { validate } = this.state;
    const isOk = e.target.value;
    if (isOk.length >= 4) {
      validate.nameState = 'has-success'
    }
    else {
      validate.nameState = 'has-danger'
    }
    this.setState({ validate })
  }

  // logic for password validation.
  validatePassword(e) {
    //const re = new RegExp("^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$");
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

  // logic for validate email Id. 
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

  //logic for validate ConfirmPassword.
  validateConfirmPass(e) {
    const { validate } = this.state;
    if (e.target.value === this.state.password) {
      validate.confimrPasswordState = 'has-success'
    }
    else {
      validate.confimrPasswordState = 'has-danger'
    }
    this.setState({ validate })
  }
  // logic for validate Mobile No.
  validateMobile(e) {
    const { validate } = this.state;
    var mobileRex = /^\+(?:[0-9] ?){6,17}[0-9]$/;
    if (mobileRex.test(e.target.value)) {
      validate.mobileState = 'has-success';
    }
    else {
      validate.mobileState = 'has-danger';
    }
    this.setState({ validate })
  }
  // Image upload Logic
  handleUploadFile = (event) => {
    const { validate } = this.state;
    this.imageData = event.target.files[0];
    this.state.ImageName = event.target.files[0].name;
    this.state.selectedFile = event.target.files[0];
    validate.imageFile = 'has-success';
    this.setState({ validate });
  }

  handleChange = async (event) => {
    const { target } = event;
    const value = target.value;
    const { name } = target;
    await this.setState({
      [name]: value,
    });

  }


  submitForm = (e) => {
    e.preventDefault();
    const { validate } = this.state;
    if (validate.nameState === 'has-danger' || validate.nameState === '' ||
      validate.emailState === 'has-danger' || validate.emailState === '' ||
      validate.passwordState === 'has-danger' || validate.passwordState === '' ||
      validate.confimrPasswordState === 'has-danger' || validate.confimrPasswordState === '' ||
      validate.mobileState === 'has-danger' || validate.mobileState === '' ||
      validate.imageFile === 'has-danger' || validate.imageFile === ''
    ) {
      validate.alertBox = '';
      this.setState({ validate });
      return false;
    }
    else {
      axios.get('Tasks/emailValidation/' + this.state.email).then((response) => {
        if (response.data.response[0].validEmail === 0) {
          validate.alertBox = 'alertBox';
          this.setState({ validate });
          const data = new FormData()
          data.append('selectedFile', this.imageData)
          data.append('ImageName', this.state.ImageName)
          data.append('Name', this.state.name)
          data.append('Email', this.state.email)
          data.append('Mobile', this.state.mobile)
          data.append('Password', this.state.password)
          axios.post('Registration/getRegistration', data).then((response) => {
            localStorage.setItem('customerId', response.data.response.insertId)
            localStorage.setItem('emailId', this.state.email);
            localStorage.setItem('profileImage',axios.defaults.baseURL + "PackNTagImages/" + this.state.ImageName);
            localStorage.setItem('ProfileName',this.state.name);
            this.props.history.push("/feeds");
          }).catch(error => {
            console.log(error);
            alert('Something Went Wrong');
          });
        }
        else {
          alert("Email is Already Registered to our Application.");
          validate.emailState = 'has-danger'
          validate.emailErrorMesage = 'Email is Already Registered to our Application.';
          this.setState({ validate });
        }
      }).catch(error => {
        console.log(error);
        alert('Something Went Wrong');
      });
    }

  }
  render() {
    var alertBox;
    if (this.state.validate.alertBox === '') {
      alertBox = (<div>
        <Alert color="danger">
          Mandatory to fill all the fields.
         </Alert>
      </div>);
    }
    else {
      alertBox = null;
    }
    return (
      <Container className="signUp">
        <h2 style={{ textAlign: "center", marginTop: "20px", fontSize: "200%", fontWeight: "900" }}>Sign Up</h2>
        {alertBox}
        <Form onSubmit={this.submitForm.bind(this)}>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input type="text" name="name" placeholder="Enter Name" value={this.state.name}
              valid={this.state.validate.nameState === 'has-success'}
              invalid={this.state.validate.nameState === 'has-danger'}
              onChange={(e) => {
                this.validateName(e)
                this.handleChange(e)
              }} />
            {/* <FormFeedback invalid style={{ color: 'white' }} >
              UserName Length should be Minimum 4.
              </FormFeedback>
            <FormFeedback valid style={{ color: 'white' }}>
              UserName is good.
              </FormFeedback> */}
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input type="email" name="email" placeholder="Enter Email" value={this.state.email}
              valid={this.state.validate.emailState === 'has-success'}
              invalid={this.state.validate.emailState === 'has-danger'}
              onChange={(e) => {
                this.validateEmail(e)
                this.handleChange(e)
              }} />
            {/* <FormFeedback valid style={{ color: 'white' }}>
              Email Id is valid.
              </FormFeedback>
            <FormFeedback invalid style={{ color: 'white' }}>
              {this.state.validate.emailErrorMesage}
            </FormFeedback> */}
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" name="password" placeholder="Enter Password"
              value={this.state.password}
              valid={this.state.validate.passwordState === 'has-success'}
              invalid={this.state.validate.passwordState === 'has-danger'}
              onChange={(e) => {
                this.validatePassword(e)
                this.handleChange(e)
              }} />
            {/* <FormFeedback invalid style={{ color: 'white' }} >
            Your password must be at least 8 characters.
              </FormFeedback>
            <FormFeedback valid style={{ color: 'white' }}>
              Password is good.
              </FormFeedback> */}
          </FormGroup>
          <FormGroup>
            <Label for="exampleConfirmPassword">Confirm Password</Label>
            <Input type="password" name="confirmPassword" placeholder="Enter ConfirmPassword"
              value={this.state.confirmPassword}
              valid={this.state.validate.confimrPasswordState === 'has-success'}
              invalid={this.state.validate.confimrPasswordState === 'has-danger'}
              onChange={(e) => {
                this.validateConfirmPass(e)
                this.handleChange(e)
              }} />
            {/* <FormFeedback invalid style={{ color: 'white' }} >
              Confirm Password Should Match With Password.
              </FormFeedback>
            <FormFeedback valid style={{ color: 'white' }}>
              Confirm Password is good.
              </FormFeedback> */}
          </FormGroup>
          <FormGroup>
            <Label for="mobile">Mobile No</Label>
            <Input type="text" name="mobile" placeholder="Enter Mobile No"
              value={this.state.mobile}
              valid={this.state.validate.mobileState === 'has-success'}
              invalid={this.state.validate.mobileState === 'has-danger'}
              onChange={(e) => {
                this.validateMobile(e)
                this.handleChange(e)
              }} />
            <FormFeedback invalid style={{ color: 'white' }} >
              Mobile Number Should Have Country Code.
              </FormFeedback>
            <FormFeedback valid style={{ color: 'white' }}>
              {/* Mobile No is good. */}
              </FormFeedback>
          </FormGroup>
          <FormGroup>
            <Label for="file">Upload Image</Label>
            <Input type="file" name="file"
              valid={this.state.validate.imageFile === 'has-success'}
              invalid={this.state.validate.imageFile === 'has-danger'}
              onChange={this.handleUploadFile}
              value={this.state.imageFile} />
            {/* <FormFeedback invalid style={{ color: 'white' }} >
              Upload Profile Image.
              </FormFeedback>
            <FormFeedback valid style={{ color: 'white' }}>
              Profile Image is good.
              </FormFeedback> */}
          </FormGroup>
          <div className="form-row text-center">
            <div className="col-12">
              <Button color="primary" size="lg" style={{ fontSize: "larger" }}>Submit</Button>
            </div>
          </div>
        </Form>
      </Container>
    );
  }
}

export default withErrorHandler(Example,axios);
Container.propTypes = {
  fluid: PropTypes.bool
  // applies .container-fluid class
}
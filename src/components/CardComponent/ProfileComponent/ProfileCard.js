import React from 'react';
import { Button, Card, CardHeader, Label, CardText, CardImg, ListGroup, ListGroupItem, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Form, Input, FormFeedback, Badge } from 'reactstrap';
import './ProfileCard.css';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Ionicon from 'react-ionicons';
import axios from '../../../hoc/axios-instance';
import { withRouter } from 'react-router';
import * as actions from '../../../store/actions/index';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
class ProfileCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            kycModal: false,
            passwordModal: false,
            name: '',
            profileImageName: '',
            mobile: '',
            password: '',
            confirmPassword: '',
            validate: {
                nameState: 'has-success',
                mobileState: 'has-success',
                ImageName: '',
                selectedFile: '',
                passwordState: '',
                confimrPasswordState: '',
            },
            currency: 'eur',
            country: '',
            countryList: '',
            ibanAccountNumber: 'block',
            sortCode: 'none',
            routingNumber: 'none',
            activeItem: 'active',
            firstName: '',
            lastName: '',
            iban: '',
            account: '',
            routing: '',
            sortcode: '',
            day: '',
            month: '',
            year: ''
        };
        var imageData;
        this.toggle = this.toggle.bind(this);
        this.toggleKYC = this.toggleKYC.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleClick = this.handleClick.bind(this);

    }

    componentWillMount = () => {
        let countryList = [];
        countryList.push({ 'AT': 'Austria' });
        countryList.push({ 'BE': 'Belgium' });
        countryList.push({ 'DK': 'Denmark' });
        countryList.push({ 'FI': 'Finland' });
        countryList.push({ 'FR': 'France' });
        countryList.push({ 'DE': 'Germany' });
        countryList.push({ 'IE': 'Ireland' });
        countryList.push({ 'IT': 'Italy' });
        countryList.push({ 'LU': 'Luxembourg' });
        countryList.push({ 'NL': 'Netherland' });
        countryList.push({ 'NO': 'Norway' });
        countryList.push({ 'PT': 'Portugal' });
        countryList.push({ 'ES': 'Spain' });
        countryList.push({ 'SE': 'Sweden' });
        countryList.push({ 'CH': 'Switzerland' });
        countryList.push({ 'GB': 'United Kingdom' });
        this.setState({
            countryList: countryList
        });
    }

    PackntagController = () => {
        this.props.history.push('/feeds');
    }

    OrderPaymentController = () => {
        this.props.history.push({
            pathname: '/orderpayment',
            state: { recieved: '' }
        })
    }
    PaymentRecievedController = () => {
        this.props.history.push({
            pathname: '/orderpayment',
            state: { recieved: 'recieved' }
        })
    }
    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    toggleKYC() {
        this.setState({
            kycModal: !this.state.kycModal
        });
    }
    toggleModal = () => {
        this.setState({
            passwordModal: !this.state.passwordModal
        });
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
        console.log(this.state);
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
    handleChange = async (event) => {
        const { target } = event;
        const value = target.value;
        const { name } = target;
        await this.setState({
            [name]: value,
        });
    }

    handleImage = (e) => {
        this.refs.fileUploader.click();
    }

    handleClick(event) {
        this.imageData = event.target.files[0];
        this.state.ImageName = event.target.files[0].name;
        this.state.selectedFile = event.target.files[0];
        alert('Image Uploaded..');
    }
    // logic for password validation.
    validatePassword(e) {
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

    updatePassword = () => {
        const { validate } = this.state
        if (validate.passwordState === 'has-danger' || validate.passwordState === '') {
            validate.passwordState = 'has-danger'
            this.setState({ validate });
        }
        else if (validate.confimrPasswordState === 'has-danger' || validate.confimrPasswordState === '') {
            validate.confimrPasswordState = 'has-danger'
            this.setState({ validate });
        }
        else {
            axios.get('Tasks/updatePassword/' + localStorage.getItem('customerId') + '?sendName=' + this.state.password).then((response) => {
                alert('Password Updated Successfully.');
                this.toggleModal();
            }).catch(error => {
                console.log(error);
                alert('Something went wrong.')
            });
        }
    }

    componentDidMount = () => {
        axios.get('Registration/getProfileInfo/' + localStorage.getItem('customerId')).then((response) => {
            this.setState({
                name: response.data.response[0].name,
                profileImageName: axios.defaults.baseURL + "PackNTagImages/" + response.data.response[0].imagename,
                mobile: response.data.response[0].mobile,
                ImageName: response.data.response[0].imagename
            });
            localStorage.setItem("profileImage", axios.defaults.baseURL + "PackNTagImages/" + response.data.response[0].imagename);
        }).catch(error => {
            console.log(error);
        });
        this.props.onInitPaymentCount();
    }

    updateProfile = () => {
        const { validate } = this.state;
        if (validate.nameState === 'has-danger' || validate.nameState === '' ||
            validate.mobileState === 'has-danger' || validate.mobileState === ''
        ) {
        }
        else {
            const data = new FormData()
            data.append('selectedFile', this.imageData)
            data.append('ImageName', this.state.ImageName)
            data.append('Name', this.state.name)
            data.append('Mobile', this.state.mobile)
            data.append('customerId', localStorage.getItem('customerId'))
            axios.post('Registration/updateProfile', data).then((response) => {
                this.toggle();
                localStorage.setItem("profileImage", axios.defaults.baseURL + "PackNTagImages/" + this.state.ImageName);
                localStorage.setItem('ProfileName', this.state.name);
                window.location.reload();
            }).catch(error => {
                console.log(error);
                alert('Something Went Wrong');
            });
        }

    }

    handleCurrency = (event) => {
        let countryList = [];
        if (event.target.value === 'eur') {
            countryList.push({ 'AT': 'Austria' });
            countryList.push({ 'BE': 'Belgium' });
            countryList.push({ 'DK': 'Denmark' });
            countryList.push({ 'FI': 'Finland' });
            countryList.push({ 'FR': 'France' });
            countryList.push({ 'DE': 'Germany' });
            countryList.push({ 'IE': 'Ireland' });
            countryList.push({ 'IT': 'Italy' });
            countryList.push({ 'LU': 'Luxembourg' });
            countryList.push({ 'NL': 'Netherland' });
            countryList.push({ 'NO': 'Norway' });
            countryList.push({ 'PT': 'Portugal' });
            countryList.push({ 'ES': 'Spain' });
            countryList.push({ 'SE': 'Sweden' });
            countryList.push({ 'CH': 'Switzerland' });
            countryList.push({ 'GB': 'United Kingdom' });
            this.setState({
                countryList: countryList,
                ibanAccountNumber: 'block',
                sortCode: 'none',
                routingNumber: 'none'
            });
        }
        else if (event.target.value === 'chf') {
            countryList.push({ 'CH': 'Switzerland' });
            this.setState({
                countryList: countryList,
                ibanAccountNumber: 'block',
                sortCode: 'none',
                routingNumber: 'none'
            });
        }
        else if (event.target.value === 'dkk') {
            countryList.push({ 'DK': 'Denmark' });
            this.setState({
                countryList: countryList,
                ibanAccountNumber: 'block',
                sortCode: 'none',
                routingNumber: 'none'
            });
        }
        else if (event.target.value === 'nok') {
            countryList.push({ 'NO': 'Norway' });
            this.setState({
                countryList: countryList,
                ibanAccountNumber: 'block',
                sortCode: 'none',
                routingNumber: 'none'
            });
        }
        else if (event.target.value === 'sek') {
            countryList.push({ 'SE': 'Sweden' });
            this.setState({
                countryList: countryList,
                ibanAccountNumber: 'block',
                sortCode: 'none',
                routingNumber: 'none'
            });
        }
        else if (event.target.value === 'gbp') {
            countryList.push({ 'GBP': 'United Kingdom' });
            this.setState({
                countryList: countryList,
                ibanAccountNumber: 'none',
                sortCode: 'block',
                routingNumber: 'none'
            });
        }
        else if (event.target.value === 'usd') {
            countryList.push({ 'US': 'United States' });
            this.setState({
                countryList: countryList,
                ibanAccountNumber: 'none',
                sortCode: 'none',
                routingNumber: 'block'
            });
        }

    }
    countryName = (event) => {
        this.setState({
            country: event.target.value
        });
    }
    updateKYC = () => {
        const formdata = new FormData()
        formdata.append('selectedFile', this.imageData)
        formdata.append('ImageName', this.state.ImageName)
        formdata.append('firstName', this.state.firstName)
        formdata.append('lastName', this.state.lastName)
        formdata.append('customerId', localStorage.getItem('customerId'))
        formdata.append('currency', this.state.currency)
        formdata.append('country', this.state.country)
        formdata.append('routing', this.state.routing)
        formdata.append('sortcode', this.state.sortcode)
        formdata.append('accountnumber', this.state.account);
        formdata.append('iban', this.state.iban)
        formdata.append('day', this.state.day)
        formdata.append('month', this.state.month)
        formdata.append('year', this.state.year)
        axios.post('KYCTask/insertKYC', formdata).then((response) => {
            if (response.data.status === 200) {
                alert('Successfully KYC is updated.');
                this.toggleKYC();
            }
            else {
                alert(response.data.response.message);
            }
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <Card className="profile-card">
                <CardHeader className="profile-header">
                    <span className="glyphicon glyphicon-pencil profile-edit"></span>
                    <CardText className="profile-text">&nbsp;&nbsp;&nbsp;&nbsp;{this.state.name}</CardText>
                    {/* <CardText className="profile-title">Software Developer</CardText> */}
                    <CardImg src={this.state.profileImageName} className="profile-image"></CardImg>
                </CardHeader>
                <ListGroup className="profile-inline" flush>
                    <ListGroupItem onClick={this.toggleKYC}><span className="glyphicon glyphicon glyphicon-info-sign profile-pencil"></span><span className="profile-tab">KYC</span></ListGroupItem>
                    <ListGroupItem onClick={this.toggle}><span className="glyphicon glyphicon-pencil profile-pencil"></span><span className="profile-tab">Profile</span></ListGroupItem>
                    <ListGroupItem onClick={this.PackntagController}><span className="glyphicon glyphicon-user profile-pencil" /><span className="profile-tab">PackNTaggers</span></ListGroupItem>
                    <ListGroupItem onClick={this.OrderPaymentController}><span className="glyphicon glyphicon-folder-close profile-pencil"></span><span className="profile-tab">Orders and Payments</span> <Badge color="danger" pill>{this.props.payCount}</Badge></ListGroupItem>
                    <ListGroupItem onClick={this.PaymentRecievedController}><span className="glyphicon glyphicon glyphicon-th profile-pencil"></span><span className="profile-tab">Payment Confirmation</span></ListGroupItem>
                    <ListGroupItem onClick={this.toggleModal}><span className="glyphicon glyphicon glyphicon-off profile-pencil"></span><span className="profile-tab">Change Password</span></ListGroupItem>
                </ListGroup>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}><small className="modal-headermsg">Profile</small></ModalHeader>
                    <ModalBody>
                        <div onClick={this.handleImage}>
                            <img className="img-fluid float-right profile-imagecorner" src={this.state.profileImageName} alt="ProfileImage" width="100" height="100" />
                        </div>
                        <div className="top-right" onClick={this.handleImage}><Ionicon icon="md-camera" color="#3682db" /></div>
                        <input type="file" id="file" ref="fileUploader"
                            style={{ display: "none" }} onChange={this.handleClick.bind(this)} />
                        <Form>
                            <FormGroup>
                                <Label for="name">Name</Label>
                                <Input type="text" className="form-control input-profiletext"
                                    name="name" placeholder="Type here"
                                    value={this.state.name} valid={this.state.validate.nameState === 'has-success'}
                                    invalid={this.state.validate.nameState === 'has-danger'}
                                    onChange={(e) => {
                                        this.validateName(e)
                                        this.handleChange(e)
                                    }} />
                                <FormFeedback invalid>
                                    UserName Length should be Minimum 4.
                                 </FormFeedback>
                                <FormFeedback valid>
                                    UserName is good.
                                 </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="mobile">Mobile</Label>
                                <Input type="text" className="form-control input-profiletext" name="mobile" placeholder="Type here"
                                    value={this.state.mobile}
                                    valid={this.state.validate.mobileState === 'has-success'}
                                    invalid={this.state.validate.mobileState === 'has-danger'}
                                    onChange={(e) => {
                                        this.validateMobile(e)
                                        this.handleChange(e)
                                    }} />
                                <FormFeedback invalid>
                                    Mobile Number Should Have Country Code.
                                   </FormFeedback>
                                <FormFeedback valid>
                                    Mobile No is good.
                                      </FormFeedback>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.updateProfile}>Update Profile</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={this.state.kycModal} toggle={this.toggleKYC} className={this.props.className}>
                    <ModalHeader toggle={this.toggleKYC}><small className="modal-headermsg">KYC</small></ModalHeader>
                    <ModalBody>
                        <Form>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <Label>Currency</Label>
                                        <select className="form-control kycCurrency-country" onChange={this.handleCurrency}>
                                            <option value="eur">EUR - Euro</option>
                                            <option value="chf">CHF - Swiss Franc</option>
                                            <option value="dkk">DKK - Danish Krone</option>
                                            <option value="nok">NOK - Norwegian Krone</option>
                                            <option value="sek">SEK - Swedish Krona</option>
                                            <option value="gbp">GBP - British Pound</option>
                                            <option value="usd">USD - US Dollar</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <Label>Country</Label>
                                        <select className="form-control kycCurrency-country" onClick={this.countryName}>
                                            <option>Select</option>
                                            {
                                                this.state.countryList.map((country, index) => {
                                                    return (<option value={Object.keys(country)}>{country[Object.keys(country)]}</option>);
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="row" style={{ display: this.state.routingNumber }}>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <Label for="routing">Routing Number</Label>
                                        <Input type="text" className="form-control"
                                            name="routing" placeholder="1111111"
                                            onChange={(e) => {
                                                this.handleChange(e)
                                            }} />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <Label for="account">Account Number</Label>
                                        <Input type="text" className="form-control"
                                            name="account" placeholder="5000400440116243"
                                            onChange={(e) => {
                                                this.handleChange(e)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row" style={{ display: this.state.sortCode }}>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <Label for="sortcode">Sort Code</Label>
                                        <Input type="text" className="form-control"
                                            name="sortcode" placeholder="123456"
                                            onChange={(e) => {
                                                this.handleChange(e)
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <Label for="account">Account Number</Label>
                                        <Input type="text" className="form-control"
                                            name="account" placeholder="5000400440116243"
                                            onChange={(e) => {
                                                this.handleChange(e)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <FormGroup style={{ display: this.state.ibanAccountNumber }}>
                                <Label for="iban">IBAN</Label>
                                <Input type="text" className="form-control input-profiletext"
                                    name="iban" placeholder="DK5000400440116243"
                                    onChange={(e) => {
                                        this.handleChange(e)
                                    }}
                                />
                            </FormGroup>

                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <Label for="firstName">First Name</Label>
                                        <Input type="text" className="form-control"
                                            name="firstName" placeholder="First Name"
                                            onChange={(e) => {
                                                this.handleChange(e)
                                            }} />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <Label for="lastName">Last Name</Label>
                                        <Input type="text" className="form-control"
                                            name="lastName" placeholder="Last Name"
                                            onChange={(e) => {
                                                this.handleChange(e)
                                            }} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="form-group">
                                        <Label for="day">DOB Day</Label>
                                        <Input type="number" className="form-control"
                                            name="day" placeholder="Type here"
                                            onChange={(e) => {
                                                this.handleChange(e)
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="form-group">
                                        <Label for="month">DOB Month</Label>
                                        <Input type="number" className="form-control"
                                            name="month" placeholder="Type here"
                                            onChange={(e) => {
                                                this.handleChange(e)
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="form-group">
                                        <Label for="year">DOB Year</Label>
                                        <Input type="number" className="form-control"
                                            name="year" placeholder="Type here"
                                            onChange={(e) => {
                                                this.handleChange(e)
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <FormGroup>
                                <Label for="myFile">Upload Identity Document Passport</Label>
                                <input type="file" id="id-file" name="id-file"
                                    accept=".jpeg,.jpg,.png"
                                    onChange={this.handleClick.bind(this)}></input>
                            </FormGroup>
                            <ModalFooter>
                                <Button color="primary" onClick={this.updateKYC}>Update KYC</Button>{' '}
                                <Button color="secondary" onClick={this.toggleKYC}>Cancel</Button>
                            </ModalFooter>
                        </Form>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.passwordModal} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}><small className="modal-headermsg">Change Password</small></ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label for="password">New Password</Label>
                                <Input type="password" className="form-control input-profiletext" name="password"
                                    value={this.state.password}
                                    valid={this.state.validate.passwordState === 'has-success'}
                                    invalid={this.state.validate.passwordState === 'has-danger'}
                                    onChange={(e) => {
                                        this.validatePassword(e)
                                        this.handleChange(e)
                                    }}
                                    placeholder="Type here" />
                                <FormFeedback invalid>
                                    {/* Password Length should be 8 and alteast have 1 Capital letters. */}
                                </FormFeedback>
                                <FormFeedback valid>
                                    {/* Password is good. */}
                                </FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="confirmPassword">Confirm New Password</Label>
                                <Input type="password" className="form-control input-profiletext" name="confirmPassword" placeholder="Type here"
                                    value={this.state.confirmPassword}
                                    valid={this.state.validate.confimrPasswordState === 'has-success'}
                                    invalid={this.state.validate.confimrPasswordState === 'has-danger'}
                                    onChange={(e) => {
                                        this.validateConfirmPass(e)
                                        this.handleChange(e)
                                    }} />
                                <FormFeedback invalid>
                                    Confirm Password Should Match With Password.
                               </FormFeedback>
                                <FormFeedback valid>
                                    {/* Confirm Password is good. */}
                                </FormFeedback>

                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.updatePassword}>Update</Button>{' '}
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </Card>
        );
    };
};


const mapStateToProps = state => {
    return {
        payCount: state.paymentNotification.payCount
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onInitPaymentCount: () => dispatch(actions.initPaymentCount())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withErrorHandler(ProfileCard, axios)));
Card.propTypes = {
    // Pass in a Component to override default element
    className: PropTypes.string

};
ListGroup.propTypes = {
    flush: PropTypes.bool,
    className: PropTypes.string,
};
import React from 'react';
import { Card, CardTitle, CardImg, CardBody, Modal, ModalBody, ModalHeader, Alert } from 'reactstrap';
import '../../CardComponent/FeedComponent/FeedCardListComponent/FeedCardList.css';
import Ionicon from 'react-ionicons';
import HOC from '../../../hoc/hoc';
import axios from '../../../hoc/axios-instance';
import NoFeed from '../../NoResult/NoResult';
import moment from 'moment';
import StripeCheckout from 'react-stripe-checkout';
class PaymentRecieved extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            isList: false,
            response: [],
            successHeader: '',
            successText: '',
            alertColor: 'success'
        }
        var data = {};
        this.toggle = this.toggle.bind(this);
    };
    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }
    componentDidMount = () => {
        axios.get('PaymentRecievedTask/paymentRecievedList/' + localStorage.getItem('customerId')).then((response) => {
            if (response.data.response.length === 0) {
                this.setState({
                    isList: true
                });
            }
            else {
                this.setState({
                    response: response.data.response
                })
            }
        }).catch(error => {
            console.log(error);
        })
    }

    dateFormatLogic = (response) => {
        let dateString = response;
        let dateObj = new Date(dateString);
        let momentObj = moment(dateObj);
        let momentString = momentObj.format('DD MMM YYYY, hh:mm');
        return momentString;
    }

    getDate = (response) => {
        let dateString = response;
        let dateObj = new Date(dateString);
        let momentObj = moment(dateObj);
        let momentString = momentObj.format('DD MMM YYYY');
        return momentString;
    }

    otpConfirmation = (otp, id, customerId, amountCurrency, index) => {
        var otpName = prompt("Please enter Otp.", "");
        if (otpName !== null) {
            if (otpName === otp) {
                axios.get('/PaymentRecievedTask/paymentStatus/' + id + "?customerId=" + customerId + "&amountCurrency=" + amountCurrency).then(response => {
                    if (response.data.status === 400) {
                        alert('To Transfer Money to Your Account. Please Complete KYC.');
                    }
                    else if (response.data.status === 300) {
                        alert(response.data.response.message);
                    }
                    else if (response.data.status === 301) {
                        alert(response.data.response);
                    }
                    else {
                        let updateStatus = this.state.response;
                        updateStatus[index].isVerified = 'Y';
                        this.setState({
                            response: updateStatus
                        });
                        alert('Amount is transferred succsefully .');
                    }
                });
            }
            else {
                alert('You Have Enter Wrong OTP.');
            }
        }
    }
    render() {
        let responseData;
        if (this.state.isList) {
            responseData = (<Card className="cardList-recent"><CardBody>
                <CardTitle className="card-subtitleList"></CardTitle><NoFeed /></CardBody></Card>);
        }
        else {
            {
                responseData = this.state.response.map((responseData, index) => {
                    return (<Card className="cardList-recent" key={index + "orderPayment"}>
                        <CardBody>
                            <CardImg key={index + "orderPayment" + responseData.OrderUserImage} src={axios.defaults.baseURL + "PackNTagImages/" + responseData.OrderUserImage} className="cardList-profileimg" alt="" />
                            <Ionicon icon="md-plane" color="white" className="card-titleList"></Ionicon>
                            <CardTitle className="card-subtitleList" key={index + "orderPayment" + responseData.UserNamOrdere} >{responseData.UserNamOrdere}</CardTitle>
                            <p className="card-subtitle mb-2 text-muted card-subtitle2List" key={index + "orderPayment" + responseData.OrderDate}>{this.dateFormatLogic(responseData.OrderDate)}</p>
                            <div className="card-text">
                                <Ionicon icon="ios-plane-outline" className="card-outlineList"></Ionicon><span className="card-locationlist card-title" key={index + "orderPayment" + responseData.OrderFrom}>{responseData.OrderFrom}</span>
                                <Ionicon icon="ios-plane-outline" className="card-spacelist"></Ionicon><span className="card-title card-locationlist" key={index + "orderPayment" + responseData.OrderTo}>{responseData.OrderTo}</span>
                                <Ionicon icon="ios-calendar-outline" className="card-spacelist"></Ionicon><span className="card-title card-locationlist" key={index + "orderPayment" + responseData.OrderDate}>{this.getDate(responseData.OrderDate)}</span>
                                <p className="card-text card-textparagaraph">{responseData.OrderContent}</p>
                                <div className="card-line"></div>
                                {responseData.OrderImage ?
                                    <CardImg key={index + "orderPayment" + responseData.OrderImage} src={axios.defaults.baseURL + "PackNTagImages/" + responseData.OrderImage}
                                        className="cardlist-imageitem" alt="" />
                                    : ''
                                }
                                <CardTitle className="card-subtitleList" key={index + "orderPayment"}>{responseData.OrderAmount}</CardTitle>
                                {
                                    responseData.isVerified === 'N' ? <a href="javascript:void(0)"
                                        className="btn btn-primary button-request" onClick={() => this.otpConfirmation(responseData.OTP, responseData.orderItemId, localStorage.getItem('customerId'), responseData.OrderAmount, index)}>Enter OTP</a> : null
                                }
                            </div>
                        </CardBody>
                    </Card>);
                })
            }
        }
        return (
            <HOC>{responseData} <Card className="cardList-recent">
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}><small className="modal-headermsg">Payment Status</small></ModalHeader>
                    <ModalBody>
                        <Alert color={this.state.alertColor}>
                            <h4 className="alert-heading">{this.state.successHeader}</h4>
                            <p>
                                {this.state.successText}
                            </p>
                            <hr />
                        </Alert>
                    </ModalBody>
                </Modal>
                <div className="card-text card-showMore">
                    Show All Orders
                </div>
            </Card></HOC>
        );
    }
}
export default PaymentRecieved;
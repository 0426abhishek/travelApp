import React from 'react';
import { Card, CardTitle, CardImg, CardBody, Modal, ModalBody, ModalHeader, Alert } from 'reactstrap';
import '../CardComponent/FeedComponent/FeedCardListComponent/FeedCardList.css';
import Ionicon from 'react-ionicons';
import HOC from '../../hoc/hoc';
import axios from '../../hoc/axios-instance';
import NoFeed from '../NoResult/NoResult';
import moment from 'moment';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import StripeCheckout from 'react-stripe-checkout';
class OrderCardList extends React.Component {
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
        axios.get('OrderTask/getAllOrderItem/' + localStorage.getItem('customerId')).then((response) => {
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
    submitPayment = (event, index) => {
        const updateButton = this.state.response;
        const updatedPrice = updateButton[index].OrderAmount.split(" ");
        this.data = {};
        this.data['value'] = updatedPrice[0] * 100
        this.data['currency'] = updatedPrice[1]
        this.data['description'] = updateButton[index].OrderContent
        localStorage.setItem('OrderIndex', index);
        localStorage.setItem('OrderItemId', updateButton[index].orderItemId);
    }

    onToken = (token) => {
        this.data['token'] = token.id
        axios.post('OrderTask/getPaymentSubmit/', this.data).then((response) => {
            if (response.data.status === 200) {
                let updateStatus = this.state.response;
                this.setState({
                    successHeader: 'Payment Successful',
                    successText: 'Thank you, your payment was successful.',
                });
                this.toggle();
                this.props.onRemoveCount();
                this.props.onInitChat();
                updateStatus[localStorage.getItem('OrderIndex')].OrderStatus = '3';
                this.setState({
                    response: updateStatus
                });
                axios.get('OrderTask/getPaymentStatus/' + response.data.response.balance_transaction + '?OrderItemId=' + localStorage.getItem('OrderItemId')).then(response => {
                    localStorage.removeItem('OrderItemId');
                    localStorage.removeItem('OrderIndex');
                });
            }
            else {
                this.setState({
                    successHeader: 'Payment Error',
                    successText: response.data.response.message,
                    alertColor: 'danger'
                });
                localStorage.removeItem('OrderItemId');
                localStorage.removeItem('OrderIndex');
                this.toggle();
            }
        });
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
                    let amountCurrency = responseData.OrderAmount.split(" ");
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
                                    responseData.OrderStatus === '3' ? <a href="javascript:void(0)"
                                        className="btn btn-primary button-request">Paid</a> :
                                        <StripeCheckout
                                            token={this.onToken}
                                            amount={amountCurrency[0] * 100} // cents
                                            currency={amountCurrency[1]}
                                            stripeKey="pk_test_YjfxHRjjzjGFxZr9dQCv8814">
                                            <button className="btn btn-primary button-request" onClick={(e) => this.submitPayment(e, index)}>
                                                Pay
                                         </button>
                                        </StripeCheckout>
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
const mapDispatchToProps = dispatch => {
    return {
        onRemoveCount: () => dispatch(actions.removePayment()),
        onInitChat: () => dispatch(actions.initChat()),
    }
}
export default connect(null, mapDispatchToProps)(OrderCardList);
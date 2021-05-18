import React from 'react';
import { Card, CardTitle, CardImg, CardBody } from 'reactstrap';
import './FeedCardList.css';
import { connect } from 'react-redux';
import Ionicon from 'react-ionicons';
import HOC from '../../../../hoc/hoc';
import axios from '../../../../hoc/axios-instance';
import NoFeed from '../../../NoResult/NoResult';
import moment from 'moment';
import withErrorHandler from '../../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../../store/actions/index';

class FeedCardList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isList: false,
            response: [],
        }
    };
    updatePostButton = (index, e) => {
        e.preventDefault();
        const updateButton = this.state.response;
        if (updateButton[index].customerId.toString() !== localStorage.getItem('customerId').toString() && updateButton[index].FeedOrderStatus !== '3') {
            updateButton[index].statusId === 1 ? this.props.onPaymentCount() : null;
            axios.get('FeedTask/updateTravelRequest/' + updateButton[index].id + "?statusId=3").then((response) => {
                const data = {};
                data['OrderCustomerId'] = updateButton[index].statusId === 1 ? updateButton[index].customerId : localStorage.getItem('customerId')
                data['OrderRequestID'] = updateButton[index].id
                data['OrderUserImage'] = updateButton[index].CustImageName
                data['OrderDate'] = updateButton[index].TDateTime
                data['UserNamOrdere'] = updateButton[index].Name
                data['OrderFrom'] = updateButton[index].FromTravel
                data['OrderTo'] = updateButton[index].ToTravel
                data['OrderContent'] = updateButton[index].Content
                data['OrderAmount'] = updateButton[index].Amount
                data['OrderImage'] = updateButton[index].ImageName
                data['OrderStatus'] = updateButton[index].statusId
                data['RequestCustomerId'] = updateButton[index].statusId === 1 ? localStorage.getItem('customerId') : updateButton[index].customerId
                data['UserName'] = localStorage.getItem('ProfileName')
                data['OTP'] = Math.floor(1000 + Math.random() * 9000)
                data['TravelId'] = updateButton[index].statusId === 1 ? updateButton[index].customerId : localStorage.getItem('customerId')
                axios.post('OrderTask/insertOrderItem', data).then((response) => {
                    console.log('Order Updated.');
                }).catch(error => {
                    console.log(error);
                })
            }).catch(error => {
                console.log(error);
            })
        }
        // }).catch(error => {
        //     console.log(error);
        // })
    }
    componentDidMount = () => {
        axios.get('FeedTask/getAllFeedList/' + localStorage.getItem('customerId')).then((response) => {
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
    render() {
        let responseData;
        if (this.state.isList) {
            responseData = (<Card className="cardList-recent"><CardBody>
                <CardTitle className="card-subtitleList"></CardTitle><NoFeed /></CardBody></Card>);
        }
        else {
            {
                responseData = this.state.response.map((responseData, index) => {
                    return (<Card className="cardList-recent" key={index}>
                        <CardBody>
                            <CardImg key={index + responseData.CustImageName} src={axios.defaults.baseURL + "PackNTagImages/" + responseData.CustImageName} className="cardList-profileimg" alt="" />
                            <Ionicon icon="md-plane" color="white" className="card-titleList"></Ionicon>
                            <CardTitle className="card-subtitleList" key={index + responseData.Name} >{responseData.Name}</CardTitle>
                            <p className="card-subtitle mb-2 text-muted card-subtitle2List" key={index + responseData.TDateTime}>{this.dateFormatLogic(responseData.TDateTime)}</p>
                            <div className="card-text">
                                <Ionicon icon="ios-jet-outline" className="card-outlineList"></Ionicon><span className="card-locationlist card-title" key={index + responseData.FromTravel}>{responseData.FromTravel}</span>
                                <Ionicon icon="ios-plane-outline" className="card-spacelist"></Ionicon><span className="card-title card-locationlist" key={index + responseData.ToTravel}>{responseData.ToTravel}</span>
                                <Ionicon icon="ios-calendar-outline" className="card-spacelist"></Ionicon><span className="card-title card-locationlist" key={index + responseData.TDateTime}>{this.getDate(responseData.TDateTime)}</span>
                                <p className="card-text card-textparagaraph">{responseData.Content}</p>
                                <div className="card-line"></div>
                                {responseData.ImageName ?
                                    <CardImg key={index + responseData.ImageName} src={axios.defaults.baseURL + "PackNTagImages/" + responseData.ImageName}
                                        className="cardlist-imageitem" alt="" /> : ''} <CardTitle className="card-subtitleList" key={index}>Will Charge {responseData.Amount}  for {responseData.Weight}</CardTitle>

                                <a href="javascript:void(0)" className="btn btn-primary button-request" key={index}
                                    onClick={(e) => {
                                        this.updatePostButton(index, e)
                                    }}>{responseData.status}</a>
                            </div>
                        </CardBody>
                    </Card>);
                })
            }
        }
        return (
            <HOC>{responseData} <Card className="cardList-recent">
                <div className="card-text card-showMore">
                    Show All Orders
                </div>
            </Card></HOC>
        );
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onPaymentCount: () => dispatch(actions.addPayment())
    }
}

export default connect(null, mapDispatchToProps)(withErrorHandler(FeedCardList, axios));
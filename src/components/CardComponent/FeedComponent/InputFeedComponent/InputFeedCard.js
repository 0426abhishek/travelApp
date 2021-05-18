import React from 'react';
import { Card, CardHeader, CardText, CardImg, CardBody, Form, FormGroup, Input, Button, Popover, PopoverHeader, ListGroup, ListGroupItem } from 'reactstrap';
import DateTime from 'react-datetime';
import './InputFeedCard.css';
import Ionicon from 'react-ionicons';
import axios from '../../../../hoc/axios-instance';
import { debounce } from 'throttle-debounce';
import moment from 'moment';
import withErrorHandler from '../../../../hoc/withErrorHandler/withErrorHandler';

class InputFeedCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            travelingcontainer: {
                color: '#3682db'
            },
            requestingcontainer: {
                color: ''
            },
            TDateTime: 'Date Time Picker',
            Content: '',
            From: '',
            To: '',
            ImageName: '',
            selectedFile: '',
            Amount: '',
            validateAmount: false,
            Weight: '',
            popoverOpen: false,
            popoverOpen1: false,
            arrayFrom: [],
            arrayTo: [],
            currency: 'Currency'
        }
        var imageData;
        this.handleClick = this.handleClick.bind(this);
    };

    handleImage = (e) => {
        this.refs.fileUploader.click();

    }

    toggleFrom = () => {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    }
    toggleFrom1 = () => {
        this.setState({
            popoverOpen1: !this.state.popoverOpen1
        });
    }

    getCurrency = (event) => {
        this.setState({ currency: event.target.value });
    }

    setFromValue = (fromValue) => {
        this.setState({
            From: fromValue
        });
        this.toggleFrom();
    }
    setToValue = (toValue) => {
        this.setState({
            To: toValue
        });
        this.toggleFrom1();
    }

    handleClick(event) {
        this.imageData = event.target.files[0];
        this.setState({
            ImageName: event.target.files[0].name,
            selectedFile: event.target.files[0]

        });

    }
    travelClick = () => {
        this.setState({
            travelingcontainer: {
                color: '#3682db'
            },
            requestingcontainer: {
                color: ''
            }
        });
    }

    requestClick = () => {
        this.setState({
            travelingcontainer: {
                color: ''
            },
            requestingcontainer: {
                color: '#3682db'
            }
        });
    }

    handleChange = (date, event) => {
        this.setState({ TDateTime: date });
    }

    validateAmount = (e) => {
        const emailRex = /^[0-9]+$/;
        if (emailRex.test(e.target.value)) {
            this.setState({
                validateAmount: true
            })
        } else {
            this.setState({
                validateAmount: false
            })
        }
    }
    changeTextContent = async (event) => {
        const { target } = event;
        const value = target.value;
        const { name } = target;
        await this.setState({
            [name]: value,
        });
        console.log(value);
        if (name === 'From' || name === 'To') {
            this.setState({
                arrayFrom: [],
                arrayTo: []
            })
            return debounce(axios.get('LocationTask/getCities/' + value).then(response => {
                if (response !== undefined) {
                    name === 'From' ? this.setState({
                        arrayFrom: response.data.response
                    }) : this.setState({
                        arrayTo: response.data.response
                    })
                }
            }).catch(error => {
                console.log(error);
            }), 5000
            );
        }
    }
    updateServiceCall = () => {
        const data = new FormData()
        data.append('selectedFile', this.state.requestingcontainer.color ? this.imageData : '')
        data.append('ImageName', this.state.requestingcontainer.color ? this.state.ImageName : '')
        data.append('Amount', this.state.Amount + " " + this.state.currency)
        data.append('Content', this.state.Content)
        data.append('From', this.state.From)
        data.append('To', this.state.To)
        data.append('TDateTime', moment(this.state.TDateTime).format("YYYY-MM-DD hh:mm:ss"))
        data.append('Status', this.state.requestingcontainer.color ? '2' : '1')
        data.append('FeedOrderStatus', '0');
        data.append('Weight', this.state.Weight);
        data.append('customerId', localStorage.getItem('customerId'))
        axios.post('FeedTask/insertTravel', data).then((response) => {
            window.location.reload();
            // console.log(JSON.stringify(response));
        }).catch(error => {
            console.log(error);
        });
    }
    submitTravelInfo = () => {
        if (this.state.requestingcontainer.color) {
            if (this.imageData === '' || this.state.Content === '' ||
                this.state.From === '' || this.state.To === '' || this.state.TDateTime === '' || this.state.Weight === '') {
                alert('Please Fill all the Fields.');
            }
            else if (this.state.validateAmount === false) {
                alert('Please Enter Amount in Numeric');
            }
            else if (this.state.currency === 'Currency') {
                alert('Please Select Currency.');
            }
            else {
                this.updateServiceCall();
            }
        }
        else {
            if (this.state.Content === '' ||
                this.state.From === '' || this.state.To === '' || this.state.TDateTime === '' || this.state.Weight === '') {
                alert('Please Fill all the Fields.');
            }
            else if (this.state.validateAmount === false) {
                alert('Please Enter Amount in Numeric');
            }
            else if (this.state.currency === 'Currency') {
                alert('Please Select Currency.');
            }
            else {
                this.updateServiceCall();
            }
        }
    }
    render() {
        let responseData = '';
        return (
            <Card className="input-cardbody">
                <CardHeader>
                    <CardText className="input-cardtext">{localStorage.getItem('ProfileName')} is</CardText>
                    <ul className="list-inline input-cardtab">
                        <li className="list-inline-item input-travellingspaces"><a className="social-icon text-xs-center" href="javascript:void(0)" style={this.state.travelingcontainer} onClick={this.travelClick}>TRAVELING</a></li>
                        <li className="list-inline-item"><a className="social-icon text-xs-center" href="javascript:void(0)" style={this.state.requestingcontainer} onClick={this.requestClick}>REQUESTING</a></li>
                    </ul>
                </CardHeader>
                <CardBody>
                    <CardImg className="input-profileimage" src={localStorage.getItem('profileImage')} alt=""></CardImg>
                    <CardText className="inputbox-cardtext">
                        <textarea className="form-control textarea-content"
                            rows="3"
                            placeholder="What's on your mind ?" name="Content" onChange={(e) => {
                                this.changeTextContent(e)
                            }}></textarea></CardText>
                </CardBody>
                <CardHeader className="fromto-input">
                    <Form className="form-row">
                        <FormGroup inline>
                            <div className="input-group md-10">
                                <Input type="text" placeholder="From" id="Popover2"
                                    value={this.state.From}
                                    onChange={(e) => {
                                        this.changeTextContent(e)
                                        this.toggleFrom()
                                    }}
                                    name="From" />
                                <Popover placement="bottom-right" isOpen={this.state.popoverOpen} target="Popover2" toggle={this.toggleFrom}>
                                    <PopoverHeader className="poplist-view">SEARCH RESULTS</PopoverHeader>
                                    <ListGroup className="popsubList-view">
                                        {
                                            responseData = this.state.arrayFrom.map((responseData, index) => {
                                                return <ListGroupItem className="FromList-input" key={responseData.citycountry} onClick={() => this.setFromValue(responseData.citycountry)}>{responseData.citycountry}</ListGroupItem >
                                            })
                                        }
                                    </ListGroup>
                                </Popover>
                                <Input type="text" placeholder="To" id="Popover3"
                                    value={this.state.To}
                                    onChange={(e) => {
                                        this.changeTextContent(e)
                                        this.toggleFrom1()
                                    }}
                                    name="To" />
                                <Popover placement="bottom-right" isOpen={this.state.popoverOpen1} target="Popover3" toggle={this.toggleFrom1}>
                                    <PopoverHeader className="poplist-view">SEARCH RESULTS</PopoverHeader>
                                    <ListGroup className="popsubList-view">
                                        {
                                            responseData = this.state.arrayTo.map((responseData, index) => {
                                                return <ListGroupItem className="FromList-input" key={responseData.citycountry} onClick={() => this.setToValue(responseData.citycountry)}>{responseData.citycountry}</ListGroupItem >
                                            })
                                        }
                                    </ListGroup>
                                </Popover>

                                &nbsp;&nbsp;&nbsp;&nbsp;<div className="md-2">
                                    <DateTime value={this.state.TDateTime} name="TDateTime"
                                        onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                        </FormGroup>
                    </Form>
                </CardHeader>
                {
                    this.state.requestingcontainer.color ? (<ul className="nav input-buttonpost">

                        <li>
                            <Input type="text" placeholder="Enter Amount" value={this.state.Amount}
                                onChange={(e) => {
                                    this.validateAmount(e)
                                    this.changeTextContent(e)
                                }}
                                name="Amount" className="amount-input" />
                        </li>
                        <li className="select-currency">
                            <select class="inputcustom-select" onChange={this.getCurrency} value={this.state.currency}>
                                <option value="Currency">Currency</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR </option>
                                <option value="BGN">BGN</option>
                                <option value="BRL">BRL</option>
                                <option value="CAD">CAD</option>
                                <option value="CHF">CHF</option>
                                <option value="CZK">CZK</option>
                                <option value="DKK">DKK</option>
                                <option value="GBP">GBP</option>
                                <option value="HKD">HKD</option>
                                <option value="HRK">HRK</option>
                                <option value="HUF">HUF</option>
                                <option value="ILS">ILS</option>
                                <option value="INR">INR</option>
                                <option value="ISK">ISK</option>
                                <option value="JPY">JPY</option>
                                <option value="MXN">MXN</option>
                                <option value="MYR">MYR</option>
                                <option value="NOK">NOK</option>
                                <option value="NZD">NZD</option>
                                <option value="PHP">PHP</option>
                                <option value="PLN">PLN</option>
                                <option value="RON">RON</option>
                                <option value="RUB">RUB</option>
                                <option value="SEK">SEK</option>
                                <option value="SGD">SGD</option>
                                <option value="THB">THB</option>
                                <option value="TWD">TWD</option>
                            </select>
                        </li>
                        <li>
                            <Input type="text" placeholder="Enter Weight(kg)" value={this.state.Weight}
                                onChange={(e) => {
                                    this.changeTextContent(e)
                                }}
                                name="Weight" className="amount-input" />
                        </li>
                        <li className="nav-item profile-attach">
                            <Ionicon icon="ios-attach"></Ionicon>
                        </li>
                        <li className="nav-item profile-attach" onClick={this.handleImage}>
                            <Button outline color="secondary input-buttontext"><small className="attach-Image">Attach</small>&nbsp;&nbsp;&nbsp;&nbsp;<small className="attach-Image" style={{ color: '#3682db' }}>{this.state.ImageName ? 'Uploaded' : ''}</small></Button>
                            <input type="file" id="file" ref="fileUploader" style={{ display: 'none' }} onChange={this.handleClick.bind(this)} />
                        </li>
                        <li className="nav-item">
                            <a href="javascript:void(0)" className="btn btn-primary button-post" onClick={this.submitTravelInfo}>POST</a>
                        </li>
                    </ul>) : (<ul className="nav input-buttonpost">
                        <li>
                            <Input type="text" placeholder="Enter Amount" value={this.state.Amount}
                                onChange={(e) => {
                                    this.validateAmount(e)
                                    this.changeTextContent(e)
                                }}
                                name="Amount" className="md-2 amount-input" />
                        </li>
                        <li className="select-currency">
                            <select class="inputcustom-select" onChange={this.getCurrency} value={this.state.currency}>
                                <option value="Currency">Currency</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR </option>
                                <option value="BGN">BGN</option>
                                <option value="BRL">BRL</option>
                                <option value="CAD">CAD</option>
                                <option value="CHF">CHF</option>
                                <option value="CZK">CZK</option>
                                <option value="DKK">DKK</option>
                                <option value="GBP">GBP</option>
                                <option value="HKD">HKD</option>
                                <option value="HRK">HRK</option>
                                <option value="HUF">HUF</option>
                                <option value="ILS">ILS</option>
                                <option value="INR">INR</option> 
                                <option value="ISK">ISK</option>
                                <option value="JPY">JPY</option>
                                <option value="MXN">MXN</option>
                                <option value="MYR">MYR</option>
                                <option value="NOK">NOK</option>
                                <option value="NZD">NZD</option>
                                <option value="PHP">PHP</option>
                                <option value="PLN">PLN</option>
                                <option value="RON">RON</option>
                                <option value="RUB">RUB</option>
                                <option value="SEK">SEK</option>
                                <option value="SGD">SGD</option>
                                <option value="THB">THB</option>
                                <option value="TWD">TWD</option>
                            </select>
                        </li>
                        <li>
                            <Input type="text" placeholder="Enter Weight(kg)" value={this.state.Weight}
                                onChange={(e) => {
                                    this.changeTextContent(e)
                                }}
                                name="Weight" className="amount-input" />
                        </li>
                        <li className="nav-item">
                            <a href="javascript:void(0)" className="btn btn-primary button-post" style={{ bottom: '4px' }} onClick={this.submitTravelInfo}>POST</a>
                        </li>
                    </ul>)

                }
            </Card>
        );
    }
}

export default InputFeedCard;

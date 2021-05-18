import React from 'react';
import './Navigation.css';
import {
  Collapse, Label,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink, CardImg, Badge, Popover, PopoverHeader, ListGroup, ListGroupItem, Tooltip, ModalHeader, ModalBody, Button, Modal, ModalFooter, FormFeedback, FormGroup, Form, Input
} from 'reactstrap';
import getImage from '../ImagesFetcher/ImagesFetcher';
import Ionicon from 'react-ionicons';
import axios from '../../hoc/axios-instance';

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      notificationCount: '',
      profileUserName: '',
      profileImageName: '',
      popoverOpen: false,
      tooltipOpen: false,
      notifyList: [],
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  toggleNotfication = () => {
    if (this.state.notificationCount > 0) {
      this.setState({
        popoverOpen: !this.state.popoverOpen
      });
    }
  }
  toggleAutoHide = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }
  logOut = () => {
    localStorage.clear();
    window.location.href = "/";
  }
  componentDidMount = () => {
    axios.get('Registration/getProfileInfo/' + localStorage.getItem('customerId')).then((response) => {
      this.setState({
        profileUserName: response.data.response[0].name,
        profileImageName: axios.defaults.baseURL + "PackNTagImages/" + response.data.response[0].imagename
      });
      localStorage.setItem("profileImage", axios.defaults.baseURL + "PackNTagImages/" + response.data.response[0].imagename);
    }).catch(error => {
      console.log(error);
    });
    axios.get('NotifyTask/getNotifyList/' + localStorage.getItem('customerId')).then((response) => {
      if (response.data.response.length > 0) {
        this.setState({
          notifyList: response.data.response,
          notificationCount: response.data.response.length
        });
      }
    }).catch(error => {
      console.log(error);
    });
  }
  render() {
    return (
      <Navbar color="white" light expand="md" style={{ cursor: 'pointer' }}>
        <NavbarBrand href="/"> <img src={getImage('logo')} className="d-inline-block align-top company-logo" alt="company-logo" /> <span style={{ fontSize: '21px', fontWeight: '800', fontStyle: 'italic', float: 'right', marginTop: '10px' }}>Pack N Tag</span></NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink id="Popover1" onClick={this.toggleNotfication}><Ionicon icon="ios-notifications-outline" /> <Badge color="primary" className="badgeNotification">{this.state.notificationCount}</Badge>
              </NavLink>
              <div>
                <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggleNotfication}>
                  <PopoverHeader className="poplist-view">Notification List</PopoverHeader>
                  <ListGroup className="popsubList-view">
                    {
                      this.state.notifyList.map((responseData, index) => {
                        return (<ListGroupItem key={index + "notify"}><small className="otp_list">OTP <span style={{ color: '#3682db' }}>{responseData.OTP}</span> travelling From {responseData.OrderFrom} to {responseData.OrderTo} .</small></ListGroupItem >)
                      })
                    }
                  </ListGroup>
                </Popover>
              </div>
            </NavItem>
            <NavItem>
              <NavLink><CardImg style={{ width: '25px', height: '25px', borderRadius: '50%' }} src={this.state.profileImageName}></CardImg>
                <span style={{ fontSize: 'x-small', marginTop: '7px', fontWeight: '800', marginLeft: '10px' }}>{this.state.profileUserName} {''}</span>
              </NavLink>
            </NavItem>
            <NavItem onClick={this.logOut}>
              <NavLink id="DisabledAutoHideExample" onClick={this.toggleAutoHide}>
                <Ionicon icon="md-arrow-dropdown" color="gray" fontSize="15px" style={{ marginTop: '2px', fontSize: 'x-small' }} />
                <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="DisabledAutoHideExample" toggle={this.toggleAutoHide}>
                  Logout
              </Tooltip>
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}
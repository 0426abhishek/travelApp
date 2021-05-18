import React from 'react';
import './OrderComponent.css';
import Navigation from '../Navigation/Navigation';
import { Container, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import ProfileCard from '../CardComponent/ProfileComponent/ProfileCard';
import OrderCardList from './OrderCardList';
import { withRouter } from 'react-router';
import ChatComponent from '../ChatComponent/ChatComponent';
import PaymentRecieved from './PaymentRecieved/PaymentRecieved';
class OrderComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Container className="card-container">
                <Navigation />
                <Container fluid>
                    <Row>
                        <Col lg={3} ><ProfileCard /></Col>
                        {
                            this.props.location.state.recieved === 'recieved' ? (<Col lg={6} ><PaymentRecieved /></Col>) : (<Col lg={6} ><OrderCardList /></Col>)
                        }
                    </Row>
                </Container>
                <ChatComponent />
            </Container>);
    }
}
Container.propTypes = {
    fluid: PropTypes.bool
    // applies .container-fluid class
}
export default withRouter(OrderComponent);
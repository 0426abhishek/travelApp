import React from 'react';
import './MainComponent.css';
import { withRouter } from 'react-router';
import Navigation from '../Navigation/Navigation';
import { Container, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import ProfileCard from '../CardComponent/ProfileComponent/ProfileCard';
import FeedCard from '../CardComponent/FeedComponent/FeedCard';
import SearchCard from '../CardComponent/SearchComponent/SearchCard';
import ChatComponent from '../ChatComponent/ChatComponent';
// import Footer from '../FooterNavigation/FooterComponent';
class MainController extends React.Component {
    render() {
        return (
            <div className="card-container">
                <Navigation />
                <Container fluid style={{ backgroundColor: 'whitesmoke' }}>
                    <Row>
                        <Col lg={3} ><ProfileCard /></Col>
                        <Col lg={6} ><FeedCard /></Col>
                        <Col lg={3}><SearchCard /></Col>
                    </Row>
                </Container>
                <ChatComponent />
                {/* <Footer/> */}
            </div>);
    }
}
Container.propTypes = {
    fluid: PropTypes.bool
    // applies .container-fluid class
}
export default withRouter(MainController);
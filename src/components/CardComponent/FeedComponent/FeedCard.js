import React from 'react';
import './FeedCard.css';
import { Card, CardText } from 'reactstrap'
import Hoc from '../../../hoc/hoc';
import InputFeedCard from './InputFeedComponent/InputFeedCard';
import Ionicon from 'react-ionicons';
import FeedCardList from '../FeedComponent/FeedCardListComponent/FeedCardList'
const FeedCard = (props) => {
    return (
        <Hoc>
            <InputFeedCard></InputFeedCard>
            <Card className = "feed-cardheader">
                <CardText className = "feed-cardheadertitle">
                    RECENT LISTING
                    <Ionicon icon="logo-dropbox" className="feedheader-button" color="white"></Ionicon>
                 </CardText>
            </Card>
            <FeedCardList/>
        </Hoc>
    );
};
export default FeedCard;



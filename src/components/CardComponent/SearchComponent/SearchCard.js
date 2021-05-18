import React from 'react';
import './SearchCard.css';
import Ionicon from 'react-ionicons'
import Hoc from '../../../hoc/hoc';
import axios from '../../../hoc/axios-instance';
import moment from 'moment';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';

class SearchCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            travelResponse: [],
            travelMatchResponse: [],
        }
    };
    componentDidMount = () => {
        axios.get("FeedTask/getTravelPlan/" + localStorage.getItem('customerId')).then((response) => {
            this.setState({
                travelResponse: response.data.response
            })
            axios.get("FeedTask/getSearchPlan/" + localStorage.getItem('customerId')+"?From="+response.data.response[0].FromTravel+"&To="+response.data.response[0].ToTravel)
                .then((response) => {
                    this.setState({
                        travelMatchResponse: response.data.response
                    })
                }).catch(error => {
                    console.log(error);
                })
        }).catch(error => {
            console.log(error);
        })
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
        let responseSearch;
        responseData = this.state.travelResponse.map((responseData, index) => {
            return (
                <ul className="list-group" key={index}>
                    <li className="list-group-item justify-content-between card-sideView1">
                        <div className="card-title">
                            <span className="badge" key={index+responseData.FromTravel}><Ionicon icon="md-plane" color="#9b9a9a" classNameName="travelplan-icon"></Ionicon></span>
                            {responseData.FromTravel}&nbsp;&nbsp;to&nbsp;&nbsp;{responseData.ToTravel}
                        </div>
                        <div className="card-title" key={index+responseData.TDateTime}>
                            <span className="badge"><Ionicon icon="ios-calendar-outline" color="#9b9a9a" classNameName="travelplan-icon"></Ionicon></span>
                            {this.getDate(responseData.TDateTime)}
                        </div>

                    </li>
                </ul>
            );
        });

        responseSearch = this.state.travelMatchResponse.map((responseSearch,index)=>{
                  return (<ul className="list-group" key={index}>
                  <li className="list-group-item justify-content-between card-sideView">
                      <div className="card-title">
                          <img key={index+responseSearch.CustImageName} src= {axios.defaults.baseURL + "PackNTagImages/" + responseSearch.CustImageName} className="subcard-circle" alt="" />
                          <span className="card-title cards-subtitle1">Abhishek Singh</span>
                      </div>
                      <div className="card-title" key={index+responseData.FromTravel}>
                          <span className="badge"><Ionicon icon="md-plane" color="#9b9a9a" classNameName="travelplan-icon"></Ionicon></span>
                          {responseSearch.FromTravel}&nbsp;&nbsp;to&nbsp;&nbsp;{responseSearch.ToTravel}
                      </div>
                      <div className="card-title">
                          <span className="badge"><Ionicon icon="ios-calendar-outline" color="#9b9a9a" classNameName="travelplan-icon"></Ionicon></span>
                          {this.getDate(responseSearch.TDateTime)}
                      </div>
                      <div className="card-title">
                          <span className="badge"><Ionicon icon="md-clipboard" color="#9b9a9a" classNameName="travelplan-icon"></Ionicon></span>
                          {responseSearch.Content}
                      </div>
                  </li>
              </ul>);
        });
   return (
            <Hoc>
                {this.state.travelResponse.length ? <div className="card profile-shortCard">
                    <ul className="list-group">
                        <li className="list-group-item justify-content-between card-sideView">
                            <span className="badge"><Ionicon icon="ios-book" classNameName="travelplan-icon"></Ionicon></span>
                            YOUR TRAVEL PLAN
                    </li>
                    </ul>{responseData}</div> : null}
                {this.state.travelMatchResponse.length ? <div className="card profile-shortCard">
                    <ul className="list-group">
                        <li className="list-group-item justify-content-between card-sideView">
                            <span className="badge"><Ionicon icon="ios-bulb-outline" classNameName="travelplan-icon"></Ionicon></span>
                            PROSPECTIVE MATCHES </li></ul>{responseSearch} <ul className="list-group">
                        <li className="list-group-item  card-sideView">See More</li>
                    </ul></div> : null}
            </Hoc>
        );

    }
}

export default withErrorHandler(SearchCard,axios);
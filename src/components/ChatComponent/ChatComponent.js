import React from 'react';
import { connect } from 'react-redux';
import './ChatComponent.css';
import Ionicon from 'react-ionicons';
import Hoc from '../../hoc/hoc';
import * as actions from '../../store/actions/index';
var Sendbird = require('sendbird');
var sb = new Sendbird({ 'appId': 'CBA0022E-EAAE-4826-86EA-09B4E286C456' });

class ChatComponent extends React.Component {
    componentWillMount = () => {
        this.props.onInitChat();
        const channelHandler = new sb.ChannelHandler();
        channelHandler.onMessageReceived = (channel, message) => {
            this.props.updateChatText(message);
        };
        sb.addChannelHandler(localStorage.getItem('channelUrl'), channelHandler);
    }
    componentDidMount = () => {
        sb.connect(localStorage.getItem('customerId'), function (user, error) {
        });
        sb.updateCurrentUserInfo(localStorage.getItem('ProfileName'), localStorage.getItem('profileImage'), function (response, error) {
            if (error) {
                console.log(error);
            }
            // console.log(response, error);
        });
    }
    render() {
        let responseData;
        let responseChatList;
        responseData = this.props.chatResponse.map((responseData, index) => {
            return (
                <li className="list-group-item pro-chatList" key={index + "ChatList"} onClick={() => this.props.getGroupChatList(responseData)}>{responseData.UserName === localStorage.getItem('ProfileName') ? responseData.UserNamOrdere : responseData.UserName}</li>
            );
        });
        responseChatList = this.props.chatListResponse.map((responseChatList, index) => {
            return (
                localStorage.getItem('customerId') === responseChatList.userId ? (<li style={{ width: '100%' }} key={index + "chatdataList"}>
                    <div className="msj macro">
                        <div className="avatar"><img className="img-circle" style={{ width: '100%' }} src={responseChatList.profileUrl} /></div>
                        <div className="text text-l">
                            <p>{responseChatList.message}</p>
                            <p><small></small></p>
                        </div>
                    </div>
                </li>) : (<li style={{ width: "100%" }} key={index + "chatdataList"}>
                    <div className="msj-rta macro">
                        <div className="text text-r">
                            <p>{responseChatList.message}</p>
                            <p><small></small></p>
                        </div>
                        <div className="avatar" style={{ padding: "0px 0px 0px 10px !important" }}>
                            <img className="img-circle" style={{ width: "100%" }} src={responseChatList.profileUrl} />
                        </div>
                    </div>
                </li>)

            );
        });
        return (
            <Hoc>
                <div className="sb_widget">
                    <div className="widget ic-login" style={{ display: this.props.chatIcon }} onClick={this.props.onChangeIcon}>
                        <div className="notification"></div>
                    </div>
                    <div className="card cardChat-list" style={{ display: this.props.chatList }}>
                        <div className="card-header cardChat-Header" onClick={this.props.onchangeChatList}>
                            Chat List
                        <Ionicon icon="ios-arrow-down" color="white" className="downarrow-char"></Ionicon>
                        </div>
                        <ul className="list-group list-group-flush profile-inline">
                            {responseData}
                        </ul>
                    </div>
                    <div className="col-sm-3 col-sm-offset-4 frame" style={{ display: this.props.chatText }}>
                        <div className="crossarrow-char" onClick={this.props.onchangeChatText}>
                            <Ionicon icon="md-close" color="black" fontSize="30px"></Ionicon>
                        </div>
                        <ul>
                            {responseChatList}
                        </ul>
                        <div>
                            <div className="msj-rta macro">
                                <div className="text text-r" style={{ background: 'whitesmoke !important' }}>
                                    <input className="mytext" placeholder="Type a message" value={this.props.inputChatText}
                                        onChange={(e) => {
                                            this.props.setInputChatText(e)
                                        }} />
                                </div>
                            </div>
                            <div style={{ padding: '10px' }} onClick={() => this.props.sendMessageText(this.props.inputChatText)}>
                                <span className="glyphicon glyphicon-share-alt" style={{ top: '10px' }}></span>
                            </div>
                        </div>
                    </div>
                </div>
            </Hoc>

        );
    }
}
const mapStateToProps = state => {
    return {
        chatIcon: state.chatNotification.chatIcon,
        chatList: state.chatNotification.chatList,
        chatText: state.chatNotification.chatText,
        chatResponse: state.chatNotification.chatResponse,
        chatListResponse: state.chatNotification.chatListResponse,
        inputChatText: state.chatNotification.inputChatText
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onInitChat: () => dispatch(actions.initChat()),
        onChangeIcon: () => dispatch(actions.changeIcon()),
        onchangeChatList: () => dispatch(actions.changeChatList()),
        onchangeChatText: () => dispatch(actions.changeChatText()),
        getGroupChatList: (response) => dispatch(actions.getGroupChatList(response)),
        setInputChatText: (e) => dispatch(actions.setInputChatText(e)),
        sendMessageText: (text) => dispatch(actions.sendMessageText(text)),
        updateChatText: (text) => dispatch(actions.updateChatText(text))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatComponent);
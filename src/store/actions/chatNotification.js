import * as actionTypes from './actionTypes';
import axios from '../../hoc/axios-instance';
var Sendbird = require('sendbird');
var sb = new Sendbird({ 'appId': 'CBA0022E-EAAE-4826-86EA-09B4E286C456' });

export const setChatCount = (chatCount) => {
    return {
        type: actionTypes.SET_CHAT_ICON,
        chatCount: chatCount
    };
}

export const setchangeChatList = () => {
    return {
        type: actionTypes.SET_CHAT_CHANGECHATLIST
    }
}
export const setChangeIcon = (response) => {
    return {
        type: actionTypes.SET_CHAT_CHANGEICON,
        chatResponse: response
    }
}
export const setchangeChatText = () => {
    return {
        type: actionTypes.SET_CHANGE_CHATTEXT
    }
}

export const setGroupChatList = (response) => {
    return {
        type: actionTypes.SET_GROUP_CHATLIST,
        groupresponse: response
    }
}

export const setInputText = (response) => {
    return {
        type : actionTypes.SET_INPUT_TEXT,
        inputResponse : response
    }
}


export const sendMessageTextValue = () => {
    return {
        type : actionTypes.SEND_INPUT_MSG
    }
}

export const updateChatTextValue = (response) => {
    return {
        type: actionTypes.UPDATE_INPUT_MSG,
        updateResponse : response
    }
}





export const initChat = () => {
    return dispatch => {
        axios.get('ChatTask/chatCount/' + localStorage.getItem('customerId'))
            .then(response => {
                dispatch(setChatCount(response.data.response[0].chatcount));
            })
            .catch(error => {
                console.log(error);
                // dispatch(setPaymentError());
            });
    };
};

export const changeChatList = () => {
    return dispatch => {
        dispatch(setchangeChatList());
    }
}

export const changeIcon = () => {
    return dispatch => {
        axios.get('ChatTask/chatList/' + localStorage.getItem('customerId'))
            .then(response => {
                dispatch(setChangeIcon(response.data.response));
            })
            .catch(error => {
                console.log(error);
                // dispatch(setPaymentError());
            });
    };
}
export const changeChatText = () => {
    return dispatch => {
        dispatch(setchangeChatText());
    }
}
export const getGroupChatList = (response) => {
    return dispatch => {
        sb.GroupChannel.createChannelWithUserIds([response.RequestCustomerId, response.OrderCustomerId], true, 'Chat group', 'https://sendbird.com/main/img/cover/cover_08.jpg', 'hi', 'personal', function (createdChannel, error) {
            if (error) {
                console.error(error);
                return;
            }
            else {
                localStorage.setItem('channelUrl', createdChannel.url);
                sb.GroupChannel.getChannel(localStorage.getItem('channelUrl'), (channel, err) => {
                    var messageListQuery = channel.createPreviousMessageListQuery();
                    messageListQuery.load(30, true, function (messageList, error) {
                        if (error) {
                            console.error(error);
                            return;
                        }
                        else {
                            dispatch(setGroupChatList(messageList));
                        }
                    });
                });
            }
        });
    }
}

export const setInputChatText = (e) =>{
    return dispatch => {
        dispatch(setInputText(e));
    } 
}
export const sendMessageText = (text) => {
  return dispatch=> {
    sb.GroupChannel.getChannel(localStorage.getItem('channelUrl'), (channel, err) => {
        // send message
        channel.sendUserMessage(text, (message, err) => {
            dispatch(sendMessageTextValue());
        });
      });
      
  }
}
export const updateChatText = (text) => {
    return dispatch => {
        dispatch(updateChatTextValue(text));
    }
}

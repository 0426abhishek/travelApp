import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';
const initialState = {
    chatIcon: 'none',
    chatList: 'none',
    chatText: 'none',
    chatResponse: [],
    chatListResponse: [],
    inputChatText: ''
};

const setChatIconCount = (state, action) => {
    let updatedState = {
        chatIcon: 'none',
        chatList: 'none'
    }
    if (action.chatCount > 0) {
        updatedState = {
            chatIcon: 'block',
            chatList: 'none',
            chatText: 'none'
        }
    }
    return updateObject(state, updatedState)
}

const setChatChangeIcon = (state, action) => {
    let updatedState = {
        chatIcon: 'none',
        chatList: 'block',
        chatText: 'none',
        chatResponse: action.chatResponse
    }
    return updateObject(state, updatedState)
}

const setchangeChatText = (state, action) => {
    let updatedState = {
        chatIcon: 'none',
        chatList: 'block',
        chatText: 'none'
    }
    localStorage.removeItem('channelUrl');
    return updateObject(state, updatedState)
}
const setchangeChatList = (state, action) => {
    let updatedState = {
        chatIcon: 'block',
        chatList: 'none',
        chatText: 'none',
    }

    return updateObject(state, updatedState)
}

const setGroupChatList = (state, action) => {
    let chatListResponse = [];
    action.groupresponse.map((groupMessage, index) => {
        chatListResponse.push({
            message: groupMessage.message,
            userId: groupMessage.sender.userId,
            name: groupMessage.sender.nickname,
            profileUrl: groupMessage.sender.profileUrl
        })
    });
    let updatedState = {
        chatIcon: 'none',
        chatList: 'none',
        chatText: 'block',
        chatListResponse: chatListResponse
    }
    return updateObject(state, updatedState)
}

const setInputText = (state, action) => {
    const value = action.inputResponse.target.value;
    let updatedState = ({
        inputChatText: value,
    });
    return updateObject(state, updatedState)
}



const sendMessageValue = (state, action) => {
    let updatedState = {
        message: state.inputChatText,
        userId: localStorage.getItem('customerId'),
        name: localStorage.getItem('ProfileName'),
        profileUrl: localStorage.getItem('profileImage')
    }
    return {
        ...state,
        chatListResponse: [...state.chatListResponse, updatedState], inputChatText: ''
    }
}


const updateMessageValue = (state, action) => {
    let updatedState = {
        message: action.updateResponse.message,
        userId: action.updateResponse.sender.userId,
        name: action.updateResponse.sender.nickname,
        profileUrl: action.updateResponse.sender.profileUrl
    }
    return {
        ...state,
        chatListResponse: [...state.chatListResponse, updatedState]
    }

}



const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_CHAT_ICON: return setChatIconCount(state, action);
        case actionTypes.SET_CHAT_CHANGEICON: return setChatChangeIcon(state, action);
        case actionTypes.SET_CHAT_CHANGECHATLIST: return setchangeChatList(state, action);
        case actionTypes.SET_CHANGE_CHATTEXT: return setchangeChatText(state, action);
        case actionTypes.SET_GROUP_CHATLIST: return setGroupChatList(state, action);
        case actionTypes.SET_INPUT_TEXT: return setInputText(state, action);
        case actionTypes.SEND_INPUT_MSG: return sendMessageValue(state, action);
        case actionTypes.UPDATE_INPUT_MSG: return updateMessageValue(state, action);
        default: return state;
    }
};

export default reducer;
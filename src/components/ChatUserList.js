import React, { useState, useEffect, useContext } from 'react';
import { SocketIOContext } from './SocketContext';
import { format } from 'date-fns';

const ChatUserList = ({ setShowIconFetchMsg, setShowChatBody, setShowChatHeader, isBlock, setFullnameUserChat, chatMsg, handleChatIdToCreateChatMsg, selectedChat, setSelectedChat, index, setCreateChatStatus, userDataInActiveId, setChatMsg, chatId, userInfo, chatOfUserId }) => {
  const { socket } = useContext(SocketIOContext);

  const [dataChatOfUserByuserId, setDataChatOfUserByuserId] = useState({});
  const [chatMsgCurrent, setChatMsgCurrent] = useState({});

  const getChatMsg = (indexPrm) => {
    setShowIconFetchMsg(true);
    const firstname = dataChatOfUserByuserId.firstname;
    const lastname = dataChatOfUserByuserId.lastname
    const fullName = `${firstname}`;
    setFullnameUserChat(fullName);
    fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/chat/getMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        chatId: chatId
      })
    }).then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    }).then((res) => {
      setShowIconFetchMsg(false);
      setShowChatHeader(true);
      // setTimeout(() => {
      //   setShowIconFetchMsg(false);
      //   setChatMsg(res?.filter((msg) => msg?.isBlock === false));
      // } , 1000);
      setChatMsg(res?.filter((msg) => msg?.isBlock === false));
      setShowChatBody(true);
      setCreateChatStatus(true);
      handleChatIdToCreateChatMsg(chatId, isBlock);
    });

    setSelectedChat(indexPrm);
  }

  useEffect(() => {
    setDataChatOfUserByuserId(userInfo.find((e) => e._id === chatOfUserId));
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/chat/getLastMessageByChatId`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        chatId: chatId
      })
    }).then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    }).then((res) => {
      setChatMsgCurrent(
        res?.isBlock
          ?
          {
            _id: res?._id,
            chatId: res?.chatId,
            chatImages: [],
            chatMsg: "messages has block!",
            createdAt: res?.createdAt,
            senderId: res?.senderId,
            updatedAt: res?.updatedAt,
          }
          :
          res
      );
    });
  }, [chatMsg]);

  useEffect(() => {
    socket.current?.on('createChatMsg', () => {
      fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/chat/getLastMessageByChatId`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          chatId: chatId
        })
      }).then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      }).then((res) => {
        setChatMsgCurrent(
          res?.isBlock
            ?
            {
              _id: res?._id,
              chatId: res?.chatId,
              chatImages: [],
              chatMsg: "messages has block!",
              createdAt: res?.createdAt,
              senderId: res?.senderId,
              updatedAt: res?.updatedAt,
            }
            :
            res
        );
      });
    });
  }, [chatMsg]);

  return (
    <div onClick={() => getChatMsg(index)} className={`container-user-chat-list-profile ${selectedChat === index ? 'active-bg' : ''}`}>
      <div className='container-profile-img-in-container-user-chat-list-profile'>
        <img src={`${process.env.REACT_APP_PROFILE_IMG_S3}/${!dataChatOfUserByuserId.profilePicture ? 'profileImgDefault.jpg' : dataChatOfUserByuserId.profilePicture}`} alt='userProfileImg' />
        <div className='active-user-status-in-container-profile-img-in-container-user-chat-list-profile active'></div>
        {dataChatOfUserByuserId.active === true
          ?
          <div className='active-user-status-in-container-profile-img-in-container-user-chat-list-profile active'></div>
          :
          <div className='active-user-status-in-container-profile-img-in-container-user-chat-list-profile'></div>
        }
      </div>
      <div className='container-profile-fullname-in-container-user-chat-list-profile'>
        <p>{dataChatOfUserByuserId.firstname} {dataChatOfUserByuserId.lastname}</p>
        {chatMsgCurrent !== null && chatMsgCurrent !== undefined &&
          Object.keys(chatMsgCurrent)?.length !== 0 &&
          <span>{
            chatMsgCurrent?.chatImages?.length !== 0 && chatMsgCurrent?.senderId === userDataInActiveId ? `You: send ${chatMsgCurrent?.chatImages?.length} ${chatMsgCurrent?.chatImages?.length > 1 ? 'images' : 'image'}`
              : chatMsgCurrent?.chatImages?.length !== 0 && chatMsgCurrent?.senderId !== userDataInActiveId ? `Send ${chatMsgCurrent?.chatImages?.length} ${chatMsgCurrent?.chatImages?.length > 1 ? 'images' : 'image'}`
                : chatMsgCurrent?.senderId === userDataInActiveId && chatMsgCurrent?.chatMsg?.length < 20 ? `You: ${chatMsgCurrent?.chatMsg}`
                  : chatMsgCurrent?.senderId === userDataInActiveId && chatMsgCurrent?.chatMsg?.length > 20 ? `You: ${chatMsgCurrent?.chatMsg?.slice(0, 20)}...`
                    : `${chatMsgCurrent?.senderId !== userDataInActiveId && chatMsgCurrent?.chatMsg?.length < 20 ? 'Send: ' + chatMsgCurrent?.chatMsg : 'Send: ' + chatMsgCurrent?.chatMsg?.slice(0, 20) + '...'}`
          }
          </span>
        }
      </div>
      <div className='last-message-time'>
        <p>{chatMsgCurrent?.createdAt !== undefined && format(new Date(chatMsgCurrent?.createdAt), "HH:mm a")}</p>
      </div>
    </div>
  );
}

export default ChatUserList;
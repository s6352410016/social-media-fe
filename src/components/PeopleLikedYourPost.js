import React, { useEffect, useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { RotatingLines } from 'react-loader-spinner';
import { SocketIOContext } from './SocketContext';

const PeopleLikedYourPost = ({ showProfilePageStatus, setShowProfilePageStatus, followAndUnFollow, setFollowAndUnFollow, userDataInActive, UserIdToLikeInPost, userInfo }) => {
    const { socket } = useContext(SocketIOContext);

    const [loadingEffectFollow, setLoadingEffectFollow] = useState(false);
    const [dataOfUserToLikeInPostByUserId, setDataOfUserToLikeInPostByUserId] = useState({});
    const [dataUserInActive, setDataUserInActive] = useState({});

    const delayChangeIconFollower = () => {
        setLoadingEffectFollow(true);
        fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/user/followAndUnFollow`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                activeUserId: userDataInActive,
                userIdToFollow: UserIdToLikeInPost
            })
        }).then((res) => {
            if (res.status === 200) {
                setLoadingEffectFollow(false);
                setFollowAndUnFollow(!followAndUnFollow);
                socket.current?.emit('created');
            }
        });
    }

    useEffect(() => {
        if (UserIdToLikeInPost) {
            setDataOfUserToLikeInPostByUserId(userInfo.find((e) => e?._id === UserIdToLikeInPost));
        }
        if (userDataInActive) {
            setDataUserInActive(userInfo.find((e) => e?._id === userDataInActive));
        }
    }, [userInfo]);

    return (
        <div className='container-profile-card-in-people-likes-post-list'>
            <Link onClick={() => setShowProfilePageStatus(!showProfilePageStatus)} to={`/profile/${UserIdToLikeInPost}`} className='container-img-in-center-in-people-likes-post-list'>
                <img src={`${process.env.REACT_APP_PROFILE_IMG_S3}/${!dataOfUserToLikeInPostByUserId.profilePicture ? 'profileImgDefault.jpg' : dataOfUserToLikeInPostByUserId.profilePicture}`} alt='imgProfile' />
            </Link>
            <Link onClick={() => setShowProfilePageStatus(!showProfilePageStatus)} to={`/profile/${UserIdToLikeInPost}`} className='container-fullname-in-center-in-people-likes-post-list'>
                <b>{dataOfUserToLikeInPostByUserId.firstname} {dataOfUserToLikeInPostByUserId.lastname}</b>
            </Link>
            {dataUserInActive !== undefined &&
                dataUserInActive?._id === UserIdToLikeInPost
                ?
                <></>
                :
                <div className='container-follow-icon-in-center-in-people-likes-post-list'>
                    <button onClick={delayChangeIconFollower}>
                        {loadingEffectFollow
                            ?
                            <RotatingLines strokeColor="#B9B9B9" strokeWidth="5" animationDuration=".8" width="80%" visible={true} />
                            :
                            <FontAwesomeIcon className='icon-fa-user-in-container-follow-icon-in-center-in-people-likes-post-list' icon={dataUserInActive?.following !== undefined && dataUserInActive?.following?.includes(UserIdToLikeInPost) ? faUserCheck : faUserPlus} />
                        }
                    </button>
                </div>
            }
        </div>
    );
}

export default PeopleLikedYourPost;
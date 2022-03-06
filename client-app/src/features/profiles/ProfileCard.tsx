import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Icon, Image } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import FollowButton from './FollowButton';

interface Props {
    profile: Profile
}

export default function ProfileCard ({profile} : Props) {
    return (
        <Card as={Link} to={`/profiles/${profile.username}`}>
            <Image src={profile.image || `/assets/user.png/`}/>
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Header>Bio</Card.Header>
            </Card.Content>
            <Card.Content extra>
                <Icon name='user'/>
                {profile.followersCount} followers
            </Card.Content>
            <FollowButton profile={profile}/>
        </Card>
    )
}
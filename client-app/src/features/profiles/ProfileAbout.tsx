import React, { useState } from 'react';
import { Button, Grid, Header, Tab } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/stores/store';
import ProfileEditForm from './ProfileEditForm';

export default observer (function ProfileAbout () {

    const [editMode, setEditMode] = useState(false);
    const {profileStore} = useStore();    
    const {isCurrentUser, profile} = profileStore;

    function truncate(bio: string | undefined) {
        if (bio) {
            return bio !== undefined && bio!.length > 400 ? bio.substring(0,397) + "..." : bio;
        }
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width='16'>
                    <Header icon='user' as='h3' content={'About '+ profile?.displayName} floated='left' />
                        <Button 
                            disabled={!isCurrentUser}
                            floated='right'
                            basic
                            onClick={() => setEditMode(!editMode)}
                            content={ !editMode ? 'Edit Profile' : 'Cancel'} />
                </Grid.Column>
                <Grid.Column width='16'>
                    { !editMode 
                        ? <span style={{wordBreak:'break-word', whiteSpace:'pre-wrap'}}>{truncate(profile?.bio)}</span>
                        : <ProfileEditForm setEditMode={setEditMode} />
                    }
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})
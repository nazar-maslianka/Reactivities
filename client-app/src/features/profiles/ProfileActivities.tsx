import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Tab, Image, Grid, Header, TabProps } from 'semantic-ui-react';
import { UserActivity } from '../../app/models/profile';
import { useStore } from '../../app/stores/store';

const panes = [
    { menuItem: 'Future activities', pane: {key: 'future'}},
    { menuItem: 'Past activities', pane: {key: 'past'}},
    { menuItem: 'Activities the user is hosting', pane: {key: 'hosting'}},
]

export default observer (function ProfileActivities() {
    const {profileStore} = useStore();
    const {loadUserActivities, profile, userActivities, loadingActivities} = profileStore;
    
    useEffect(() => 
    {
        loadUserActivities(profile!.username, 'future');
    }, [loadUserActivities, profile]);

    const handleTabChange = (e: SyntheticEvent, data: TabProps) => {
        loadUserActivities(profile!.username, panes[data.activeIndex as number].pane.key);
    }

    return (
        <Tab.Pane loading={loadingActivities}>
            <Grid>
                <Grid.Column width={16}>
                    <Header icon='calendar' content='Activities' floated='left'/>
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab
                        menu={{secondary: true, pointing: true}}
                        panes={panes}
                        onTabChange={(e, data) => handleTabChange(e, data)}
                    />
                    <br />
                    <Card.Group itemsPerRow={4}> {userActivities.map((userActivity: UserActivity) => (
                            <Card 
                                key={userActivity.id} 
                                as={Link} 
                                to={`/activities/${userActivity.id}`}>
                            <Image 
                                src={`/assets/categoryImages/${userActivity.category}.jpg`} 
                                style={{minHeight: 100, objectFit: 'cover'}}/>
                            <Card.Content>
                                <Card.Header>{userActivity.title}</Card.Header>
                                <Card.Meta>
                                    <div> {format(new Date(userActivity.date), 'do LLL')} </div>
                                    <div> {format(new Date(userActivity.date), 'h:mm aa')} </div>
                                </Card.Meta>
                            </Card.Content>
                            </Card>
                        ))}
                        </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})
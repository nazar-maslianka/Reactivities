import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Button, Header, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import { Link, useHistory } from 'react-router-dom';
import { Formik,  Form } from 'formik';
import * as Yup from 'yup';
import ReusableTextInput from '../../../app/common/form/ReusableTextInput';
import ReusableTextArea from '../../../app/common/form/ReusableTextArea';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import ReusableSelectInput from '../../../app/common/form/ReusableSelectInput';
import ReusableDateInput from '../../../app/common/form/ReusableDateInput';
import { Activity } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';

export default observer (function ActivityForm() {
    const history = useHistory();
    const {activityStore} = useStore();
    const {loading, loadingInitial, loadActivity, createActivity, updateActivity } = activityStore;
    const {id} = useParams<{id: string}>();

    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        description: '',
        category: '',
        date: null,
        city: '',
        venue: ''
    });

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),
        description: Yup.string().required('The description title is required'),
        category: Yup.string().required(),
        date: Yup.string().required('Date is required').nullable(),
        city: Yup.string().required(),
        venue: Yup.string().required()
    });

    useEffect(() =>{
        if(id) loadActivity(id).then(activity => setActivity(activity!));
    }, [id, loadActivity])

    function handleFormSubmit(activity: Activity) {
        if (activity.id.length === 0) {
            let newActivty = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivty).then(() => history.push(`/activities/${newActivty.id}`));
        } else {
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`))
        }
    }

    if (loadingInitial) return <LoadingComponent content='Loading activity...' />;

    return(
        <Segment clearing>
            <Header content='Activity Details' sub color='teal'/>
            <Formik 
                enableReinitialize 
                initialValues={activity}
                validationSchema={validationSchema}
                onSubmit={values => handleFormSubmit(values)}>
                {({handleSubmit, isValid, isSubmitting, dirty}) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <ReusableTextInput name='title' placeholder='Title'/>
                        <ReusableTextArea rows={3} placeholder='Description' name='description' />
                        <ReusableSelectInput options={categoryOptions} placeholder='Category' name='category' />
                        <ReusableDateInput
                            placeholderText='Date'
                            name='date'
                            showTimeSelect
                            timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa'
                        />
                        <Header content='Location Details' sub color='teal'/>
                        <ReusableTextInput placeholder='City' name='city' />
                        <ReusableTextInput placeholder='Venue' name='venue' />
                        <Button 
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={loading} floated='right' 
                            positive type='submit' content='Submit' />
                        <Button as={Link} to='/activities' floated='right' type='button' content='Cancel' />
                    </Form>
                )}
            </Formik>
        </Segment>
    )
})
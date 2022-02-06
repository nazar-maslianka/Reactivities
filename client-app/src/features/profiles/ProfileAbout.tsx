import { Formik } from 'formik';
import React from 'react';
import { observer } from 'mobx-react-lite';
import { Form, Button } from 'semantic-ui-react';
import ReusableTextArea from '../../app/common/form/ReusableTextArea';
import ReusableTextInput from '../../app/common/form/ReusableTextInput';
import { useStore } from '../../app/stores/store';


export default observer(function ProfileAbout () {
    const {userStore} = useStore();
    return (
        <Formik 
        initialValues={{email: '', password: '', error: null}}
        onSubmit={(values, {setErrors}) => userStore.login(values).catch(error => 
            setErrors({error: 'Invalid name'}))}
        >
            <Form> 
                <Button content='Cancel' floated='right' basic/>
                <ReusableTextInput placeholder='Name' name='name'/>
                <ReusableTextArea placeholder='bio' name='bio' rows={12} />
                <Button positive content='Update profile' type='submit' floated='right'/>
            </Form>
        </Formik>
    )
})
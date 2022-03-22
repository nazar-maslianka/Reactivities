import { Form, Formik } from 'formik';
import React from 'react';
import { Button } from 'semantic-ui-react';
import ReusableTextArea from '../../app/common/form/ReusableTextArea';
import ReusableTextInput from '../../app/common/form/ReusableTextInput';
import { useStore } from '../../app/stores/store';
import * as Yup from 'yup';
import { Profile } from '../../app/models/profile';
import { observer } from 'mobx-react-lite';

interface Props {
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>
}

export default observer (function ProfileEdit({setEditMode} : Props) {
    const {profileStore: {profile, updateProfile}} = useStore();
    
    const validationSchema = Yup.object({
        displayName: Yup.string().required('Display name is required'),
    });

    async function handleFormSubmit(profile: Profile) {
        const partialProfile : Partial<Profile> = {
            displayName: profile.displayName,
            bio: profile.bio
        }
        await updateProfile(partialProfile);
        setEditMode(false);
    }

    return (
        <>
            <Formik 
                enableReinitialize 
                initialValues={profile!}
                validationSchema={validationSchema}
                onSubmit={values => handleFormSubmit(values)}>
                {({handleSubmit, isValid, isSubmitting, dirty}) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <ReusableTextInput name='displayName' placeholder='Add your display name'/>
                        <ReusableTextArea rows={12} placeholder='Add your bio' name='bio' />
                        <Button 
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={isSubmitting} floated='right'
                            positive type='submit' content='Update profile' />
                    </Form>
                )}
            </Formik>
        </>
    )
})
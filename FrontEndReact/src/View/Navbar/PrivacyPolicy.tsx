import React, { Component } from 'react';
import { Box, Typography, ListItem } from '@mui/material';

/**
 * Creates an instance of the PrivacyPolicy component.
 */

interface PrivacyPolicyProps {
    navbar?: any;
}

class PrivacyPolicy extends Component<PrivacyPolicyProps> {

    render() {

        return (
            <>
            <Box className="content-spacing">
            <Typography sx={{fontWeight:'700', justifyContent:"center"}} variant="h4" aria-label="Privacy">SkillBuilder Privacy Policy</Typography>
            <Typography variant="h6"> Last Updated: January 13, 2025</Typography>
            </Box>

            <Box>
                <Box display="flex" alignItems="center" mb={2}>
                    <Box  sx={{ justifyContent:"center" }} className="card-spacing">
                    <Box className="form-position">
                        <Box className="card-style" sx={{ width: '80%' }}>
                            <Box className="form-spacing">
                                <Typography variant="h5" aria-label='PrivacyPolicyTitle'>
                                    Introduction
                                </Typography>

                                <Typography variant="body1" sx={{ marginTop:"30px" }}>
                                This Privacy Policy describes how we collect, use, and protect your personal information when you use our web application. We are committed to ensuring the privacy and security of your personal data.
                                </Typography> 
                                <Typography variant="h5" sx={{ marginTop:"30px" }}>
                                Information We Collect
                                </Typography> 
                                <Typography variant="body1" sx={{ marginTop:"30px" }}>
                                    We collect the following personal information when you use our service:
                                        <ListItem sx={{display: 'list-item'}}>Full name</ListItem>
                                        <ListItem sx={{display: 'list-item'}}>Email address</ListItem>
                                </Typography>
                                <Typography variant="h5" sx={{ marginTop:"30px" }}>
                                    How We Collect Information
                                    </Typography>
                                <Typography variant="body1" sx={{ marginTop:"30px" }}>
                                    We collect this information when you:
                                    <ListItem sx={{display: 'list-item'}}>Are added as a new user in the system</ListItem>
                                </Typography>
                                <Typography variant="h5" sx={{ marginTop:"30px" }}>
                                    How We Use Your Information
                                </Typography>
                                <Typography variant="body1" sx={{ marginTop:"30px" }}>
                                        Your personal information is used solely for:
                                        <ListItem sx={{display: 'list-item'}}>Providing and maintaining our services</ListItem>
                                        <ListItem sx={{display: 'list-item'}}>Communicating with you about your account</ListItem>
                                        <ListItem sx={{display: 'list-item'}}>Sending important service-related notifications</ListItem>
                                        <ListItem sx={{display: 'list-item'}}>Responding to your inquiries and support requests</ListItem>
                                </Typography>
                                <Typography variant="h5" sx={{ marginTop:"30px" }}>
                                    Data Security
                                </Typography>
                                <Typography variant="body1" sx={{ marginTop:"30px" }}>
                                    We implement industry-standard security measures to protect your personal information:
                                    <ListItem sx={{display: 'list-item'}}>All data transmission is encrypted using SSL (Secure Sockets Layer) technology</ListItem>
                                    <ListItem sx={{display: 'list-item'}}>Access to personal information is restricted to authorized personnel only</ListItem>
                                    <ListItem sx={{display: 'list-item'}}>Regular security assessments and updates are performed to maintain data protection</ListItem>
                                </Typography>
                                <Typography variant="h5" sx={{ marginTop:"30px" }}>
                                    Data Retention
                                </Typography>
                                <Typography variant="body1" sx={{ marginTop:"30px" }}>
                                    We retain your personal information only for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. When we no longer need your data, it will be securely deleted.
                                </Typography>
                                <Typography variant="h5" sx={{ marginTop:"30px" }}>
                                    Your Rights
                                </Typography>
                                <Typography variant="body1" sx={{ marginTop:"30px" }}>
                                    You have the right to:
                                    <ListItem sx={{display: 'list-item'}}>Access your personal information</ListItem>
                                    <ListItem sx={{display: 'list-item'}}>Request corrections to your data</ListItem>
                                    <ListItem sx={{display: 'list-item'}}>Request deletion of your data</ListItem>
                                    <ListItem sx={{display: 'list-item'}}>Withdraw consent for data processing</ListItem>
                                </Typography>
                                <Typography variant="h5" sx={{ marginTop:"30px" }}>
                                    Third-Party Sharing
                                </Typography>
                                <Typography variant="body1" sx={{ marginTop:"30px" }}>
                                    We do not sell, trade, or otherwise transfer your personal information to external parties. Your data is used exclusively for operating our service.
                                </Typography>
                                <Typography variant="h5" sx={{ marginTop:"30px" }}>
                                    Changes to This Policy
                                </Typography>
                                <Typography variant="body1" sx={{ marginTop:"30px" }}>
                                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                                    </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                </Box>
            </Box>


            </>
        )


    }
}
export default PrivacyPolicy;
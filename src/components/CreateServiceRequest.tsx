import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { submitServiceRequest } from '../api/api';

const CreateServiceRequest: React.FC = () => {
  // ... existing state variables

  const handleSubmit = async () => {
    if (requestDetails) {
      try {
        const response = await submitServiceRequest({
          user_id: 1, // Replace with actual user ID from authentication
          ...requestDetails,
          status: 'open',
        });
        console.log('Service request submitted:', response.data);
        navigate('/buyer-dashboard');
      } catch (error) {
        console.error('Error submitting service request:', error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  // ... rest of the component remains the same
};

export default CreateServiceRequest;
import React from 'react';
import { ToastContainer as ToastifyContainer, toast } from 'react-toastify';
import styled from '@emotion/styled';

const StyledToastContainer = styled(ToastifyContainer)`
  text-align: center;

  > div {
    padding-left: 12px;
    padding-right: 12px;

    a {
      color: white;
      text-decoration: underline;
    }
  }
`;

const ToastContainer = (props) => (
  <StyledToastContainer
    autoClose={5000}
    closeOnClick
    hideProgressBar

    pauseOnHover
    position={toast.POSITION.TOP_CENTER}
    {...props}
  />
);

export default ToastContainer;

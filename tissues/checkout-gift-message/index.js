import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Field } from 'formik';

import Typography from '../../atoms/typography';
import Textarea from '../../molecules/textarea-field';
import EmailInput from '../../atoms/input-email';

const GiftMessage = styled(Textarea)`
    margin-bottom: 1.5rem;

  > label {
    color: ${({ theme }) => theme.color.brand};
    letter-spacing: 0.2em;
    line-height: 2rem;
    margin: 1rem 0;
    text-transform: uppercase;
  }
`;

const GiftMessageEmailLabel = styled.label`
  opacity: 0;
  pointer-events: none;
  position: absolute;
`;

const GiftNote = styled(Typography)`
  color: ${({ theme }) => theme.color.brand};
  font-style: italic;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const Note = styled(Typography)`
  color: ${({ theme }) => theme.color.brand};
  margin-top: 1rem;
`;

const CheckoutGiftMessage = (props) => (
  <div data-test-id="gift-message-area" className={props.className}>
    <GiftMessage
      data-test-id="gift-message-text"
      id="gift-message"
      label="Gift Message"
      name="gift_message"
      placeholder="Message to gift recipient (optional)"
    />

    <GiftNote data-test-id="gift-email-cta" element="p" like="dec-1">
      Keep them in the loop! Enter your recipient&apos;s email address below,
      and we&apos;ll let them know something adorable is on its way!
    </GiftNote>

    <GiftMessageEmailLabel htmlFor="gift-message-email">Gift Message Email Label</GiftMessageEmailLabel>
    <Field
      data-test-id="gift-email"
      as={EmailInput}
      id="gift-message-email"
      name="gift_email"
      placeholder="Recipient Email (optional)"
    />

    <Note data-test-id="gift-email-note" element="p" like="label-1">* all shipments will be shipped with gift receipts</Note>
  </div>
);

CheckoutGiftMessage.defaultProps = {
  className: ''
};

CheckoutGiftMessage.propTypes = {
  className: PropTypes.string
};

export default memo(CheckoutGiftMessage);

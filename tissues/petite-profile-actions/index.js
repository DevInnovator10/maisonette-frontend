import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Button from '../../atoms/button';

import Typography from '../../atoms/typography';

const ActionWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr max-content;
  min-height: 5rem;
  border-bottom: 1px solid ${(props) => props.theme.color.brand};

  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    align-items: center;
  }
`;

const ActionLegend = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  line-height: 4rem;
  grid-column: 1 / span 2;

  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    grid-column: 1;
  }
`;

const ActionButtonWrapper = styled.div`
  grid-column: 3;
`;

const ActionButtonAltText = styled(Typography)`
  color: ${(props) => props.theme.color.brandError};
  line-height: 3rem;
  grid-row: 2;
  grid-column: 1 / span 3;

  @media (min-width: ${(props) => props.theme.breakpoint.small}) {
    line-height: 4.7rem;
    justify-self: end;
    grid-row: 1;
    grid-column: 2;
  }
`;

const ActionButton = styled(Button)`
  border: 0;
  margin-left: 2rem;
  outline: 0;
  padding: 0;
  text-decoration: underline;
`;

export const PetiteProfileActions = (props) => (
  <ActionWrapper>
    <ActionLegend element="legend" like="heading-6">
      { props.mini?.name && props?.mini?.name !== '' ? props?.mini?.name : 'Add Petite Profile' }
    </ActionLegend>
    {
        // eslint-disable-next-line no-nested-ternary
        props.isEditing && props.mini
          ? (
            <>
              <ActionButtonAltText element="p" like="label-1">
                Press save below to record edits
              </ActionButtonAltText>
              {!props.firstMini ? (
                <ActionButtonWrapper>
                  <ActionButton
                    isText
                    onClick={() => {
                      if (props.mini.id === 0) props.remove(0);
                      props.handleCancelAction('Editing', props.mini.id);
                      props.resetForm(props.indexId);
                    }}
                  >
                Cancel
                  </ActionButton>
                </ActionButtonWrapper>
              ) : null}
            </>
          ) : (
            props.isDeleting && props.mini
              ? (
                <>
                  <ActionButtonAltText element="p" like="label-1">
                    Are you sure you want to delete
                    {' '}
                    {props.mini.name}
                    ?
                  </ActionButtonAltText>
                  <ActionButtonWrapper>
                    <ActionButton
                      isText
                      onClick={() => {
                        props.remove(props.indexId);
                        props.handleOnDelete(props.mini.id);
                      }}
                    >
                    Delete
                    </ActionButton>
                    <ActionButton
                      isText
                      onClick={() => props.handleCancelAction('Deleting', props.mini.id)}
                    >
                    Cancel
                    </ActionButton>
                  </ActionButtonWrapper>
                </>
              )
              : (
                <ActionButtonWrapper>
                  {
                    props.mini
                      && (
                      <ActionButton
                        isText
                        onClick={() => props.handleSetAction('Editing', props.mini.id)}
                      >
                        Edit
                      </ActionButton>
                      )
                  }
                  <ActionButton
                    isText
                    onClick={() => props.handleSetAction('Deleting', props.mini.id)}
                  >
                    Delete
                  </ActionButton>

                </ActionButtonWrapper>
              )
          )
      }
  </ActionWrapper>
);
PetiteProfileActions.defaultProps = {
  mini: false,
  firstMini: false,
  isEditing: false,
  isDeleting: false,
  handleSetAction: () => {},
  handleCancelAction: () => {},
  handleOnDelete: () => {},
  remove: () => {},
  resetForm: () => {},
  indexId: 0
};

PetiteProfileActions.propTypes = {
  mini: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  firstMini: PropTypes.bool,
  isEditing: PropTypes.bool,
  isDeleting: PropTypes.bool,
  handleSetAction: PropTypes.func,
  handleCancelAction: PropTypes.func,
  handleOnDelete: PropTypes.func,
  remove: PropTypes.func,
  resetForm: PropTypes.func,
  indexId: PropTypes.number
};

export default memo(PetiteProfileActions);

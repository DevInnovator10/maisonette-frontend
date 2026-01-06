import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import PetiteInput from '../../molecules/petite-profile-field';
import PetiteSelect from '../../molecules/petite-profile-select';

const Petite = styled.ul`
  padding: 1rem 0;

  ${(props) => (props.isEditing ? css`
    border-bottom: 1px solid ${props.theme.color.brandLight};
    padding: 1rem 0 2rem;
    margin-bottom: 2rem;
  ` : '')}

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    display: grid;
    grid-gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  }
`;

const Input = styled(PetiteInput)`
  outline: 0;

  ${({ disabled, theme }) => disabled && css`
    background-color: transparent;
    color: ${theme.color.brand};
    padding: 0;
  `}
`;

const PetiteProfileItem = (props) => {
  const supportsInputTypeDate = () => {
    const elem = global.document.createElement('input');
    elem.type = 'date';
    return elem.type === 'date';
  };

  const [supportsDateInput, setSupportsDateInput] = useState(true);

  useEffect(() => {
    if (!supportsInputTypeDate()) {
      setSupportsDateInput(false);
    }
  }, []);

  const miniMinBithdayDate = () => {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 16);

    return currentDate.toISOString().split('T')[0];
  };

  const miniMaxBithdayDate = () => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 10);

    return currentDate.toISOString().split('T')[0];
  };

  return (
    <Petite isEditing={props.isEditing}>
      <li>
        <Input
          disabled={!props.isEditing}
          id={`profiles.${props.indexId}.name`}
          name={`profiles.${props.indexId}.name`}
          label="NAME"
          type="text"
          placeholder="First name or nickname"
        />
      </li>

      {supportsDateInput ? (
        <li>
          <Input
            disabled={!props.isEditing}
            id={`profiles.${props.indexId}.birthdate`}
            name={`profiles.${props.indexId}.birthdate`}
            min={miniMinBithdayDate()}
            max={miniMaxBithdayDate()}
            label="BIRTHDATE"
            type="date"
            native
          />
        </li>
      ) : (
        <Input
          disabled={!props.isEditing}
          id={`profiles.${props.indexId}.birthdate`}
          name={`profiles.${props.indexId}.birthdate`}
          label="BIRTHDATE"
          type="text"
        />
      )}

      <li>
        <PetiteSelect
          disabled={!props.isEditing}
          id={`profiles.${props.indexId}.gender`}
          name={`profiles.${props.indexId}.gender`}
          label="GENDER"
          type="select"
        >
          <option value="both">Show Me Both</option>
          <option value="boy">Boy</option>
          <option value="girl">Girl</option>
        </PetiteSelect>
      </li>
    </Petite>
  );
};

PetiteProfileItem.defaultProps = {
  isEditing: false
};

PetiteProfileItem.propTypes = {
  isEditing: PropTypes.bool,
  indexId: PropTypes.number.isRequired
};

export default memo(PetiteProfileItem);

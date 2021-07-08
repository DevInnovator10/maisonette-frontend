import React, { useState } from 'react';
import AnimateHeight from 'react-animate-height';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Typography from '../../atoms/typography';
import Ruler from '../../atoms/ruler';

const Title = styled(Typography)`
  align-items: center;
  color: ${(props) => props.theme.color.brand};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 0.9rem 40px 0.5rem 0;
  position: relative;

  &:first-child {
    border-top: 1px solid ${(props) => props.theme.color.brand};
  }

  &::after {
    content: "";
    border-bottom: 5px solid ${(props) => props.theme.color.brand};
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    display: inline-block;
    height: 0;
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translate(0, -50%) rotate(0.5turn);
    transition: transform 0.5s;
    width: 0;
  }

  &.open::after {
    transform: translate(0, -50%) rotate(0turn);
  }
`;

const DescriptionDetails = styled.dd`
  border-bottom: 1px solid ${(props) => props.theme.color.brand};
  padding-bottom: 0.4rem;

`;

const HiddenContent = styled(AnimateHeight)`
  color: ${(props) => props.theme.color.brand};
  font-family: ${(props) => props.theme.font.sans};
  font-size: ${(props) => props.theme.modularScale.base};
`;

const Content = styled(Typography)`
  padding: 1.2rem 0 2.2rem;

  a {
    display: inline;
  }
`;

const Accordion = (props) => {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);

  const toggle = () => {
    setHeight(height ? 0 : 'auto');
    setOpen(!open);
  };

  return (
    <dl>
      <Title element="dt" like="dec-1" onClick={toggle} className={`${open ? 'open' : ''} accordion-title`}>
        { props.data.accordion_heading }
      </Title>
      <DescriptionDetails>
        <HiddenContent duration={350} height={height}>
          <Content element="p" like="paragraph-2" dangerouslySetInnerHTML={{ __html: props.data.accordion_content }} />
        </HiddenContent>
      </DescriptionDetails>
      { props.data?.accordion_content_hr && <Ruler /> }
    </dl>
  );
};

Accordion.propTypes = {
  data: PropTypes.object.isRequired
};

Accordion.whyDidYouRender = true;

export default Accordion;

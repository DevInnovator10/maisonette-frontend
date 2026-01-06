import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Link from '../../utils/link';
import Typography from '../../atoms/typography';
import { hedStyles } from '../../atoms/anchor';

const HeadingWrapper = styled.a`
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  text-align: center;
  text-decoration: none;
`;

const Heading = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  line-height: 1;
`;

const editHeadingStyles = css`
  padding-bottom: 0;
  border-bottom: 0;
`;

const Dec = styled.h2`
  ${hedStyles};
  margin-top: 2rem;

  ${(props) => (
    props.type === 'edit'
      ? css`
        ${editHeadingStyles}
        color: ${props.theme.color.brandLight};

        :visited {
          color: ${props.theme.color.brandLight};
        }
      `
      : css`
        :visited {
          color: ${props.theme.color.brand};
        }
      `
  )};
`;

const SectionHeading = (props) => (
  <header>
    <Link href={props.href} passHref>
      <HeadingWrapper {...props}>
        <Heading element="h1" like="heading-4">{props.title}</Heading>
        <Dec type={props.type}>{props.dec}</Dec>
      </HeadingWrapper>
    </Link>
  </header>
);

SectionHeading.defaultProps = {
  type: 'edit'
};

SectionHeading.propTypes = {
  title: PropTypes.string.isRequired,
  dec: PropTypes.string.isRequired,
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  type: PropTypes.oneOf(['edit', 'taxon'])
};

export default SectionHeading;

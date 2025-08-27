import React, {
  memo,
  useState,
  useLayoutEffect,

  useRef
} from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Typography from '../../atoms/typography';
import Button from '../../atoms/button';

const Title = styled(Typography)`
  ${(props) => props.theme.arrow(props.active ? 'up' : 'down', props.theme.color.brand, 'right calc(1.5rem - 5px) center')}
  border-bottom: 1px solid ${(props) => props.theme.color.brand};
  cursor: pointer;
  line-height: 5rem;
  position: relative;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    background: none;
    pointer-events: none;
  }
`;

const TitleButton = styled(Button)`
  border-bottom: 1px solid ${(props) => props.theme.color.brand};
  text-decoration: none;
  text-align: left;
  width: 100%;
  letter-spacing: normal;
  max-height: 5.1rem;
  cursor: default;
`;

const Body = styled.div`
  border-bottom: 1px solid ${(props) => props.theme.color.brand};
  padding: 1rem 0;
`;

const ContentWrapper = styled.div`
  margin-bottom: 3rem;
  max-height: ${(props) => (props.active ? props.contentHeight : '0')}px;
  overflow: hidden;
  position: relative;
  transition: max-height ${(props) => props.theme.animation.fast} ${(props) => props.theme.animation.easeInQuad};

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    max-height: 100%;
  }
`;

const Section = styled.section`
  color: ${(props) => props.theme.color.brand};
`;

const AccountSection = (props) => {
  const [active, setActive] = useState(false);
  const [height, setHeight] = useState(0);
  const ref = useRef();

  const handleToggle = () => setActive(!active);

  useLayoutEffect(() => {
    if (ref.current) {
      setHeight(ref.current.scrollHeight);
    }
  }, [props.body]);

  return (
    <Section className={props.className}>
      <TitleButton styledLikeLink onClick={handleToggle}>
        <Title element="h4" like="heading-5" active={active ? 'true' : undefined}>{props.title}</Title>
      </TitleButton>
      <ContentWrapper ref={ref} active={active ? 'true' : undefined} contentHeight={height}>
        <Body>
          { props.body }
        </Body>
        { props.footer }
      </ContentWrapper>
    </Section>
  );
};

AccountSection.defaultProps = {
  className: '',
  footer: null
};

AccountSection.propTypes = {
  body: PropTypes.any.isRequired,
  className: PropTypes.string,
  footer: PropTypes.any,
  title: PropTypes.string.isRequired
};

export default memo(AccountSection);

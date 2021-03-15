import styled from '@emotion/styled';

export const CarouselSmallWrapper = styled.div`
    cursor: grab;
  overflow-x: hidden;
  overflow-y: scroll;
  transform: translateY(-60px);
  overflow: auto;
  padding-bottom: 20px;
  &::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: flex;
    justify-content: center;
    max-height: 490px;
    overflow-x: initial;
    overflow-y: auto;
    padding-bottom: 0;
  
  }
  
  @media (min-width: ${(props) => props.theme.breakpoint.small}) and (max-width: 1024px) {
    padding-bottom: 0px;
  }

  @media (max-width: ${(props) => props.theme.breakpoint.small}) {
    padding-bottom: 0px;
    transform: translateY(0px);

  }
  @media (max-width: 578px) {
    margin-top: auto;
    margin-bottom: 10px;
  }
  
`;

export const CarouselSmall = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: center;
 
 @media (max-width: ${(props) => props.theme.breakpoint.small}) {
    display: flex;
  }
  
`;

export const Thumbnail = styled.li`
  opacity: ${(props) => (props.active ? 1 : 0.6)};
  transition: opacity ${(props) => props.theme.animation.default} ${(props) => props.theme.animation.easeInQuad};
  margin: 0 1rem;

  :last-of-type {
    margin-right: 0;
  }

  img {
    border: 0.1rem solid ${(props) => props.theme.color.brand};
    display: block;
    height: 4rem;
    padding: 0.5rem;
    width: 4rem;
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    margin-right: 0;
    margin-bottom: 1.5rem;

    :last-of-type {
      margin-bottom: 0;
    }
  }

  @media (max-width: 425px) {
    margin-right: 0;
    margin-bottom: 1.5rem;

    :last-of-type {
      margin-bottom: 0;
    }
  }
`;

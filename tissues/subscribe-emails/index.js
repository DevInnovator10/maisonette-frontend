import React, { useState } from 'react';
import styled from '@emotion/styled';
import Typography from '../../atoms/typography';
import Button from '../../atoms/button';
import SubscribeListInput from '../../molecules/subscribe-list-input';

const SubscribeMain = styled.section`
    background-color: ${({ theme }) => theme.color.brand};
  height: calc(90vh - 6rem);
  margin: 0 auto;
  position: relative;
  width: 100%;
  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    height: 60rem;
    width: 60rem;
    border-radius: 100%;
  }
`;

const SubscribeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: inherit;
  justify-content: center;
  left: 50%;
  position: absolute;
  text-align: center;
  transform: translateX(-50%);
  width: 100%;
  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    top: 50%;
    transform: translate(-50%, -50%);
    height: 50rem;
    width: 50rem;
  }
`;

const ImageWrapper = styled.div`
  margin: 0 auto;
  width: 50%;
  padding: 2rem 0;

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    width: 12rem;
  }
`;

const BoyImage = styled.figure`
  display: block;
  padding-top: 100%;
  position: relative;

  > img {
    bottom: 0;
    height: 100%;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
  }
`;

const SubTitle = styled(Typography)`
  color: ${({ theme }) => theme.color.white};
`;

const SubPara = styled(Typography)`
  color: ${({ theme }) => theme.color.white};
  padding: 1rem 2rem;
`;

const SubNote = styled.span`
  color: ${({ theme }) => theme.color.promoPink};
`;

const SubButton = styled(Button)`
  color: ${({ theme }) => theme.color.white};
  margin: 2rem auto;
  max-width: 20rem;
  padding: 0 2rem;
`;

const SubscribePrompt = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [errored, setErrored] = useState(false);

  const handleSubmit = (val) => {
    setSubscribed(val);
    setErrored(!val);
  };

  const customClose = () => {
    const closeButton = global.document.getElementById('close-modal');
    closeButton.click();
  };

  return (
    <SubscribeMain>
      <SubscribeWrapper>
        {errored
          ? (
            <ImageWrapper>
              <BoyImage>
                <img
                  src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/email-subscription.png`}
                  srcSet={`
                  ${process.env.NEXT_PUBLIC_ASSET_HOST}/images/email-subscription-2x.png 2x,
                  ${process.env.NEXT_PUBLIC_ASSET_HOST}/images/email-subscription-3x.png 3x
                `}
                  alt="Boy holding oversized envelope"
                />
                <SubTitle role="alert" element="h1" like="heading-4">Oops, something went wrong!</SubTitle>
              </BoyImage>
            </ImageWrapper>
          ) : (
            <>
              {subscribed
                ? (
                  <>
                    <SubTitle element="h1" like="heading-4">Thank You!</SubTitle>
                    <SubPara element="p" like="dec-2">
                      Bienvenue! You&apos;ve unlocked your code:
                      <SubNote> HELLO10</SubNote>
                    </SubPara>
                    <SubButton onClick={customClose} isText>Happy Shopping</SubButton>
                  </>
                ) : (
                  <>
                    <ImageWrapper>
                      <BoyImage>
                        <img
                          src={`${process.env.NEXT_PUBLIC_ASSET_HOST}/images/email-subscription.png`}
                          srcSet={`
                        ${process.env.NEXT_PUBLIC_ASSET_HOST}/images/email-subscription-2x.png 2x,
                        ${process.env.NEXT_PUBLIC_ASSET_HOST}/images/email-subscription-3x.png 3x
                      `}
                          alt="Boy holding oversized envelope"
                        />
                      </BoyImage>
                    </ImageWrapper>
                    <SubTitle element="h1" like="heading-4">Let&apos;s Be Email Buddies</SubTitle>
                    <SubPara element="p" like="dec-2">
                      Sign up now to get
                      {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                      <SubNote> 10% off your first order*</SubNote>,
                      curated edits, first access to sales, and content roundups from LeScoop.
                    </SubPara>
                    <SubPara element="p" like="dec-1">*When you spend $75+, Exclusions Apply</SubPara>
                    <SubscribeListInput tabIndex={0} customSubmit={handleSubmit} />
                  </>
                )}
            </>
          )}
      </SubscribeWrapper>
    </SubscribeMain>
  );
};

export default SubscribePrompt;

import { createElement, forwardRef } from 'react';
import styled from '@emotion/styled';

const typoGenerator = (props) => {
  const [base, variant] = props.like.split('-');

  // TODO: clean up these styles so each style is only using 1 font
  const typeStyles = {
    heading: {
      // these top level bases are only for font-family really.
      1: {
        'font-family': props.theme.font.heading,
        'font-size': props.theme.modularScale['4xlarge']
        // these variants are only for size really
      },
      2: {
        'font-family': props.theme.font.heading,
        'font-size': props.theme.modularScale['3xlarge']
      },
      3: {
        'font-family': props.theme.font.heading,
        'font-size': props.theme.modularScale['2xlarge']
      },
      4: {
        'font-family': props.theme.font.heading,
        'font-size': props.theme.modularScale.xlarge
      },
      5: {
        'font-family': props.theme.font.heading,
        'font-size': props.theme.modularScale.large
      },
      6: {
        'font-family': props.theme.font.heading,
        'font-size': props.theme.modularScale.medium
      },
      7: {
        'font-family': props.theme.font.heading,
        'font-size': props.theme.modularScale.thirtyTwo
      },
      8: {
        'font-family': props.theme.font.heading,
        'font-size': props.theme.modularScale.twentyFour
      },
      9: {
        'font-family': props.theme.font.heading,
        'font-size': props.theme.modularScale.fortyEight
      }
    },
    paragraph: {
      1: {
        'font-family': props.theme.font.sans,
        'font-size': props.theme.modularScale.medium
      },
      2: {
        'font-family': props.theme.font.sans,
        'font-size': props.theme.modularScale.base
      },
      3: {
        'font-family': props.theme.font.sans,
        'font-size': props.theme.modularScale.small
      },
      4: {
        'font-family': props.theme.font.sans,
        'font-size': props.theme.modularScale.small
      },
      5: {
        'font-family': props.theme.font.sans,
        'font-size': props.theme.modularScale.fourteen
      },
      6: {
        'font-family': props.theme.font.sans,
        'font-size': props.theme.modularScale.eighteen
      }
    },
    dec: {
      1: {
        'font-family': props.theme.font.sans,
        'font-size': props.theme.modularScale.small
      },
      2: {
        'font-family': props.theme.font.sans,
        'font-size': props.theme.modularScale.base
      },
      3: {
        'font-family': props.theme.font.sans,
        'font-size': props.theme.modularScale.eighteen
      },
      4: {
        'font-family': props.theme.font.sans,
        'font-size': props.theme.modularScale.sixteen
      },
      5: {
        'font-family': props.theme.font.sans,
        'font-size': props.theme.modularScale.fourteen
      },
      6: {
        'font-family': props.theme.font.sans,
        'font-size': props.theme.modularScale.twenty
      },
      7: {
        'font-family': props.theme.font.sans,
        'font-size': props.theme.modularScale.twentyFour
      }
    },
    label: {
      1: {
        'font-family': props.theme.font.caption,
        'font-size': props.theme.modularScale.small
      },
      2: {
        'font-family': props.theme.font.sans,
        'font-size': props.theme.modularScale.small
      },
      3: {
        'font-family': props.theme.font.sans,
        'font-size': props.theme.modularScale.eighteen
      },
      4: {
        'font-family': props.theme.font.caption,
        'font-size': props.theme.modularScale.fourteen
      },
      5: {
        'font-family': props.theme.font.caption,
        'font-size': props.theme.modularScale.twenty
      },
      6: {
        'font-family': props.theme.font.caption,
        'font-size': props.theme.modularScale.sixteen
      },
      7: {
        'font-family': props.theme.font.sans,
        'font-size': props.theme.modularScale.fourteen
      }
    }
  };
  const stringifiedClasses = Object.entries(typeStyles[base][variant])
    .reduce((acc, curr) => `${acc}${curr.map((property) => `${property}`).join(':')};`, '');
  return stringifiedClasses;
};

const hasHTML = (element, dangerouslySetInnerHTML) => {
  if (!dangerouslySetInnerHTML) return element;
  const [html] = Object.values(dangerouslySetInnerHTML);
  if (!/<[a-z][\s\S]*>/.test(html)) return element;
  return 'div';
};

const Typography = styled(
  forwardRef(({
    element, image, flair, ...props
  }, ref) => {
    const { like, ...rest } = props;
    const elem = hasHTML(element, props.dangerouslySetInnerHTML);
    return createElement(elem, { ...rest, ref });
  })
)`${(props) => typoGenerator(props)}`;

Typography.whyDidYouRender = true;

export default Typography;

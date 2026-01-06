import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Ruler from '../../atoms/ruler';

import ColorStoryCellProduct from '../color-story-cell-product';
import ColorStoryCellText from '../color-story-cell-text';
import ColorStoryCellImage from '../color-story-cell-image';

const Wrapper = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  > div:first-of-type div {
    padding-top: 0;
  }

  > div:last-of-type div {
    padding-bottom: 0;
  }
`;

const ColorStoryRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;

  > div {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.small}) {
    flex-direction: row;
  }
`;

const ColorStory = (props) => {
  const [rows, setRows] = useState([]);

  const cellTypes = {
    Product: ColorStoryCellProduct,
    Text: ColorStoryCellText,
    Image: ColorStoryCellImage
  };

  useEffect(() => {
    const row1 = [];
    const row2 = [];
    const row3 = [];

    Object.entries(props.data.color_story_cell).forEach((cell) => {
      const position = cell[0];
      const cellData = cell[1];
      if (position >= 0 && position <= 2) row1.push(cellData);
      if (position >= 3 && position <= 5) row2.push(cellData);
      if (position >= 6 && position <= 8) row3.push(cellData);

    });
    setRows([row1, row2, row3]);
  }, []);

  let productIndex = 0;

  return (
    <Wrapper>
      {
        rows.length > 0 && rows.map((row, index) => (
          row.length > 0 && (
            // eslint-disable-next-line react/no-array-index-key
            <ColorStoryRow key={`color-story-row-${index}`}>
              {
                row.map((cell, cellIndex) => {
                  const TagName = cellTypes[cell.type];
                  if (cell.type === 'Product') productIndex += 1;
                  // eslint-disable-next-line react/no-array-index-key
                  return <TagName key={`color-story-cell-${cellIndex}`} data={{ ...cell, index: productIndex }} />;
                })
              }
            </ColorStoryRow>
          )))
      }
      { props.data?.color_story_hr && <Ruler /> }
    </Wrapper>
  );
};

ColorStory.propTypes = {
  data: PropTypes.object.isRequired
};

ColorStory.whyDidYouRender = true;

export default ColorStory;

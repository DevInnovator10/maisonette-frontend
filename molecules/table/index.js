import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import Typography from '../../atoms/typography';

const TableWrapper = styled.table`
  border-top: 1px solid ${(props) => props.theme.color.brand};
  display: table;
  width: 100%;
  position: relative;

  tbody tr:first-of-type td {
    padding-top: 2rem;
  }

  ${(props) => props.media.map((rule) => {
    // get location of columns to hide
    const columns = rule.columns.map((name) => props.columns.map((e) => e.name).indexOf(name) + 1);

    return columns.map((i) => css`
      @media screen and (max-width: ${rule.breakpoint}) {
        td, th {
          display: none;

          &:nth-of-type(${i}) {
            display: table-cell;
          }
        }
      }
    `);
  })}
`;

const TableHead = styled(Typography)`
  color: ${(props) => props.theme.color.brand};
  border-bottom: 1px solid ${(props) => props.theme.color.brand};
  letter-spacing: 0.24rem;
  text-align: left;
  text-transform: uppercase;
  padding: 1.5rem 0;

  &:not(:last-child) {
    padding-right: 1rem;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    padding-right: 0;
  }
`;

const TableData = styled(Typography)`
  color: ${(props) => props.theme.color.brandLight};
  padding: 1rem 0;
  line-height: 1.3;
  text-align: left;

  &:not(:last-child) {
    padding-right: 1rem;
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    padding-right: 0;
  }
`;

const Loading = styled.div`
  min-height: 8rem;
  position: relative;
  ${(props) => props.theme.loader()}
`;

const Table = (props) => {
  if (props.loading) return <Loading />;

  return (
    <TableWrapper className={props.className} columns={props.columns} media={props.media}>
      <thead>
        <tr>
          {
            props.columns.map((column) => (
              <TableHead element="th" like="label-1" key={column.accessor}>
                {column.name}
              </TableHead>
            ))
          }
        </tr>
      </thead>
      <tbody>
        {
          props.tableData.map((row, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <tr key={`row-${i}`}>
              {
                props.columns.map((column, j) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <TableData element="td" like="dec-1" key={`column-${i}-${j}`}>
                    {
                      column.cell
                        ? React.createElement(column.cell, { ...row })
                        : row[column.accessor]
                    }
                  </TableData>
                ))
              }
            </tr>
          ))
        }
      </tbody>
    </TableWrapper>
  );
};

Table.defaultProps = {
  className: '',
  media: [],
  loading: false
};

Table.propTypes = {
  className: PropTypes.string,
  columns: PropTypes.array.isRequired,
  tableData: PropTypes.array.isRequired,
  media: PropTypes.array,
  loading: PropTypes.bool
};

Table.whyDidYouRender = true;

export default Table;

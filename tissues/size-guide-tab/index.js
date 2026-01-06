import React, {
  memo,
  useState,
  useEffect
} from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import jsonData from '../../organs/size-guide/data.json';
import Table from '../../molecules/table';
import Typography from '../../atoms/typography';
import Select from '../../atoms/select';

// TODO: I don't believe this needs to pass 'active' to the button, but
// I'm leaving it to keep parity with the existing implementation / tests.
const NavTab = styled(Typography)`
  align-items: center;
  color: ${({ theme }) => theme.color.brand};
  cursor: pointer;
  display: flex;
  height: 5em;
  line-height: 1.5;
  margin: 0 0.7rem;
  padding: 0 0.5rem;
  text-align: center;
  background: transparent;
  border: none;
  letter-spacing: 0.05rem;
  transition: color ${({ theme }) => theme.animation.fast} ${({ theme }) => theme.animation.easeInQuad};

  && {
    font-size: 1.1rem;
  }

  :first-of-type {
    margin-left: 0;
  }

  :last-of-type {
    margin-right: 0;
  }

  :hover {
    color: ${({ theme }) => theme.color.brandLight};
  }

  ${({ active, theme }) => active && css`
    ${theme.arrow('up', theme.color.brandLight, 'bottom -1px center')}
    color: ${theme.color.brandLight};

    :hover {
      color: ${theme.color.brandLight};
    }
  `}
`;

const SizeTableWrapper = styled.div`
  overflow: auto;
`;

const SizeTable = styled(Table)`
  border-top: none;

  td {
    color: ${({ theme }) => theme.color.brand};
  }

  tr {
    border-bottom: 1px solid ${({ theme }) => theme.color.brandLight};
  }
`;

const Navigation = styled.nav`
  border-bottom: 1px solid ${({ theme }) => theme.color.brandLight};
  justify-content: center;
  margin-bottom: 5rem;
  display: none;

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: flex;
  }
`;

const MobileNavigation = styled(Select)`
  border: 0;
  display: block;
  margin: 3rem auto;
  max-width: 20rem;
  outline: 0;

  & ~ ${SizeTable} {
    border-top: 1px solid ${({ theme }) => theme.color.brand};
  }

  @media (min-width: ${(props) => props.theme.breakpoint.medium}) {
    display: none;

    & ~ ${SizeTable} {
      border-top: none;
    }
  }
`;

const SizeGuideTab = (props) => {
  const [activeNav, setActiveNav] = useState(props.activeNav);
  const [activeTab, setActiveTab] = useState(props.activeTab);

  useEffect(() => {
    setActiveNav(props.activeNav);
    setActiveTab(props.activeTab);
  }, [props.activeNav, props.activeTab]);

  useEffect(() => {
    const activeElem = global.document.getElementById(`${props.activeTab}-tab`);
    const select = global.document.querySelector("select[name='size-select-mobile']");
    if (activeElem) activeElem.focus();
    if (select) select.focus();
  }, [activeNav]);

  const handleOnTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleOnSelectChange = (e) => {
    setActiveTab(e.currentTarget.value);
  };

  const getColumns = () => {
    const columns = jsonData[activeNav][activeTab] instanceof Array
      ? jsonData[activeNav][activeTab]
      : jsonData[activeNav];

    return Object.keys(columns[0]).map((column) => ({
      name: column,
      accessor: column
    }));
  };

  const getData = () => (
    jsonData[activeNav][activeTab] instanceof Array
      ? jsonData[activeNav][activeTab]
      : jsonData[activeNav]
  );

  return (
    <div>
      {
        !(jsonData[activeNav] instanceof Array) && (
          <>
            <Navigation>
              {
                Object.keys(jsonData[activeNav]).map((tab) => (
                  <NavTab
                    key={tab}
                    id={`${tab}-tab`}
                    active={activeTab === tab ? 'true' : undefined}
                    element="button"
                    type="button"
                    like="dec-1"
                    onClick={() => handleOnTabClick(tab)}
                  >
                    {tab}
                  </NavTab>
                ))
              }
            </Navigation>

            <MobileNavigation name="size-select-mobile" value={activeTab} onChange={(e) => handleOnSelectChange(e)}>
              {
                Object.keys(jsonData[activeNav]).map((tab) => (
                  <option
                    key={`mobile-${tab}`}
                    value={tab}
                  >
                    {tab}
                  </option>
                ))
              }
            </MobileNavigation>
          </>
        )
      }
      <SizeTableWrapper>
        <SizeTable columns={getColumns()} tableData={getData()} />
      </SizeTableWrapper>
    </div>
  );
};

SizeGuideTab.defaultProps = {
  activeNav: '',
  activeTab: ''
};

SizeGuideTab.propTypes = {
  activeNav: PropTypes.string,
  activeTab: PropTypes.string
};

export default memo(SizeGuideTab);

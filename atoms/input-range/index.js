import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import InputSlider from 'react-input-range';

const StyledRange = styled.div`
  .input-range {
    height: 1.6rem;
    position: relative;
    width: 100%;
    font-size: 1rem;

    &__label {
      display: none;

      &-container {
        pointer-events: none;
      }
    }

    &__slider {
      background: ${(props) => props.theme.color.white};
      border: 2px solid ${(props) => props.theme.color.brand};
      border-radius: 100%;
      cursor: pointer;
      display: block;
      height: 1.6em;
      margin-left: -0.8em;
      margin-top: -1em;
      position: absolute;
      width: 1.6em;

      &-container {
        transition: left 300ms ease-out;
      }
    }

    &__track {
      background: ${(props) => props.theme.color.brandLight};
      border-radius: 0.25rem;
      cursor: pointer;
      display: block;
      height: 0.5em;
      position: relative;
      transition: left 300ms ease-out, width 300ms ease-out;

      &--active {
        background: ${(props) => props.theme.color.white};
      }

      &--background {
        left: 0;
        right: 0;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

  @media screen and (min-width: ${(props) => props.theme.breakpoint.medium}) {
    .input-range {
      &__slider {
        background: ${(props) => props.theme.color.white};
        border: 2px solid ${(props) => props.theme.color.brand};
      }

      &__track {
        background: ${(props) => props.theme.color.brandLight};

        &--active {
          background: ${(props) => props.theme.color.brand};
        }
      }
    }
  }
`;

class InputRange extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: {
        min: this.props.value.min,
        max: this.props.value.max
      },
      step: props.step
    };

    this.handleOnChange = this.handleOnChange.bind(this);
    this.updateValueState = this.updateValueState.bind(this);
  }

  componentDidUpdate(previousProps) {
    if (previousProps.value !== this.props.value) {
      this.updateValueState();
    }
  }

  updateValueState() {
    this.setState({ value: this.props.value });
  }

  handleOnChange(value) {
    const v = value;

    if (value.min < this.props.min) {
      v.min = this.props.min;
    }

    if (value.max > this.props.max) {
      v.max = this.props.max;
    }

    this.setState({ value: v });
    this.props.onChange(v);
  }

  render() {
    return (
      <StyledRange>
        <InputSlider
          {...this.props}
          minValue={this.props.min}
          maxValue={this.props.max}
          value={this.state.value}
          step={this.state.step}
          onChange={this.handleOnChange}
        />
      </StyledRange>
    );
  }
}

InputRange.defaultProps = {
  min: 0,
  step: 1,
  value: {},
  onChange: () => { }
};

InputRange.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number.isRequired,
  step: PropTypes.number,
  onChange: PropTypes.func,
  value: PropTypes.object
};

export default InputRange;

import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  background: #232129;
  border-radius: 8px;
  border: #232119 solid 2px;
  padding: 16px;
  width: 100%;
  color: #666360;

  & + div {
    margin-top: 8px;
  }

  input {
    flex: 1;
    border: 0;
    background: transparent;
    color: #f4ede8;

    &::placeholder {
      color: #666360;
    }
  }

  svg {
    margin-right: 16px;
  }
`;

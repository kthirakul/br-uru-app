import styled from "styled-components";

export const WrapAdmin = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const WrapAuto = styled.div`
  overflow: auto;
`;

export const SHeaderAdmin = styled.div`
  justify-content: space-between;
  display: flex;
  border-bottom: 2px solid rgba(0, 0, 0, 0.2);
  padding-bottom: 12px;
`;

export const TAdmin = styled.div`
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
`;

export const SInputAdmin = styled.input`
  border: none;
  outline: none;
  font-size: 16px;
  margin-left: 6px;
  font-family: "Kanit", sans-serif;

  ::placeholder {
    font-size: 16px;
    font-family: "Kanit", sans-serif;
  }
`;

export const WrapSearch = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background: white;
  border-radius: 99px;
`;

import React from "react";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import { Bookmark, Room } from "@material-ui/icons";
import { Link } from "react-router-dom";

const LeftRoom = ({ roomdata, index }) => {
  const { roomname, location } = roomdata;

  const WrapRoom = styled(Link)`
    color: black;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 6px;
    box-sizing: border-box;
    background: ${index % 2 === 0 ? "#F1F2F7" : "white"};
    min-height: 60px;
    overflow: auto;
    cursor: pointer;
    user-select: none;
    transition: 0.1s;
    text-decoration: none;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
    :hover {
      background: #448aff;
      color: white;
    }
  `;

  return (
    <WrapRoom to={{ pathname: `/rooms/${roomdata.roomid}` }}>
      <Co item xs={6}>
        <Bookmark style={{ marginRight: 4 }} />
        {roomname}
      </Co>
      <Co item xs={6}>
        <Room style={{ marginRight: 4 }} />
        {location}
      </Co>
    </WrapRoom>
  );
};

const Co = styled(Grid)`
  display: flex;
  align-items: center;
`;

export { LeftRoom };

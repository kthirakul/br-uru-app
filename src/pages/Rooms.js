import React, { useContext } from "react";
import styled from "styled-components";
import Context from "../store/Context";
import { LeftRoom } from "../components/Rooms/RoomComps";
import { CallMade } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";

const Rooms = () => {
  const context = useContext(Context);
  const { roomdata, firstLoad } = context;

  const LoadingFirst = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    margin-top: ${firstLoad && 12}px;
  `;

  return (
    <WrapRoom>
      <Title to="/rooms">
        <span>ห้องทั้งหมด ({roomdata.length})</span>
        <CallMade />
      </Title>

      <LoadingFirst>{firstLoad && <CircularProgress />}</LoadingFirst>
      <WrapAllRoom>
        {roomdata.map((res, index) => (
          <LeftRoom key={res.roomid} roomdata={res} index={index} />
        ))}
      </WrapAllRoom>
    </WrapRoom>
  );
};

const WrapAllRoom = styled.div`
  overflow-x: auto;
  height: 100%;
  padding-bottom: 60px;
  box-sizing: border-box;
`;

const Title = styled(Link)`
  height: 50px;
  background: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  color: black;
  font-weight: 500;
  font-size: 1.15em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  box-sizing: border-box;
  :hover {
    color: blue;
  }
`;
const WrapRoom = styled.div`
  height: 100%;
  padding-bottom: 50px;
  box-sizing: border-box;
  width: 274px;
  background: white;
  margin-top: 12px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.4);
  overflow: hidden;
`;

export default Rooms;

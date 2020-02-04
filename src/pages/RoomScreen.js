import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import Context from "../store/Context";
import WrapContainer from "../util/WrapContainer";
import { BookmarkBorder } from "@material-ui/icons";
import {
  renderRoom,
  renderDetail,
  renderSearch
} from "../components/Rooms/renderRoom";
const RoomScreen = ({ location, history }) => {
  const context = useContext(Context);
  const { roomdata, bookPack } = context;
  const [roomdis, setRoomdis] = useState([]);
  document.title = roomdis
    ? roomdis.roomname
    : `ห้องทั้งหมด (${roomdata.length})`;
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setRoomdis(
      roomdata.find(
        res => res.roomid === location.pathname.replace("/rooms/", "")
      )
    );
  }, [location.pathname, roomdata]);

  return (
    <WrapContainer
      icon={<BookmarkBorder style={{ marginRight: 3 }} />}
      header={`ห้องทั้งหมด (${roomdata.length})`}
    >
      <WrapContent>
        <WrapRooms>
          <WrapSearchBG>{renderSearch(search, setSearch)}</WrapSearchBG>
          <WrapRoomAll>{renderRoom(roomdata, search, setRoomdis)}</WrapRoomAll>
        </WrapRooms>

        <WrapDetail>
          {renderDetail(roomdis, history, bookPack, loading, setLoading)}
        </WrapDetail>
      </WrapContent>
    </WrapContainer>
  );
};

const WrapSearchBG = styled.div`
  background: rgba(0, 0, 0, 0.035);
`;
const WrapRoomAll = styled.div`
  overflow: auto;
  padding-bottom: 48px;
  width: 280px;
`;

const WrapContent = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const WrapDetail = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  border-left: 3px solid rgba(0, 0, 0, 0.075);
  padding-top: 24px;
`;

const WrapRooms = styled.div`
  display: flex;
  flex-direction: column;
`;

export default RoomScreen;

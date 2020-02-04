import React, { Fragment } from "react";
import {
  Class,
  Search,
  LocationOn,
  Group,
  ViewList,
  Work,
  Error,
  AddCircle,
  EmojiFlags
} from "@material-ui/icons";
import styled from "styled-components";
import { Button, CircularProgress } from "@material-ui/core";

const renderSearch = (search, setSearch) => {
  const updateSearch = e => {
    setSearch(e.target.value);
  };

  return (
    <WrapSearch>
      <Search />
      <SInput
        placeholder="ค้นหาห้อง"
        value={search}
        onChange={updateSearch}
        type="text"
      />
    </WrapSearch>
  );
};

// Styles renderSearch
const SInput = styled.input`
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

const WrapSearch = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background: white;
  border-radius: 99px;
  margin: 12px;
`;
// Styles renderSearch

const renderRoom = (roomdata, search, setRoomdis) => {
  let filterRoom = roomdata.filter(room => {
    return room.roomname.toLowerCase().indexOf(search.toLowerCase()) !== -1;
  });

  const pushState = roomid => {
    window.history.pushState(null, null, `/rooms/${roomid}`);
    setRoomdis(roomdata.find(res => res.roomid === roomid));
  };

  return filterRoom.map((res, i) => (
    <WrapRoomList key={res.roomid} onClick={() => pushState(res.roomid)}>
      <Class fontSize="large" style={{ marginRight: 6 }} />
      <div>
        <Textname>{res.roomname}</Textname>
        <TextLocation>{res.location}</TextLocation>
      </div>
    </WrapRoomList>
  ));
};
// Styles renderRoom
const Textname = styled.div`
  font-weight: bold;
`;
const TextLocation = styled.div`
  font-size: 14px;
`;
const WrapRoomList = styled.div`
  padding: 12px 12px;
  display: flex;
  align-items: center;
  cursor: default;
  transition: 0.1s;
  border-bottom: 2.5px solid rgba(0, 0, 0, 0.075);
  :hover {
    background: rgba(0, 0, 0, 0.075);
  }
`;
// Styles renderRoom

const renderDetail = (roomdis, history, bookPack, loading, setLoading) => {
  const renderList = list => {
    return list && list.map((res, i) => <li key={i}>{res}</li>);
  };

  const bookThis = () => {
    if (localStorage.hasOwnProperty("FBIdToken")) {
      setLoading(true);
      sessionStorage.setItem("bookThis", true);
      setTimeout(() => {
        bookPack.setCreatePage("create");
        bookPack.setRoombook(roomdis.roomid);
        history.push("/");
      }, 300);
    } else {
      history.push("/home");
    }
  };
  return roomdis ? (
    <Fragment>
      <WrapDetail>
        <WrapHead>
          <WrapName>{roomdis.roomname}</WrapName>
          {roomdis.note && roomdis.note.trim().length > 0 ? (
            <WrapPs>
              <Error fontSize="small" style={{ marginRight: 2 }} />
              {roomdis.note}
            </WrapPs>
          ) : null}
        </WrapHead>
        <Hr />

        <WrapItem>
          <LocationOn style={{ marginRight: 2 }} />
          {roomdis.location}
        </WrapItem>
        <Hr />

        <WrapItem>
          <Group style={{ marginRight: 2 }} />
          รองรับได้ {roomdis.contain} คน
        </WrapItem>
        <Hr />

        <div>
          <WrapItem>
            <ViewList style={{ marginRight: 2 }} />
            อุปกรณ์
          </WrapItem>
          <SUl>{renderList(roomdis.asset)}</SUl>
        </div>

        <Hr />

        <div>
          <WrapItem>
            <Work style={{ marginRight: 2 }} />
            การใช้งาน
          </WrapItem>
          <SUl>{renderList(roomdis.detail)}</SUl>
        </div>
        <Hr />
      </WrapDetail>
      {localStorage.hasOwnProperty("FBIdToken") && (
        <div style={{ marginLeft: 12 }}>
          <BookRoom onClick={loading ? null : bookThis}>
            <WrapBookText>
              {loading ? (
                <CircularProgress />
              ) : (
                <Fragment>
                  <AddCircle style={{ marginRight: 4 }} />
                  จองห้องนี้
                </Fragment>
              )}
            </WrapBookText>
          </BookRoom>
        </div>
      )}
    </Fragment>
  ) : (
    <WrapChoose>
      <EmojiFlags />
      เลือกห้องเพื่อดูรายละเอียด
    </WrapChoose>
  );
};
const Hr = styled.hr`
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid rgba(0, 0, 0, 0.35);
`;
const WrapChoose = styled.div`
  display: Flex;
  flex-direction: column;
  align-items: center;
`;

const WrapBookText = styled.div`
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  padding: 6px 8px 6px 4px;
`;

const BookRoom = styled(Button)`
  width: 125px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
`;

const WrapName = styled.div`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

const WrapHead = styled.div`
  padding: 24px 24px 12px 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WrapPs = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #d20000;
  padding-left: 2px;
`;

const SUl = styled.div`
  margin: 8px 0 20px 27px;
`;

const WrapItem = styled.div`
  display: flex;
  align-items: center;
`;

const WrapDetail = styled.div`
  overflow: hidden;
  box-sizing: border-box;
  width: 400px;
  overflow: auto;
  padding: 0 40px;
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 24px 0 rgba(0, 0, 0, 0.1);
`;

export { renderRoom, renderDetail, renderSearch };

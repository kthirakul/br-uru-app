import React, { useContext } from "react";
import DayPicker from "react-day-picker";
import Context from "../store/Context";
import "react-day-picker/lib/style.css";
import styled from "styled-components";
import { MONTHS, WEEKDAYS_LONG, WEEKDAYS_SHORT } from "../util/LocaleDay";
import dayjs from "dayjs";
import { useHistory } from "react-router-dom";
import { LinearProgress } from "@material-ui/core";
const CalendarList = () => {
  const context = useContext(Context);
  const { bookdata, firstLoad } = context;

  const history = useHistory();

  const modifiers = () => {
    if (bookdata) {
      let mapDate = {};
      Object.keys(bookdata).forEach((res, i) => {
        mapDate = {
          ...mapDate,
          [res]: new Date(res)
        };
      });
      return { mapDate };
    } else return {};
  };

  const modifiersStyles = () => {
    if (bookdata) {
      let mapDate = {};
      Object.keys(bookdata).forEach((res, i) => {
        const isAfter = dayjs(new Date(res)).isAfter(new Date());
        const isSame = dayjs(res).isSame(
          dayjs(new Date()).format("YYYY,MM,DD")
        );
        mapDate = {
          ...mapDate,
          [res]: {
            backgroundColor: `${isAfter || isSame ? "#CDD7FF" : "white"}`
          }
        };
      });
      return {
        mapDate
      };
    } else return {};
  };

  const onDayClick = date => {
    const datepick = dayjs(date).format("YYYY,MM,DD");

    history.push({
      pathname: `/allbooks/${datepick}`,
      state: {
        date: datepick,
        data: bookdata[datepick]
      }
    });
  };

  return (
    <div>
      <WrapInside>
        {firstLoad && <LinearLoading />}
        <DayPicker
          onDayClick={onDayClick}
          disabledDays={{ before: new Date() }}
          showOutsideDays={true}
          modifiers={modifiers().mapDate}
          modifiersStyles={modifiersStyles().mapDate}
          locale="th"
          months={MONTHS}
          weekdaysLong={WEEKDAYS_LONG}
          weekdaysShort={WEEKDAYS_SHORT}
          firstDayOfWeek={1}
        />
      </WrapInside>
    </div>
  );
};
const WrapInside = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
`;

const LinearLoading = styled(LinearProgress)``;

export default CalendarList;

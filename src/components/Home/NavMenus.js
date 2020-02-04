import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, List, ListItem, DialogTitle, Dialog } from "@material-ui/core";
import ImgBG from "../../util/ImgBG";
import { dv } from "../../util/sizeDevice";
import { blue } from "@material-ui/core/colors";
import styled from "styled-components";

const emails = ["username@gmail.com", "user02@gmail.com"];
const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600]
  }
});

function ThemeDialog({ icon, handle, onClose, selectedValue, open, imgSet }) {
  // const classes = useStyles();

  const handleClose = () => {
    onClose(selectedValue);
  };

  // const handleListItemClick = value => {
  //   onClose(value);
  // };
  const WrapDialogTitle = styled.div`
    display: flex;
    align-items: center;
  `;

  const ButtonBG = styled.span`
    border-radius: 18px;
    cursor: pointer;
    background-image: url(${props => props.ImgBG});
    width: 90px;
    height: 60px;
    background-size: cover;
    background-position: center;
    background-repeat: none;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.4);
  `;

  const SDialog = styled(Dialog)`
    height: 500px;
  `;
  const SList = styled(List)`
    overflow: auto;
    display: grid;
    grid-template-columns: auto auto auto;
  `;
  return (
    <SDialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">
        <WrapDialogTitle>
          {handle && icon}เลือกธีมส์ ({ImgBG.length})
        </WrapDialogTitle>
      </DialogTitle>

      <SList>
        {ImgBG.map((bg, i) => (
          <ListItem button onClick={() => imgSet(i)} key={i}>
            <ButtonBG ImgBG={bg} />
          </ListItem>
        ))}
      </SList>
    </SDialog>
  );
}

const NavMenus = ({ menu, icon, handle, imgSet }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);

  const handleDialog = handle => {
    setOpen(handle ? handle : false);
  };

  const handleClose = value => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <Wrap>
      <SButton onClick={() => handleDialog(handle)}>
        <ThemeButton style={{ color: "white" }}>
          {icon} {menu}
        </ThemeButton>
      </SButton>
      <ThemeDialog
        imgSet={imgSet}
        icon={icon}
        handle={handle}
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </Wrap>
  );
};
const Wrap = styled.div`
  color: white;
`;
const ThemeButton = styled.div`
  color: white;
  display: flex;
  align-items: center;
  transition: 0.25s;
  opacity: 0.75;
  :hover {
    opacity: 1;
  }
`;
const SButton = styled(Button)`
  outline: none;
  border: none;
`;

export default NavMenus;

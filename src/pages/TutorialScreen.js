import React, { useContext } from "react";
import Context from "../store/Context";
import WrapContainer from "../util/WrapContainer";
import { WorkOutline } from "@material-ui/icons";

const TellScreen = () => {
  document.title = `วิธีใช้งาน`;

  const context = useContext(Context);

  return (
    <WrapContainer
      icon={<WorkOutline style={{ marginRight: 6 }} />}
      header={"วิธีใช้งาน"}
    >
      TutorialScreen
    </WrapContainer>
  );
};

export default TellScreen;

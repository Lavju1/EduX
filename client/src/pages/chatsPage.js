import { PrettyChatWindow } from "react-chat-engine-pretty";

const ChatsPage = (props) => {
  return (
    <div style={{ marginTop: "10vh", height: "90vh", width: "100vw" }}>
      <PrettyChatWindow
        projectId='6578c0e9-3dc1-404e-9da9-be291a336574'
        username={props.user.username} // 
        secret={props.user.secret} // 
        style={{ height: "100%", background: "White" }}
      />
    </div>
  );
};

export default ChatsPage;

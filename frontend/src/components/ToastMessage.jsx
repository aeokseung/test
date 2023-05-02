import './ToastMessage.css';

export const ToastMessage = (userList) => {
  
    return (
    <div className="toast_container">
      <div className="toast_text">{userList.memberId}</div>
    </div>
  );
};
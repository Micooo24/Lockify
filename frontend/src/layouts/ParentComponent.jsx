import React, { useState } from "react";
import AccountPage from "./AccountPage";

const ParentComponent = () => {
  const [isAccountPageVisible, setIsAccountPageVisible] = useState(false);

  const handleOpenAccountPage = () => {
    setIsAccountPageVisible(true);
  };

  const handleCloseAccountPage = () => {
    setIsAccountPageVisible(false);
  };

  return (
    <div>
      <button onClick={handleOpenAccountPage}>Open Account Page</button>
      {isAccountPageVisible && (
        <AccountPage isVisible={isAccountPageVisible} onClose={handleCloseAccountPage} />
      )}
    </div>
  );
};

export default ParentComponent;
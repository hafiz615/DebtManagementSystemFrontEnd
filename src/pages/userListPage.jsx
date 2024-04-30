import React from "react";
import PersistentDrawerLeft from "../components/openDrawer";
import UserLists from "../components/userLists";
function UserListPage() {
  return (
    <PersistentDrawerLeft>
      <UserLists />
    </PersistentDrawerLeft>
  );
}

export default UserListPage;

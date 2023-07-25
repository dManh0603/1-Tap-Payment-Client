import { IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { UserState } from "../../contexts/UserProvider";
import { ExternalLinkIcon, HamburgerIcon } from "@chakra-ui/icons";

function DrawerButton() {
  const { logout } = UserState();

  return (
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<HamburgerIcon />}
          colorScheme='blue'
        />
        <MenuList>
          <MenuItem onClick={logout}>
            Logout
          </MenuItem>

        </MenuList>
      </Menu>

    </>
  )
}

export default DrawerButton;
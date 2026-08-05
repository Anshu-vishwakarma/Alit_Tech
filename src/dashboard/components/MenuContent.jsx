import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";

import { Link, useLocation } from "react-router-dom";

const mainListItems = [
  {
    text: "Items",
    icon: <HomeRoundedIcon />,
    path: "/items",
  },
  {
    text: "Sign In",
    icon: <AnalyticsRoundedIcon />,
    path: "/signin",
  },
  {
    text: "Sign Up",
    icon: <PeopleRoundedIcon />,
    path: "/signup",
  },
  {
    text: "Invoice",
    icon: <AssignmentRoundedIcon />,
    path: "/invoice",
  },
];

const secondaryListItems = [
  {
    text: "Settings",
    icon: <SettingsRoundedIcon />,
    path: "/settings",
  },
  {
    text: "About",
    icon: <InfoRoundedIcon />,
    path: "/about",
  },
  {
    text: "Feedback",
    icon: <HelpRoundedIcon />,
    path: "/feedback",
  },
];

export default function MenuContent() {
  const location = useLocation();

  return (
    <Stack
      sx={{
        flexGrow: 1,
        p: 1,
        justifyContent: "space-between",
      }}
    >
      <List dense>
        {mainListItems.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            sx={{ display: "block" }}
          >
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                mb: 0.5,
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>

              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List dense>
        {secondaryListItems.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            sx={{ display: "block" }}
          >
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                mb: 0.5,
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>

              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ListSubheader from '@mui/material/ListSubheader';

import {
  BrowserRouter,
  Route,
  Switch,
  useParams,
  useHistory,
  useLocation,
  Routes,
  useNavigate,
} from 'react-router-dom';
import { Example } from './Example';

const drawerWidth = 240;

export function Home() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (event: any, index: number) => {
    setSelectedIndex(index);
  };

  const gettingStartedPages = ['About', 'Starred', 'Send email', 'Drafts'];
  // const examplesPages = ['Cubes With Vertex Arrays', 'Trash', 'Spam'];

  const examplesPages = [
    {
      name: 'Cubes With Vertex Arrays',
      path: '/cubes-with-vertex-arrays',
      element: <div />,
    },
    {
      name: 'First Triangle',
      path: '/first-triangle',
      element: <div />,
    },
    {
      name: 'Opengl Cart And Windmill',
      path: '/opengl-cart-and-windmill',
      element: <div />,
    },
  ];

  const fromNameToURL = {
    'Cubes With Vertex Arrays': '/cubes-with-vertex-arrays',
  };
  const toURL = (name: string) => {
    return `/${name.toLocaleLowerCase().split(' ').join('-')}`;
  };

  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            OpenGL1.1 JS
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          <ListSubheader component="div" id="nested-list-subheader">
            Nested List Items
          </ListSubheader>
          {gettingStartedPages.map((text, index) => (
            <ListItem
              button
              key={text}
              selected={index === selectedIndex}
              onClick={(event) => handleListItemClick(event, index)}
            >
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListSubheader component="div" id="nested-list-subheader">
            Examples
          </ListSubheader>
          {examplesPages.map((page, index) => (
            <ListItem
              button
              key={page.name}
              selected={index + gettingStartedPages.length === selectedIndex}
              onClick={(event) => {
                navigate(page.path);
                handleListItemClick(event, index + gettingStartedPages.length);
              }}
            >
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={page.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<Example />} />
          {examplesPages.map((value) => (
            <Route key={value.name} path={value.path} element={value.element} />
          ))}
        </Routes>
      </Box>
    </Box>
  );
}

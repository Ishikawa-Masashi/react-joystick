import React from 'react';
import { useState, useEffect, useRef } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  useParams,
  useHistory,
  useLocation,
  Link,
} from 'react-router-dom';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import Info from './Info';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuItem from '@material-ui/core/MenuItem';
import { SplitPane, SplitPaneProps } from '../../src';
import Select from '@material-ui/core/Select';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Button from '@material-ui/core/Button';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SAMPLES from '../samples';
import { Paper } from '@material-ui/core';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    // flexWrap: 'wrap',
    // '& > *': {
    //   margin: theme.spacing(1),
    //   width: theme.spacing(16),
    //   height: theme.spacing(16),
    // },
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    width: '100%',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  toolbar: theme.mixins.toolbar,
}));

export default function Home(): JSX.Element {
  const classes = useStyles();
  // const history = useHistory();
  const [value, setValue] = useState(0);
  const [modeId, setModeId] = useState('typescript');
  const [theme, setTheme] = useState<'vs' | 'vs-dark' | 'hc-black'>('vs');
  // const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
  //   setValue(newValue);

  //   history.push(pages[newValue]);
  // };
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setModeId(event.target.value as string);
  };

  const handleChangeTheme = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTheme(event.target.value as 'vs' | 'vs-dark' | 'hc-black');
  };

  useEffect(() => {
    return () => {};
  });

  const menuItems = () => {
    const modesIds = monaco.languages.getLanguages().map((lang) => lang.id);
    modesIds.sort();

    return modesIds.map((modeId, index) => (
      <MenuItem key={index} value={modeId}>
        {modeId}
      </MenuItem>
    ));
  };

  const shouldCollapse = true;
  const VerticalSplitPane = (props: Omit<SplitPaneProps, 'split'>) => (
    <SplitPane split={'vertical'} collapse={shouldCollapse}>
      {props.children}
    </SplitPane>
  );
  const HorizontalSplitpane = (props: Omit<SplitPaneProps, 'split'>) => (
    <SplitPane split={'horizontal'} collapse={shouldCollapse}>
      {props.children}
    </SplitPane>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            React Monaco Editor
          </Typography>
          <div style={{ width: '64px' }}></div>
        </Toolbar>
      </AppBar>

      <main className={classes.content}>
        <div className={classes.toolbar} />

        <Typography variant="h4" gutterBottom>
          Vertical
        </Typography>
        <Paper elevation={3}>
          <div style={{ width: '100%', height: '200px', position: 'relative' }}>
            <SplitPane split="vertical" collapse={true}>
              <div>This is the first div</div>
              <div>This is the second div</div>
              <div>This is the third div</div>
              This is the fourth but not a div!
            </SplitPane>
          </div>
        </Paper>
        <Typography variant="h4" gutterBottom>
          rtl
        </Typography>
        <Paper elevation={3}>
          <div style={{ width: '100%', height: '200px', position: 'relative' }}>
            <div style={{ direction: 'rtl' }}>
              <SplitPane split="vertical" dir="rtl">
                <div>اللوحة الأولى</div>
                <div>اللوحة الثانية</div>
                <div>اللوحة الثالثة</div>
                <div>اللوحة الرابعة</div>
              </SplitPane>
            </div>
          </div>
        </Paper>

        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
          <div style={{ direction: 'rtl' }}>
            <SplitPane split="horizontal">
              <div>This is a div</div>
              <div>This is a second div</div>
              <div>This is a third div</div>
              <div>This is a fourth div</div>
            </SplitPane>
          </div>
        </div>
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
          <HorizontalSplitpane>
            I'm at the top level!
            <VerticalSplitPane>
              <div>This is a div</div>
              <div>This is a second div</div>
              <div>
                <HorizontalSplitpane>
                  <div>Horizontal 1</div>
                  <VerticalSplitPane>
                    <div>I'm within the horizontal but vertical!</div>
                    <div>I'm the same but again!</div>
                  </VerticalSplitPane>
                </HorizontalSplitpane>
              </div>
              <div>This is a fourth div</div>
            </VerticalSplitPane>
          </HorizontalSplitpane>
        </div>
      </main>
    </div>
  );
}

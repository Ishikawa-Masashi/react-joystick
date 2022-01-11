import React, { useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
// import { VirtualList, ItemStyle } from "../../src";
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
// import { DIRECTION } from "../../src/components/constants";
import {
  glsimUse,
  glMatrixMode,
  GL_PROJECTION,
  glOrtho,
  GL_MODELVIEW,
  glEnable,
  GL_DEPTH_TEST,
  glClearColor,
  glClear,
  GL_COLOR_BUFFER_BIT,
  GL_DEPTH_BUFFER_BIT,
  glLoadIdentity,
  glTranslatef,
  glRotatef,
  glVertexPointer,
  GL_FLOAT,
  glColorPointer,
  glEnableClientState,
  GL_VERTEX_ARRAY,
  GL_COLOR_ARRAY,
  glDrawArrays,
  GL_QUADS,
  GL_POLYGON_OFFSET_FILL,
  glPolygonOffset,
  glDrawElements,
  GL_UNSIGNED_INT,
  glDisable,
  glDisableClientState,
  glColor3f,
  glLineWidth,
  GL_LINES,
  GL_TRIANGLES,
  glBegin,
  glVertex2f,
  glEnd,
} from '../../src';

// スタイルを定義
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(6),
    },
    title: {
      borderBottom: `2px solid ${theme.palette.primary.main}`,
    },
    paper: {
      padding: 18,
    },
  })
);

// props の型を定義
type Props = {
  title?: string;
};

// コンポーネントを定義
export const FirstTriangle: React.FunctionComponent<Props> = ({
  title,
}: Props) => {
  // ここでクラス名を取得
  const classes = useStyles({});

  function display() {
    // Called by init() to draw the image.

    glClearColor(0, 0, 0, 1);
    glClear(GL_COLOR_BUFFER_BIT);

    glBegin(GL_TRIANGLES);
    glColor3f(1, 0, 0); // red
    glVertex2f(-0.8, -0.8);
    glColor3f(0, 1, 0); // green
    glVertex2f(0.8, -0.8);
    glColor3f(0, 0, 1); // blue
    glVertex2f(0, 0.9);
    glEnd();
  }

  function init() {
    // Called by <body onload="init()">, when the page has loaded.
    try {
      glsimUse('glcanvas'); // OpenGL will draw to the canvas with id="glcanvas".
    } catch (e) {
      document.getElementById('canvas-holder').innerHTML =
        'Sorry, an error occured:<br>' + e;
      return;
    }
    display();
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div className={classes.root}>
      <h2>First OpenGL Example: The RGB Triangle</h2>
      <div id="canvas-holder">
        <canvas id="glcanvas" width="500" height="500"></canvas>
      </div>
    </div>
  );
};

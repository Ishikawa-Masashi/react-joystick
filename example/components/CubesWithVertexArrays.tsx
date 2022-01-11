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
export const CubesWithVertexArrays: React.FunctionComponent<Props> = ({
  title,
}: Props) => {
  // ここでクラス名を取得
  const classes = useStyles({});

  const itemCount = 100000;

  const [itemSize, setItemSize] = React.useState<number | number[]>(100);
  const handleChange = (event: any, newValue: number | number[]) => {
    setItemSize(newValue < 18 ? 18 : newValue);
  };

  let rotateX = 15; // rotations of cube about the axes
  let rotateY = -15;
  let rotateZ = 0;

  /* Arrays for use with glDrawElements.  This is the data for a cube with 6 different
   * colors at the six vertices.  (Looks kind of strange without lighting.)
   */

  const vertexCoords = [
    // Coordinates for the vertices of a cube.
    1, 1, 1, 1, 1, -1, 1, -1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1,
    -1, 1,
  ];

  const vertexColors = [
    // An RGB color value for each vertex
    1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1,
  ];

  const elementArray = [
    // Vertex number for the six faces.
    0, 1, 2, 3, 0, 3, 7, 4, 0, 4, 5, 1, 6, 2, 1, 5, 6, 5, 4, 7, 6, 7, 3, 2,
  ];

  /* We will draw edges for the first cube using this array with glDrawElements.
   * (It looks pretty bad without lighting if edges aren't drawn.
   */

  const edgeElementArray = [
    0,
    1,
    1,
    5,
    5,
    4,
    4,
    0, // edges of the top face
    7,
    3,
    3,
    2,
    2,
    6,
    6,
    7, // edges of the bottom face
    1,
    2,
    0,
    3,
    4,
    7,
    5,
    6,
  ]; // edges connecting top face to bottom face

  /* Arrays for use with glDrawArrays.  The coordinate array contains four sets of vertex
   * coordinates for each face.  The color array must have a color for each vertex.  Since
   * the color of each face is solid, there is a lot of redundancy in the color array.
   * There is also redundancy in the coordinate array, compared to using glDrawElements.
   * But note that it is impossible to use a single call to glDrawElements to draw a cube
   * with six faces where each face has a different solid color, since with glDrawElements,
   * the colors are associated with the vertices, not the faces.
   */

  const cubeCoords = [
    1,
    1,
    1,
    -1,
    1,
    1,
    -1,
    -1,
    1,
    1,
    -1,
    1, // face #1
    1,
    1,
    1,
    1,
    -1,
    1,
    1,
    -1,
    -1,
    1,
    1,
    -1, // face #2
    1,
    1,
    1,
    1,
    1,
    -1,
    -1,
    1,
    -1,
    -1,
    1,
    1, // face #3
    -1,
    -1,
    -1,
    -1,
    1,
    -1,
    1,
    1,
    -1,
    1,
    -1,
    -1, // face #4
    -1,
    -1,
    -1,
    -1,
    -1,
    1,
    -1,
    1,
    1,
    -1,
    1,
    -1, // face #5
    -1,
    -1,
    -1,
    1,
    -1,
    -1,
    1,
    -1,
    1,
    -1,
    -1,
    1,
  ]; // face #6

  const cubeFaceColors = [
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0, // face #1 is red
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0, // face #2 is green
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1,
    0,
    0,
    1, // face #3 is blue
    1,
    1,
    0,
    1,
    1,
    0,
    1,
    1,
    0,
    1,
    1,
    0, // face #4 is yellow
    0,
    1,
    1,
    0,
    1,
    1,
    0,
    1,
    1,
    0,
    1,
    1, // face #5 is cyan
    1,
    0,
    1,
    1,
    0,
    1,
    1,
    0,
    1,
    1,
    0,
    1,
  ]; // face #6 is red

  // ----------------------------------------------------------------------

  function display() {
    // Draws the image.

    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    glLoadIdentity(); // Set up modelview transform, first cube.
    glTranslatef(-2, 0, 0); // Move cube to left half of window.

    glRotatef(rotateZ, 0, 0, 1); // Apply rotations.
    glRotatef(rotateY, 0, 1, 0);
    glRotatef(rotateX, 1, 0, 0);

    glVertexPointer(3, GL_FLOAT, 0, cubeCoords); // Set data type and location, first cube.
    glColorPointer(3, GL_FLOAT, 0, cubeFaceColors);

    glEnableClientState(GL_VERTEX_ARRAY);
    glEnableClientState(GL_COLOR_ARRAY);

    glDrawArrays(GL_QUADS, 0, 24); // Draw the first cube!

    // Second cube, using glDrawElements.  Also draw the cube edges, and enable polygon offset
    // while the faces of the cube are being drawn.

    glLoadIdentity(); // Set up modelview transform, first cube.

    glTranslatef(2, 0, 0); // Move cube to right half of window.

    glRotatef(rotateZ, 0, 0, 1); // Apply rotations.
    glRotatef(rotateY, 0, 1, 0);
    glRotatef(rotateX, 1, 0, 0);

    glVertexPointer(3, GL_FLOAT, 0, vertexCoords); // Set data type and location, second cube.
    glColorPointer(3, GL_FLOAT, 0, vertexColors);

    glEnable(GL_POLYGON_OFFSET_FILL);
    glPolygonOffset(1, 1);
    glDrawElements(GL_QUADS, 24, GL_UNSIGNED_INT, elementArray); // Draw the second cube!
    glDisable(GL_POLYGON_OFFSET_FILL);

    glDisableClientState(GL_COLOR_ARRAY); // Don't use color array for the edges.
    glColor3f(0, 0, 0); // The edges will be black.
    glLineWidth(2);

    glDrawElements(GL_LINES, 24, GL_UNSIGNED_INT, edgeElementArray); // Draw the edges!
  }

  function initGL() {
    glMatrixMode(GL_PROJECTION);
    glOrtho(-4, 4, -2, 2, -2, 2); // simple orthographic projection
    glMatrixMode(GL_MODELVIEW);
    glEnable(GL_DEPTH_TEST);
    glClearColor(0.5, 0.5, 0.5, 1);
  }

  function doKeyDown(evt) {
    let key = evt.keyCode;
    if (key == 37)
      // left
      rotateY -= 15;
    else if (key == 39)
      // right
      rotateY += 15;
    else if (key == 40)
      // down
      rotateX += 15;
    else if (key == 38)
      // up
      rotateX -= 15;
    else if (key == 33)
      // page up
      rotateZ += 15;
    else if (key == 34)
      // page down
      rotateZ -= 15;
    else if (key == 36)
      // home
      rotateX = rotateY = rotateZ = 0;
    if (key >= 34 && key <= 40) {
      evt.preventDefault();
    }
    display();
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
    document.onkeydown = doKeyDown;
    initGL();
    display();
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div className={classes.root}>
      <h2>Cubes Drawn with glDrawArrays and glDrawElements</h2>
      <p>(Rotate using arrow keys, page up, page down, and home keys.)</p>
      <div id="canvas-holder">
        <canvas id="glcanvas" width="800" height="400"></canvas>
      </div>
    </div>
  );
};

import React from 'react';

// https://github.com/98oktay/react-native-axis-pad
// size: Integer,              // Wrapper circle size. Default: 300
// handlerSize : Intager,      // Handler circle size. Default: 150
// wrapperStyle : Object,      // Wrapper circle styles.
// handlerStyle : Object,      // Handler circle styles.
// step: Float,                // Step size for values. Default: 0
// lockX: Boolean,             // Block to X axis movement. Default: false
// lockY: Boolean,             // Block to Y axis movement. Default: false
// autoCenter: Boolean,        // Move wrapper to center of your touch area. Default: false
// resetOnRelease: Boolean     // Set (0,0) position on touch end.  Default: false
// onValue: Function           // callback: returned values { x:Float, y:Float }
export interface IJoystickProps {
  size?: number;
  baseColor?: string;
  stickColor?: string;
  throttle?: number;
  disabled?: boolean;
  move?: (event: IJoystickUpdateEvent) => void;
  stop?: (event: IJoystickUpdateEvent) => void;
  start?: (event: IJoystickUpdateEvent) => void;
  autoCenter?: boolean; // Move wrapper to center of your touch area. Default: false
  resetOnRelease?: boolean; // Set (0,0) position on touch end.  Default: false
  mode?: 'dynamic' | 'static'; // 'dynamic', 'static'
}

enum InteractionEvents {
  MouseDown = 'mousedown',
  MouseMove = 'mousemove',
  MouseUp = 'mouseup',
  TouchStart = 'touchstart',
  TouchMove = 'touchmove',
  TouchEnd = 'touchend',
}

export interface IJoystickUpdateEvent {
  type: 'move' | 'stop' | 'start';
  x: number | null;
  y: number | null;
  direction: JoystickDirection | null;
}

type JoystickDirection = 'FORWARD' | 'RIGHT' | 'LEFT' | 'BACKWARD';

export interface IJoystickCoordinates {
  relativeX: number;
  relativeY: number;
  axisX: number;
  axisY: number;
  direction: JoystickDirection;
}

export const Joystick: React.VFC<IJoystickProps> = (props) => {
  const {
    baseColor = 'hsl(0deg 0% 0% / 15%)',
    stickColor = 'hsl(0deg 0% 0% / 31%)',
    throttle = 0,
    size = 100,
    disabled = false,
    autoCenter = false,
    mode = 'static',
  } = props;

  const [visible, setVisible] = React.useState(mode === 'static');

  const _stickRef = React.useRef<HTMLDivElement>(null);
  const _baseRef = React.useRef<HTMLDivElement>(null);
  //   const _throttleMoveCallback: (data: any) => void;
  //   const _boundMouseUp: EventListenerOrEventListenerObject;
  //   const _baseSize: number;
  //   const _parentRect: ClientRect;
  const _parentRectRef = React.useRef<DOMRect>();
  //   const _boundMouseMove: (event: any) => void;

  //   constructor(props: IJoystickProps) {
  //     super(props);
  // this.state = {
  //   dragging: false,
  // };
  //   const [dragging, setDragging] = React.useState(false);
  const draggingRef = React.useRef(false);
  const [coordinates, setCoordinates] = React.useState<IJoystickCoordinates>();
  const coordinatesRef = React.useRef<IJoystickCoordinates | undefined>(
    undefined
  );

  // this._stickRef = React.createRef();
  // this._baseRef = React.createRef();

  const _throttleMoveCallback = (() => {
    let lastCall = 0;
    return (event: IJoystickUpdateEvent) => {
      const now = new Date().getTime();
      if (now - lastCall < throttle) {
        return;
      }
      lastCall = now;
      if (props.move) {
        return props.move(event);
      }
    };
  })();

  const _updatePos = (coordinates: IJoystickCoordinates) => {
    window.requestAnimationFrame(() => {
      //   this.setState({
      //     coordinates,
      //   });

      setCoordinates(coordinates);
      coordinatesRef.current = coordinates;

      // _stickRef.current!.style.transform = `translate3d(${coordinatesRef.current.relativeX}px, ${coordinatesRef.current.relativeY}px, 0)`;
    });
    _throttleMoveCallback({
      type: 'move',
      x: coordinates.relativeX,
      y: -coordinates.relativeY,
      direction: coordinates.direction,
    });
  };

  const isMouseDownEvent = (
    event: MouseEvent | TouchEvent
  ): event is MouseEvent => {
    return event.type === InteractionEvents.MouseDown;
  };

  const _mouseDown = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (disabled !== true) {
      _parentRectRef.current = _baseRef.current!.getBoundingClientRect();

      draggingRef.current = true;

      if (e.type === InteractionEvents.MouseDown) {
        window.addEventListener(InteractionEvents.MouseUp, _mouseUp);
        window.addEventListener(InteractionEvents.MouseMove, _mouseMove);
      } else {
        window.addEventListener(InteractionEvents.TouchEnd, _mouseUp);
        window.addEventListener(InteractionEvents.TouchMove, _mouseMove);
      }

      if (props.start) {
        props.start({
          type: 'start',
          x: null,
          y: null,
          direction: null,
        });
      }
    }
  };

  const _getDirection = (atan2: number): JoystickDirection => {
    if (atan2 > 2.35619449 || atan2 < -2.35619449) {
      return 'FORWARD';
    } else if (atan2 < 2.35619449 && atan2 > 0.785398163) {
      return 'RIGHT';
    } else if (atan2 < -0.785398163) {
      return 'LEFT';
    }
    return 'BACKWARD';
  };

  const _getWithinBounds = (value: number): number => {
    const halfBaseSize = size / 2;
    if (value > halfBaseSize) {
      return halfBaseSize;
    }
    if (value < -halfBaseSize) {
      return halfBaseSize * -1;
    }
    return value;
  };

  const isMouseMoveEvent = (
    event: MouseEvent | TouchEvent
  ): event is MouseEvent => {
    return event.type === InteractionEvents.MouseMove;
  };

  const _mouseMove = (event: MouseEvent | TouchEvent) => {
    if (draggingRef.current) {
      event.stopPropagation();
      event.preventDefault();
      let absoluteX = null;
      let absoluteY = null;
      // if (event.type === InteractionEvents.MouseMove) {
      //   absoluteX = (event as MouseEvent).clientX;
      //   absoluteY = (event as MouseEvent).clientY;
      // } else {
      //   absoluteX = (event as TouchEvent).touches[0].clientX;
      //   absoluteY = (event as TouchEvent).touches[0].clientY;
      // }
      if (isMouseMoveEvent(event)) {
        absoluteX = event.clientX;
        absoluteY = event.clientY;
      } else {
        absoluteX = event.touches[0].clientX;
        absoluteY = event.touches[0].clientY;
      }

      const relativeX = _getWithinBounds(
        absoluteX - _parentRectRef.current!.left - size / 2
      );
      const relativeY = _getWithinBounds(
        absoluteY - _parentRectRef.current!.top - size / 2
      );
      const atan2 = Math.atan2(relativeX, relativeY);

      _updatePos({
        relativeX,
        relativeY,
        direction: _getDirection(atan2),
        axisX: absoluteX - _parentRectRef.current!.left,
        axisY: absoluteY - _parentRectRef.current!.top,
      });
    }
  };

  const _mouseUp = () => {
    // this.setState({
    //   dragging: false,
    //   coordinates: undefined,
    // });
    // setDragging(false);
    draggingRef.current = false;
    // setCoordinates(undefined);
    coordinatesRef.current = undefined;

    _stickRef.current!.style.transform = 'unset';

    window.removeEventListener('mouseup', _mouseUp);
    window.removeEventListener('mousemove', _mouseMove);

    if (_baseRef.current) {
      _baseRef.current.style.left = 'initial';
      _baseRef.current.style.top = 'initial';
    }

    if (props.stop) {
      props.stop({
        type: 'stop',
        x: null,
        y: null,
        direction: null,
      });
    }
  };

  const baseStyle: React.CSSProperties = React.useMemo(() => {
    return {
      height: `${size}px`,
      width: `${size}px`,
      background: baseColor,
      borderRadius: size,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      visibility: visible ? 'visible' : 'hidden',
    };
  }, [size, baseColor, visible]);

  const _getStickStyle = () => {
    const stickSize = `${size / 1.5}px`;

    let stickStyle = {
      background: stickColor,
      cursor: 'move',
      height: stickSize,
      width: stickSize,
      borderRadius: size,
      flexShrink: 0,
    };

    if (draggingRef.current && coordinatesRef.current !== undefined) {
      stickStyle = Object.assign({}, stickStyle, {
        position: 'absolute',
        transform: `translate3d(${coordinatesRef.current.relativeX}px, ${coordinatesRef.current.relativeY}px, 0)`,
      });
    }
    return stickStyle;
  };

  const stickStyle = _getStickStyle();

  return (
    <div
      style={{ width: '100%', height: '100%' }}
      onMouseDown={(event) => {
        if (autoCenter) {
          const { clientX, clientY } = event;

          if (_baseRef.current) {
            _baseRef.current.style.left =
              clientX - _baseRef.current.clientWidth / 2 + 'px';
            _baseRef.current.style.top =
              clientY - _baseRef.current.clientHeight / 2 + 'px';

            _parentRectRef.current = _baseRef.current.getBoundingClientRect();

            mode === 'dynamic' && setVisible(true);
          }

          _mouseDown(event);
        }
      }}
      onMouseUp={(event) => {
        mode === 'dynamic' && setVisible(false);
      }}
    >
      <div
        className={disabled ? 'joystick-base-disabled' : ''}
        onMouseDown={(e) => !autoCenter && _mouseDown(e)}
        onTouchStart={_mouseDown}
        ref={_baseRef}
        style={baseStyle}
      >
        <div
          ref={_stickRef}
          className={disabled ? 'joystick-disabled' : ''}
          style={stickStyle}
        ></div>
      </div>
      {/* <div id="joystick" style={{ width: '20%' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: 'rgb(16,16,16)', stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: 'rgb(240,240,240)', stopOpacity: 1 }}
              />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: 'rgb(240,240,240)', stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: 'rgb(16,16,16)', stopOpacity: 1 }}
              />
            </linearGradient>
            <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                style={{ stopColor: 'rgb(168,168,168)', stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: 'rgb(239,239,239)', stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="50" fill="url(#grad1)" />
          <circle
            cx="50"
            cy="50"
            r="47"
            fill="url(#grad2)"
            stroke="black"
            stroke-width="1.5px"
          />
          <circle cx="50" cy="50" r="44" fill="url(#grad3)" />
          <circle
            // cx="50"
            cx={coordinatesRef.current ? coordinatesRef.current.relativeX : 50}
            cy="50"
            r="20"
            fill="#cccccc"
            stroke="black"
            stroke-width="1px"
            onClick={() => alert('CENTER')}
          />
          <path
            d="M50,14 54,22 46,22Z"
            fill="rgba(0,0,0,0.8)"
            onClick={() => alert('UP')}
          />
          <path
            d="M50,86 54,78 46,78Z"
            fill="rgba(0,0,0,0.8)"
            onClick={() => alert('DOWN')}
          />
          <path
            d="M14,50 22,54 22,46Z"
            fill="rgba(0,0,0,0.8)"
            onClick={() => alert('LEFT')}
          />
          <path
            d="M86,50 78,54 78,46Z"
            fill="rgba(0,0,0,0.8)"
            onClick={() => alert('RIGHT')}
          />
        </svg>
      </div> */}
    </div>
  );
};

import React from 'react';

export interface IJoystickProps {
  size?: number;
  baseColor?: string;
  stickColor?: string;
  throttle?: number;
  disabled?: boolean;
  move?: (event: IJoystickUpdateEvent) => void;
  stop?: (event: IJoystickUpdateEvent) => void;
  start?: (event: IJoystickUpdateEvent) => void;
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

export interface IJoystickState {
  dragging: boolean;
  coordinates?: IJoystickCoordinates;
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
    baseColor = '#000033',
    stickColor = '#3D59AB',
    throttle = 0,
    size = 100,
    disabled = false,
  } = props;

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

  const _mouseDown = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (disabled !== true) {
      _parentRectRef.current = _baseRef.current!.getBoundingClientRect();

      //   this.setState({
      //     dragging: true,
      //   });
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

  const isMouseEvent = (
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
      if (isMouseEvent(event)) {
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

    if (props.stop) {
      props.stop({
        type: 'stop',
        x: null,
        y: null,
        direction: null,
      });
    }
  };

  const baseStyle = React.useMemo(() => {
    return {
      height: `${size}px`,
      width: `${size}px`,
      background: baseColor,
      borderRadius: size,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };
  }, [size, baseColor]);

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
      className={disabled ? 'joystick-base-disabled' : ''}
      onMouseDown={_mouseDown}
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
  );
};

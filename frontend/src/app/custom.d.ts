declare module '*.scss' {
  interface IClassNames {
      [className: string]: string
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module '*.svg' {
  import React from 'react';

  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module '*.png'
declare module '*.jpeg'
declare module '*.jpg'

declare const __IS_DEV__: boolean;
declare const __PUBLIC_PATH__: boolean;


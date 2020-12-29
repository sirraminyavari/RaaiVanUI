import React from "react";
import { Helmet } from "react-helmet";

const UseScripts = (props) => {
  const { scripts, children } = props;
  return (
    <>
      <Helmet>
        {scripts.map((script, index) => {
          return (
            <script
              key={index}
              type="text/javascript"
              charset="utf-8"
              src={script.src}
            />
          );
        })}
      </Helmet>
      {children}
    </>
  );
};

export default UseScripts;

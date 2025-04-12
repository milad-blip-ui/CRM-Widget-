import React from 'react'

 const DropIndicator = ({ beforeId, Status }) => {
    return (
      <div
        data-before={beforeId || "-1"}
        data-column={Status}
        className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
      />
    );
  };

export default DropIndicator
import React from 'react';

const CustomHeader = ({ label, style, bold }) => {
	const defaultStyle = {
    fontWeight: bold ? 'bold' : 'none', // You can set fontWeight here as well
	};

	const headerStyle = { ...defaultStyle, ...style };

  return (
    <>
      <div className='container' style={headerStyle}>
				<h2>{label}</h2>
        {/* <h2>Manage your current team</h2> */}
      </div>
    </>
  );
};

export default CustomHeader;

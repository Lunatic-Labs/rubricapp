import React from 'react';

const CustomHeader = ({ label, style, bold, size }) => {
	const defaultStyle = {
    fontWeight: bold ? 'bold' : 'normal', // You can set fontWeight here as well
    fontSize: size || '1rem', 
	};

	const headerStyle = { ...defaultStyle, ...style };

  return (
    <>
      <div className='container' style={{display: 'flex', headerStyle}}>
				<h2>{label}</h2>
      </div>
    </>
  );
};

export default CustomHeader;

import React from 'react';
import { useParams } from 'react-router-dom';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="property-detail">
      <h1>Property Detail</h1>
      <p>Property ID: {id}</p>
      {/* Property details will be implemented here */}
    </div>
  );
};

export default PropertyDetail;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchProperties } from '../store/slices/propertySlice';

const Properties: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { properties, loading, error } = useSelector((state: RootState) => state.properties);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  if (loading) return <div>Loading properties...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="properties">
      <h1>Properties</h1>
      <div className="properties-grid">
        {properties.map((property) => (
          <div key={property._id} className="property-card">
            <h3>{property.title}</h3>
            <p>{property.location}</p>
            <p>${property.price.toLocaleString()}</p>
            <p>{property.bedrooms} bed, {property.bathrooms} bath</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Properties;

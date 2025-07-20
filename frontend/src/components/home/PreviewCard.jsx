import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PreviewCard = ({ to, title, description, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Link to={to} className="preview-card">
        {children} {/* This will be the 3D preview */}
        <div className="preview-content">
          <h3 className="preview-title">{title}</h3>
          <p className="preview-description">{description}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default PreviewCard;
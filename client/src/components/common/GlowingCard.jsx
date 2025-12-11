import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * GlowingCard - Interactive card with mouse-following spotlight effect
 */
export default function GlowingCard({ 
  children, 
  className = '', 
  glowColor = 'rgba(0, 227, 165, 0.15)',
  borderGlow = true,
  hoverScale = true,
  ...props 
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-2xl overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={hoverScale ? { scale: 1.02, y: -5 } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
      {...props}
    >
      {/* Spotlight Effect */}
      <motion.div
        className="absolute pointer-events-none"
        animate={{
          opacity: isHovered ? 1 : 0,
          x: mousePosition.x - 150,
          y: mousePosition.y - 150,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
        style={{
          width: 300,
          height: 300,
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          borderRadius: '50%',
        }}
      />

      {/* Border Glow */}
      {borderGlow && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          style={{
            background: `linear-gradient(135deg, ${glowColor}, transparent, ${glowColor})`,
            padding: '1px',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

/**
 * GlowingBorderCard - Card with animated gradient border
 */
export function GlowingBorderCard({ 
  children, 
  className = '',
  animate = true,
  ...props 
}) {
  return (
    <div className={`relative p-[1px] rounded-2xl overflow-hidden ${className}`} {...props}>
      {/* Animated Gradient Border */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, #00E3A5, #4FC3F7, #A855F7, #00E3A5)',
          backgroundSize: '300% 100%',
        }}
        animate={animate ? {
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        } : {}}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Inner Content */}
      <div 
        className="relative rounded-2xl h-full"
        style={{ background: 'var(--color-surface)' }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * TiltCard - 3D tilt effect on hover
 */
export function TiltCard({ 
  children, 
  className = '',
  maxTilt = 10,
  glowOnHover = true,
  ...props 
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const tiltX = ((mouseY - centerY) / centerY) * -maxTilt;
    const tiltY = ((mouseX - centerX) / centerX) * maxTilt;
    
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-2xl overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        transformPerspective: 1000,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        transformStyle: 'preserve-3d',
      }}
      {...props}
    >
      {/* Glow Effect */}
      {glowOnHover && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: isHovered ? 0.1 : 0 }}
          style={{
            background: 'linear-gradient(135deg, rgba(0, 227, 165, 0.3), rgba(79, 195, 247, 0.3))',
          }}
        />
      )}
      
      {/* Content */}
      <div style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import GlowingCard from './GlowingCard';

/**
 * BentoGrid - Modern asymmetric grid layout
 */
export default function BentoGrid({ children, className = '' }) {
  return (
    <div 
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
      style={{ gridAutoRows: 'minmax(180px, auto)' }}
    >
      {children}
    </div>
  );
}

/**
 * BentoItem - Individual grid item with size variants
 */
export function BentoItem({
  children,
  size = 'default', // 'default' | 'large' | 'wide' | 'tall'
  className = '',
  glowColor,
  delay = 0,
  ...props
}) {
  const sizeClasses = {
    default: '',
    large: 'md:col-span-2 md:row-span-2',
    wide: 'md:col-span-2',
    tall: 'md:row-span-2',
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <GlowingCard 
        className="h-full p-6" 
        glowColor={glowColor}
        {...props}
      >
        {children}
      </GlowingCard>
    </motion.div>
  );
}

/**
 * FeatureBento - Pre-styled bento grid for features
 */
export function FeatureBento({ features = [] }) {
  const sizePattern = ['large', 'default', 'default', 'wide', 'tall', 'default', 'default', 'wide'];
  const colorPattern = [
    'rgba(0, 227, 165, 0.15)',
    'rgba(79, 195, 247, 0.15)',
    'rgba(168, 85, 247, 0.15)',
    'rgba(255, 107, 157, 0.15)',
    'rgba(251, 146, 60, 0.15)',
  ];

  return (
    <BentoGrid>
      {features.map((feature, index) => {
        const Icon = feature.icon;
        const size = sizePattern[index % sizePattern.length];
        const glowColor = colorPattern[index % colorPattern.length];

        return (
          <BentoItem
            key={index}
            size={size}
            glowColor={glowColor}
            delay={index * 0.1}
          >
            <div className="h-full flex flex-col">
              {/* Icon */}
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ 
                  background: `linear-gradient(135deg, ${feature.color || '#00E3A5'}, ${feature.colorEnd || '#4FC3F7'})`,
                }}
              >
                {Icon && <Icon className="w-6 h-6 text-black" />}
              </div>

              {/* Content */}
              <h3 
                className="text-lg font-semibold mb-2"
                style={{ color: 'var(--color-text)' }}
              >
                {feature.title}
              </h3>
              
              <p 
                className="text-sm flex-1"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {feature.description}
              </p>

              {/* Optional Stats */}
              {feature.stat && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                  <span 
                    className="text-2xl font-bold"
                    style={{ 
                      background: 'var(--gradient-primary)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    {feature.stat}
                  </span>
                  {feature.statLabel && (
                    <span 
                      className="text-sm ml-2"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {feature.statLabel}
                    </span>
                  )}
                </div>
              )}

              {/* Optional Link */}
              {feature.href && (
                <a 
                  href={feature.href}
                  className="mt-4 text-sm font-medium inline-flex items-center gap-2 group"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Learn more
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              )}
            </div>
          </BentoItem>
        );
      })}
    </BentoGrid>
  );
}

/**
 * StatsBento - Bento grid for statistics
 */
export function StatsBento({ stats = [] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="p-6 rounded-2xl text-center"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <motion.div
            className="text-4xl md:text-5xl font-bold mb-2"
            style={{
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
          >
            {stat.value}
          </motion.div>
          <p 
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * ImageBento - Bento grid with images
 */
export function ImageBento({ images = [] }) {
  const sizePattern = ['large', 'default', 'tall', 'wide', 'default'];

  return (
    <BentoGrid>
      {images.map((image, index) => (
        <BentoItem
          key={index}
          size={sizePattern[index % sizePattern.length]}
          delay={index * 0.1}
          className="overflow-hidden"
        >
          <div className="relative h-full -m-6">
            <img
              src={image.src}
              alt={image.alt || ''}
              className="w-full h-full object-cover"
            />
            {image.overlay && (
              <div 
                className="absolute inset-0 flex items-end p-6"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                }}
              >
                <div>
                  {image.title && (
                    <h4 className="text-lg font-semibold text-white mb-1">
                      {image.title}
                    </h4>
                  )}
                  {image.description && (
                    <p className="text-sm text-gray-300">
                      {image.description}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </BentoItem>
      ))}
    </BentoGrid>
  );
}

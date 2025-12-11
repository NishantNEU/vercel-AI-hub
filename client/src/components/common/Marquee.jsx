import { motion } from 'framer-motion';

/**
 * Marquee - Auto-scrolling horizontal content
 */
export default function Marquee({
  children,
  speed = 30,
  direction = 'left', // 'left' | 'right'
  pauseOnHover = true,
  className = '',
}) {
  const isLeft = direction === 'left';
  
  return (
    <div 
      className={`overflow-hidden ${className}`}
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      }}
    >
      <motion.div
        className="flex gap-8"
        animate={{
          x: isLeft ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
        }}
        whileHover={pauseOnHover ? { animationPlayState: 'paused' } : {}}
        style={{
          width: 'max-content',
        }}
      >
        {/* Duplicate children for seamless loop */}
        {children}
        {children}
      </motion.div>
    </div>
  );
}

/**
 * MarqueeItem - Individual item in marquee
 */
export function MarqueeItem({ children, className = '' }) {
  return (
    <div className={`flex-shrink-0 ${className}`}>
      {children}
    </div>
  );
}

/**
 * LogoMarquee - Pre-styled marquee for logos/brands
 */
export function LogoMarquee({ 
  logos = [], 
  speed = 40,
  className = '' 
}) {
  return (
    <Marquee speed={speed} className={className}>
      {logos.map((logo, index) => (
        <div
          key={index}
          className="flex items-center justify-center px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          {typeof logo === 'string' ? (
            <img 
              src={logo} 
              alt={`Logo ${index + 1}`}
              className="h-8 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
            />
          ) : (
            logo
          )}
        </div>
      ))}
    </Marquee>
  );
}

/**
 * TestimonialMarquee - Marquee for testimonials/reviews
 */
export function TestimonialMarquee({ 
  testimonials = [],
  speed = 50,
  className = '' 
}) {
  return (
    <Marquee speed={speed} className={className}>
      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          className="flex-shrink-0 w-[350px] p-6 rounded-2xl"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            {testimonial.avatar ? (
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: 'var(--gradient-primary)' }}
              >
                {testimonial.name?.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                {testimonial.name}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {testimonial.role}
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            "{testimonial.text}"
          </p>
          {testimonial.rating && (
            <div className="flex gap-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}
                >
                  ★
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </Marquee>
  );
}

/**
 * VerticalMarquee - Vertical scrolling content
 */
export function VerticalMarquee({
  children,
  speed = 30,
  direction = 'up', // 'up' | 'down'
  className = '',
  height = '400px',
}) {
  const isUp = direction === 'up';
  
  return (
    <div 
      className={`overflow-hidden ${className}`}
      style={{
        height,
        maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
      }}
    >
      <motion.div
        className="flex flex-col gap-4"
        animate={{
          y: isUp ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

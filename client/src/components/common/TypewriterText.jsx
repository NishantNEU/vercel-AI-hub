import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TypewriterText - Animated typing effect for headlines
 */
export default function TypewriterText({
  words = ['AI Tools', 'Courses', 'Chat'],
  className = '',
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
  cursorColor = '#00E3A5',
}) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={className}>
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        style={{ color: cursorColor }}
      >
        |
      </motion.span>
    </span>
  );
}

/**
 * AnimatedText - Text that animates in word by word or letter by letter
 */
export function AnimatedText({
  text,
  className = '',
  animation = 'words', // 'words' | 'letters' | 'lines'
  delay = 0,
  staggerDelay = 0.05,
  once = true,
}) {
  const words = text.split(' ');
  const letters = text.split('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  if (animation === 'letters') {
    return (
      <motion.span
        className={className}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once }}
      >
        {letters.map((letter, i) => (
          <motion.span key={i} variants={itemVariants} className="inline-block">
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  return (
    <motion.span
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={itemVariants} className="inline-block mr-2">
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

/**
 * GradientText - Text with animated gradient
 */
export function GradientText({
  children,
  className = '',
  colors = ['#00E3A5', '#4FC3F7', '#A855F7', '#00E3A5'],
  animate = true,
  duration = 5,
}) {
  return (
    <motion.span
      className={className}
      style={{
        background: `linear-gradient(90deg, ${colors.join(', ')})`,
        backgroundSize: '300% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
      }}
      animate={animate ? {
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      } : {}}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {children}
    </motion.span>
  );
}

/**
 * CountUpNumber - Animated counting number
 */
export function CountUpNumber({
  end,
  duration = 2,
  prefix = '',
  suffix = '',
  className = '',
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated) return;
    
    const startTime = Date.now();
    const endValue = parseInt(end);
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setCount(Math.floor(easeOutQuart * endValue));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setHasAnimated(true);
      }
    };
    
    animate();
  }, [end, duration, hasAnimated]);

  return (
    <span className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}

/**
 * TextReveal - Text that reveals on scroll
 */
export function TextReveal({
  children,
  className = '',
  direction = 'up', // 'up' | 'down' | 'left' | 'right'
}) {
  const directions = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { y: 0, x: 50 },
    right: { y: 0, x: -50 },
  };

  return (
    <div className="overflow-hidden">
      <motion.div
        className={className}
        initial={{ 
          opacity: 0, 
          ...directions[direction],
          filter: 'blur(10px)',
        }}
        whileInView={{ 
          opacity: 1, 
          y: 0, 
          x: 0,
          filter: 'blur(0px)',
        }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

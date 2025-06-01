import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  to,
  asLink = false,
  className = '',
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded transition-all duration-300';
  
  // Konsistensi dalam spacing dan padding
  const sizes = {
    sm: 'text-sm px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2',
  };
  
  const variants = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800',
    secondary: 'border border-gray-200 text-gray-900 hover:border-gray-900 hover:bg-gray-50',
    outline: 'border border-gray-200 text-gray-900 hover:border-gray-900 hover:bg-transparent',
    white: 'bg-white text-gray-900 hover:bg-gray-50',
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  if (asLink || to) {
    return (
      <Link
        to={to}
        ref={ref}
        className={classes}
        {...props}
      >
        {children}
      </Link>
    );
  }
  
  return (
    <button
      ref={ref}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', error = false, children, ...props }, ref) => {
    const baseStyles =
      'block w-full rounded-lg border px-3 py-2 text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed appearance-none bg-white bg-no-repeat bg-right';

    const stateStyles = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

    // Chevron down icon as background
    const backgroundImage = `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`;

    return (
      <select
        ref={ref}
        className={`${baseStyles} ${stateStyles} ${className}`}
        style={{
          backgroundImage,
          backgroundPosition: 'right 0.5rem center',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem',
        }}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';

export default Select;

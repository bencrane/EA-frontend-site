import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error = false, ...props }, ref) => {
    const baseStyles =
      'block w-full rounded-lg border px-3 py-2 text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed resize-vertical min-h-[100px]';

    const stateStyles = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';

    return (
      <textarea
        ref={ref}
        className={`${baseStyles} ${stateStyles} ${className}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;

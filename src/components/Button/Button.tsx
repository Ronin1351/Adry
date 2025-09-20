import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

/**
 * Custom Button component that extends Material-UI Button with additional props
 * 
 * @param variant - Button variant (contained, outlined, text)
 * @param size - Button size (small, medium, large)
 * @param color - Button color (primary, secondary, error, warning, info, success)
 * @param disabled - Whether the button is disabled
 * @param loading - Whether the button is in loading state
 * @param children - Button content
 * @param onClick - Click handler function
 * @param type - Button type (button, submit, reset)
 * @param fullWidth - Whether the button should take full width
 * @param startIcon - Icon to display at the start
 * @param endIcon - Icon to display at the end
 * @param href - Link href (renders as anchor tag)
 * @param target - Link target
 * @param rel - Link rel attribute
 * @param className - Additional CSS class
 * @param sx - Additional styles
 * @param testId - Test identifier for testing
 */
export interface ButtonProps extends Omit<MuiButtonProps, 'color'> {
  /** Whether the button is in loading state */
  loading?: boolean;
  /** Test identifier for testing */
  testId?: string;
  /** Button color variant */
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

const StyledButton = styled(MuiButton)<ButtonProps>(({ theme, color = 'primary' }) => ({
  textTransform: 'none',
  fontWeight: 500,
  borderRadius: 8,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  },
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  '&.MuiButton-contained': {
    backgroundColor: theme.palette[color].main,
    color: theme.palette[color].contrastText,
    '&:hover': {
      backgroundColor: theme.palette[color].dark,
    },
  },
  '&.MuiButton-outlined': {
    borderColor: theme.palette[color].main,
    color: theme.palette[color].main,
    '&:hover': {
      backgroundColor: theme.palette[color].light,
      borderColor: theme.palette[color].dark,
    },
  },
  '&.MuiButton-text': {
    color: theme.palette[color].main,
    '&:hover': {
      backgroundColor: theme.palette[color].light,
    },
  },
}));

/**
 * Button component with loading state and accessibility features
 * 
 * @example
 * ```tsx
 * <Button 
 *   variant="contained" 
 *   color="primary" 
 *   loading={isLoading}
 *   onClick={handleClick}
 *   testId="submit-button"
 * >
 *   Submit
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = ({
  loading = false,
  disabled = false,
  children,
  testId,
  color = 'primary',
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <StyledButton
      {...props}
      color={color}
      disabled={isDisabled}
      data-testid={testId}
      aria-disabled={isDisabled}
      aria-busy={loading}
    >
      {loading ? 'Loading...' : children}
    </StyledButton>
  );
};

export default Button;

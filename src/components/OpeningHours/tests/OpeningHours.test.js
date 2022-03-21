import React from 'react';
import { render, screen } from '@testing-library/react';

import OpeningHours from '../OpeningHours';

describe('OpeningHours', () => {
  test('renders OpeningHours component', () => {
    render(<OpeningHours />);
    expect(screen.getByText('Opening Hours')).toBeInTheDocument();
  });
})
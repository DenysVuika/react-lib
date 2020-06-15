import React from 'react';
import { ExampleComponent } from '.';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('ExampleComponent', () => {
  it('renders with custom text', () => {
    const { getByText } = render(<ExampleComponent text="component works" />);
    expect(getByText('Example Component: component works')).toBeInTheDocument();
  });
});

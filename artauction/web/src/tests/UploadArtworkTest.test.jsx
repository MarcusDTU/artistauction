// javascript
// File: `artauction/web/src/tests/UploadArtworkTest.test.jsx`
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UploadArtwork from '../pages/UploadArtwork';

describe('UploadArtwork page', () => {
  let originalCreateObjectURL;
  let inputClickSpy;

  beforeAll(() => {
    // mock URL.createObjectURL and revokeObjectURL
    originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = jest.fn(() => 'blob:fake-url');
    URL.revokeObjectURL = jest.fn();
  });

  afterAll(() => {
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = undefined;
  });

  beforeEach(() => {
    // spy on input.click to assert the box forwards clicks to the hidden input
    inputClickSpy = jest.spyOn(window.HTMLInputElement.prototype, 'click');
  });

  afterEach(() => {
    inputClickSpy.mockRestore();
    jest.clearAllMocks();
  });

  test('renders heading and upload box with expected title and aria', () => {
    render(<UploadArtwork />);
    expect(screen.getByText('Upload Artwork')).toBeInTheDocument();
    const box = screen.getByLabelText('Upload images here');
    expect(box).toBeInTheDocument();
    expect(box).toHaveAttribute('role', 'button');
    expect(screen.getByText('Upload images here')).toBeInTheDocument();
  });

  test('clicking the box triggers the hidden file input click', () => {
    render(<UploadArtwork />);
    const box = screen.getByLabelText('Upload images here');
    fireEvent.click(box);
    expect(inputClickSpy).toHaveBeenCalled();
  });

  test('selecting files shows image previews and filenames', async () => {
    render(<UploadArtwork />);

    // create fake file
    const file = new File(['dummy content'], 'cool.png', { type: 'image/png' });

    // find the hidden input and dispatch a change event with files
    const input = document.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { files: [file] } });

    // wait for the preview image to appear
    const img = await screen.findByAltText('cool.png');
    expect(img).toBeInTheDocument();

    // assert the mocked URL.createObjectURL was called with the file
    expect(URL.createObjectURL).toHaveBeenCalledWith(file);

    // filename shown
    expect(screen.getByText('cool.png')).toBeInTheDocument();
  });

  test('clear selection removes previews and resets input value', () => {
    render(<UploadArtwork />);

    const file = new File(['x'], 'a.jpg', { type: 'image/jpeg' });
    const input = document.querySelector('input[type="file"]');

    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByAltText('a.jpg')).toBeInTheDocument();

    const clearBtn = screen.getByRole('button', { name: /clear selection/i }) || screen.getByText('Clear selection');
    fireEvent.click(clearBtn);

    // previews removed
    expect(screen.queryByAltText('a.jpg')).not.toBeInTheDocument();
    // input value should be reset
    expect(input.value).toBe('');
  });
});
import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
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
        render(<UploadArtwork/>);
        expect(screen.getByText('Upload Artwork')).toBeInTheDocument();
        const box = screen.getByLabelText('Upload images here');
        expect(box).toBeInTheDocument();
        expect(box).toHaveAttribute('role', 'button');
        expect(screen.getByText('Upload images here')).toBeInTheDocument();
    });

    test('clicking the box triggers the hidden file input click', () => {
        render(<UploadArtwork/>);
        const box = screen.getByLabelText('Upload images here');
        fireEvent.click(box);
        expect(inputClickSpy).toHaveBeenCalled();
    });

    test('selecting files shows image previews and filenames', async () => {
        render(<UploadArtwork/>);

        // create fake file
        const file = new File(['dummy content'], 'cool.png', {type: 'image/png'});

        // find the hidden input and dispatch a change event with files
        const input = document.querySelector('input[type="file"]');
        expect(input).toBeInTheDocument();

        fireEvent.change(input, {target: {files: [file]}});

        // wait for the preview image to appear
        const img = await screen.findByAltText('cool.png');
        expect(img).toBeInTheDocument();

        // assert the mocked URL.createObjectURL was called with the file
        expect(URL.createObjectURL).toHaveBeenCalledWith(file);

        // filename shown
        expect(screen.getByText('cool.png')).toBeInTheDocument();
    });

    test('clear selection removes previews and resets input value', () => {
        render(<UploadArtwork/>);

        const file = new File(['x'], 'a.jpg', {type: 'image/jpeg'});
        const input = document.querySelector('input[type="file"]');

        fireEvent.change(input, {target: {files: [file]}});
        expect(screen.getByAltText('a.jpg')).toBeInTheDocument();

        const clearBtn = screen.getByRole('button', {name: /clear selection/i}) || screen.getByText('Clear selection');
        fireEvent.click(clearBtn);

        // previews removed
        expect(screen.queryByAltText('a.jpg')).not.toBeInTheDocument();
        // input value should be reset
        expect(input.value).toBe('');
    });

    test('renders the two TextBox components and they are interactive', () => {
        render(<UploadArtwork/>);

        // Title box
        expect(screen.getByText('Add title')).toBeInTheDocument();
        const titleInput = screen.getByLabelText('Add title input');
        // placeholder derived from title (lowercased)
        expect(screen.getByPlaceholderText('Enter add title')).toBeInTheDocument();

        fireEvent.change(titleInput, {target: {value: 'Sunset'}});
        expect(titleInput.value).toBe('Sunset');

        // Description box
        expect(screen.getByText('Add description')).toBeInTheDocument();
        const descInput = screen.getByLabelText('Add description input');
        // description used explicit placeholder in page
        expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();

        fireEvent.change(descInput, {target: {value: 'An oil painting of a sunset'}});
        expect(descInput.value).toBe('An oil painting of a sunset');
    });

    test('renders NumberBox, accepts positive floats, rejects negatives, and focuses on container click', () => {
        render(<UploadArtwork />);

        // NumberBox title and elements
        expect(screen.getByText('Set secret price')).toBeInTheDocument();
        const nbInput = screen.getByLabelText('Set secret price input');

        // placeholder derived from title
        expect(screen.getByPlaceholderText('Enter set secret price')).toBeInTheDocument();
        // hint present
        expect(screen.getByText('Enter a positive number')).toBeInTheDocument();

        // accept standard float
        fireEvent.change(nbInput, { target: { value: '19.99' } });
        expect(nbInput.value).toBe('19.99');

        // accept leading dot
        fireEvent.change(nbInput, { target: { value: '.75' } });
        expect(nbInput.value).toBe('.75');

        // negative input should be ignored (value remains the same)
        fireEvent.change(nbInput, { target: { value: '-3' } });
        expect(nbInput.value).toBe('.75');

        // clicking the NumberBox container focuses the input
        const nbContainer = screen.getByRole('group', { name: 'Set secret price' });
        expect(document.activeElement).not.toBe(nbInput);
        fireEvent.click(nbContainer);
        expect(document.activeElement).toBe(nbInput);
    });
});
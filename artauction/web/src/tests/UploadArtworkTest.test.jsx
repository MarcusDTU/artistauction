const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import UploadArtwork from '../pages/UploadArtwork';

describe('UploadArtwork page', () => {
    let originalCreateObjectURL;
    let inputClickSpy;

    beforeAll(() => {
        originalCreateObjectURL = URL.createObjectURL;
        URL.createObjectURL = jest.fn(() => 'blob:fake-url');
        URL.revokeObjectURL = jest.fn();
    });

    afterAll(() => {
        URL.createObjectURL = originalCreateObjectURL;
        URL.revokeObjectURL = undefined;
    });

    beforeEach(() => {
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

        const file = new File(['dummy content'], 'cool.png', {type: 'image/png'});

        const input = document.querySelector('input[type="file"]');
        expect(input).toBeInTheDocument();

        fireEvent.change(input, {target: {files: [file]}});

        const img = await screen.findByAltText('cool.png');
        expect(img).toBeInTheDocument();

        expect(URL.createObjectURL).toHaveBeenCalledWith(file);
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

        expect(screen.queryByAltText('a.jpg')).not.toBeInTheDocument();
        expect(input.value).toBe('');
    });

    test('renders the two TextBox components and they are interactive', () => {
        render(<UploadArtwork/>);

        expect(screen.getByText('Add title')).toBeInTheDocument();
        const titleInput = screen.getByLabelText('Add title input');
        expect(screen.getByPlaceholderText('Enter add title')).toBeInTheDocument();
        fireEvent.change(titleInput, {target: {value: 'Sunset'}});
        expect(titleInput.value).toBe('Sunset');

        expect(screen.getByText('Add description')).toBeInTheDocument();
        const descInput = screen.getByLabelText('Add description input');
        expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
        fireEvent.change(descInput, {target: {value: 'An oil painting of a sunset'}});
        expect(descInput.value).toBe('An oil painting of a sunset');
    });

    test('renders NumberBox, accepts positive floats, rejects negatives, and focuses on container click', () => {
        render(<UploadArtwork/>);

        expect(screen.getByText('Set secret price')).toBeInTheDocument();
        const nbInput = screen.getByLabelText('Set secret price input');

        expect(screen.getByPlaceholderText('Enter set secret price')).toBeInTheDocument();
        expect(screen.getByText('Enter a positive number')).toBeInTheDocument();

        fireEvent.change(nbInput, {target: {value: '19.99'}});
        expect(nbInput.value).toBe('19.99');

        fireEvent.change(nbInput, {target: {value: '.75'}});
        expect(nbInput.value).toBe('.75');

        fireEvent.change(nbInput, {target: {value: '-3'}});
        expect(nbInput.value).toBe('.75');

        const nbContainer = screen.getByRole('group', {name: 'Set secret price'});
        expect(document.activeElement).not.toBe(nbInput);
        fireEvent.click(nbContainer);
        expect(document.activeElement).toBe(nbInput);
    });

    test('Save and exit clears selection and shows alert (no navigation)', () => {
        render(<UploadArtwork/>);

        const file = new File(['x'], 'save.jpg', {type: 'image/jpeg'});
        const input = document.querySelector('input[type="file"]');
        fireEvent.change(input, {target: {files: [file]}});
        expect(screen.getByAltText('save.jpg')).toBeInTheDocument();

        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {
        });

        const saveBtn = screen.getByRole('button', {name: /save and exit/i}) || screen.getByText('Save and exit');
        fireEvent.click(saveBtn);

        expect(screen.queryByAltText('save.jpg')).not.toBeInTheDocument();
        expect(alertSpy).toHaveBeenCalledWith('Save functionality not implemented as there is no backend.');
        expect(mockNavigate).not.toHaveBeenCalled();

        alertSpy.mockRestore();
    });

    test('Cancel upload clears selection and navigates back', () => {
        render(<UploadArtwork/>);

        const file = new File(['x'], 'cancel.jpg', {type: 'image/jpeg'});
        const input = document.querySelector('input[type="file"]');
        fireEvent.change(input, {target: {files: [file]}});
        expect(screen.getByAltText('cancel.jpg')).toBeInTheDocument();

        const cancelBtn = screen.getByRole('button', {name: /cancel upload/i}) || screen.getByText('Cancel upload');
        fireEvent.click(cancelBtn);

        expect(screen.queryByAltText('cancel.jpg')).not.toBeInTheDocument();
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
});
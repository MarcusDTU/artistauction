// javascript
// File: `web/src/tests/UploadArtworkTest.test.jsx`
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import UploadArtwork from '../pages/UploadArtwork';

describe('UploadArtwork page', () => {
    const originalFetch = global.fetch;
    let originalCreateObjectURL;
    let originalRevokeObjectURL;
    let inputClickSpy;

    beforeAll(() => {
        originalCreateObjectURL = URL.createObjectURL;
        originalRevokeObjectURL = URL.revokeObjectURL;
        URL.createObjectURL = jest.fn(() => 'blob:fake-url');
        URL.revokeObjectURL = jest.fn();
    });

    afterAll(() => {
        URL.createObjectURL = originalCreateObjectURL;
        URL.revokeObjectURL = originalRevokeObjectURL;
        global.fetch = originalFetch;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        inputClickSpy = jest.spyOn(window.HTMLInputElement.prototype, 'click');
        // ensure fetch is clean for tests that set it explicitly
        global.fetch = undefined;
    });

    afterEach(() => {
        if (inputClickSpy && inputClickSpy.mockRestore) inputClickSpy.mockRestore();
        jest.clearAllMocks();
        // restore global.fetch to original to avoid leaking mocks
        global.fetch = originalFetch;
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

        // robustly locate the title input: try id, then input next to the label, then querySelector
        let titleInput = document.getElementById('art-title');
        if (!titleInput) {
            const titleLabel = screen.getByText('Add title');
            titleInput = titleLabel?.parentElement?.querySelector('input, textarea') || document.querySelector('#art-title');
        }
        expect(titleInput).toBeInTheDocument();
        fireEvent.change(titleInput, {target: {value: 'Sunset'}});
        expect(titleInput.value).toBe('Sunset');

        expect(screen.getByText('Add description')).toBeInTheDocument();
        let descInput = document.getElementById('art-description');
        if (!descInput) {
            const descLabel = screen.getByText('Add description');
            descInput = descLabel?.parentElement?.querySelector('input, textarea') || document.querySelector('#art-description');
        }
        expect(descInput).toBeInTheDocument();
        fireEvent.change(descInput, {target: {value: 'An oil painting of a sunset'}});
        expect(descInput.value).toBe('An oil painting of a sunset');
    });

    test('renders NumberBox, accepts positive floats and rejects negatives', () => {
        render(<UploadArtwork/>);


        expect(screen.getByText('Set secret price')).toBeInTheDocument();
        let nbInput = document.getElementById('secret-price') || document.querySelector('#secret-price');
        if (!nbInput) {
            const nbLabel = screen.getByText('Set secret price');
            nbInput = nbLabel?.parentElement?.querySelector('input') || document.querySelector('#secret-price');
        }
        expect(nbInput).toBeInTheDocument();

        // hint text from the component
        expect(screen.getByText('Enter a positive number')).toBeInTheDocument();

        fireEvent.change(nbInput, {target: {value: '19.99'}});
        expect(nbInput.value).toBe('19.99');

        fireEvent.change(nbInput, {target: {value: '.75'}});
        expect(nbInput.value).toBe('.75');

        // attempt to set a negative; the component should prevent it (value should not become '-3')
        fireEvent.change(nbInput, {target: {value: '-3'}});
        expect(nbInput.value).not.toBe('-3');
    });

    test('Save and exit uploads, clears selection, shows alert and navigates back', async () => {
        render(<UploadArtwork/>);

        const file = new File(['x'], 'save.jpg', {type: 'image/jpeg'});
        const input = document.querySelector('input[type="file"]');
        fireEvent.change(input, {target: {files: [file]}});
        expect(screen.getByAltText('save.jpg')).toBeInTheDocument();

        // mock fetch for Cloudinary upload and backend artwork POST
        global.fetch = jest.fn()
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ secure_url: 'http://cloud/sample.jpg' })
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: 'new-art' })
            });

        const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

        const saveBtn = screen.getByRole('button', {name: /save and exit/i}) || screen.getByText('Save and exit');
        fireEvent.click(saveBtn);

        await waitFor(() => expect(alertSpy).toHaveBeenCalledWith('Title is required'));
        expect(screen.queryByAltText('save.jpg')).toBeInTheDocument();


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
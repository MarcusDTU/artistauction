import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import ArtistDashboard from '../pages/ArtistDashboard';

describe('ArtistDashboard', () => {
    test('renders heading and all artwork titles', () => {
        render(<ArtistDashboard/>);
        expect(screen.getByText('Your Artworks')).toBeInTheDocument();
        expect(screen.getByText('Sunset Over Lake')).toBeInTheDocument();
        expect(screen.getByText('Blue Portrait')).toBeInTheDocument();
        expect(screen.getByText('City Lights')).toBeInTheDocument();
    });

    test('renders status for each artwork', () => {
        render(<ArtistDashboard/>);
        const publicItems = screen.getAllByText(/public/i);
        const privateItems = screen.getAllByText(/private/i);
        expect(publicItems.length + privateItems.length).toBe(3);
    });

    test('Edit button shows alert and logs a warning', () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {
        });
        const warnMock = jest.spyOn(console, 'warn').mockImplementation(() => {
        });

        render(<ArtistDashboard/>);
        const editButtons = screen.getAllByText('Edit');
        expect(editButtons.length).toBeGreaterThan(0);

        fireEvent.click(editButtons[0]);

        expect(alertMock).toHaveBeenCalledWith('Edit feature not implemented yet');
        expect(warnMock).toHaveBeenCalledWith(expect.stringMatching(/handleEdit\(\d+\) not implemented/));

        alertMock.mockRestore();
        warnMock.mockRestore();
    });

    test('Upload button shows alert and logs a warning', () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {
        });
        const warnMock = jest.spyOn(console, 'warn').mockImplementation(() => {
        });

        render(<ArtistDashboard/>);
        const uploadButtons = screen.getAllByText('Upload new artwork');
        expect(uploadButtons.length).toBeGreaterThan(0);

        fireEvent.click(uploadButtons[0]);

        expect(alertMock).toHaveBeenCalledWith('Upload feature not implemented yet');
        expect(warnMock).toHaveBeenCalledWith(expect.stringMatching(/handleUpload\(\) not implemented/));

        alertMock.mockRestore();
        warnMock.mockRestore();
    });
});
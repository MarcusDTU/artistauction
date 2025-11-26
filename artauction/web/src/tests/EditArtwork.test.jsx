import React from 'react';
import '@testing-library/jest-dom';
import {render, screen, fireEvent} from '@testing-library/react';
import {MemoryRouter, Routes, Route} from 'react-router-dom';
import EditArtwork from '../pages/EditArtwork';

describe('EditArtwork page', () => {
  beforeEach(() => {
    // mock global alert so tests can assert calls
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function renderForId(id = '1') {
    return render(
      <MemoryRouter initialEntries={[`/artworks/${id}`]}>
        <Routes>
          <Route path="/artworks/:id" element={<EditArtwork />} />
        </Routes>
      </MemoryRouter>
    );
  }

  test('renders artwork title and default description when none present', () => {
    renderForId('1'); // uses fallbackArtworks id 1
    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent(/Sunset Over Lake/i);
    expect(screen.getByText(/No description provided\./i)).toBeInTheDocument();
  });

  test('allows editing and saving the description', () => {
    renderForId('1');

    // open description editor
    const editDescBtn = screen.getByLabelText(/Edit description/i);
    fireEvent.click(editDescBtn);

    // enter new description and save
    const descInput = screen.getByLabelText(/Artwork description/i);
    fireEvent.change(descInput, {target: {value: 'A beautiful evening scene.'}});

    const saveBtn = screen.getByRole('button', {name: /Save description/i});
    fireEvent.click(saveBtn);

    // updated description should appear
    expect(screen.getByText('A beautiful evening scene.')).toBeInTheDocument();
  });

  test('secret price input defaults to 69420.00 and can be set', () => {
    renderForId('1');

    // price input should initialize to stored end_price from fallback artwork
    const priceInput = screen.getByLabelText(/Secret price/i);
    expect(priceInput.value).toBe('1500.00');

    // set a new valid price
    fireEvent.change(priceInput, {target: {value: '123.45'}});
    const setBtn = screen.getByRole('button', {name: /^Set$/i});
    fireEvent.click(setBtn);

    // stored price caption should reflect the stored value from database
    expect(screen.getByText(/Current stored price:/i)).toHaveTextContent('Current stored price: 1500.00');
    // input should be formatted to two decimals after set
    expect(priceInput.value).toBe('123.45');
  });

  test('Upload more images button alerts not implemented message', () => {
    renderForId('1');

    const uploadBtn = screen.getByRole('button', {name: /Upload more images/i});
    fireEvent.click(uploadBtn);

    expect(window.alert).toHaveBeenCalledWith('Upload more images feature not implemented yet for artwork 1.');
  });
});
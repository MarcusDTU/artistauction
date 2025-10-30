// Ensure index.js bootstraps React app and calls reportWebVitals

// Mock react-dom/client to observe createRoot and render calls
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({ render: jest.fn() })),
}));

// Mock reportWebVitals to avoid side effects and assert invocation
const mockReportWebVitals = jest.fn();
jest.mock('../reportWebVitals', () => mockReportWebVitals);

test('index renders App and calls reportWebVitals', () => {
  document.body.innerHTML = '<div id="root"></div>';

  // Require after mocks and DOM setup so code executes now
  // eslint-disable-next-line global-require
  require('../index.js');

  const { createRoot } = require('react-dom/client');
  expect(createRoot).toHaveBeenCalled();
  // Access the mocked render function returned from createRoot
  const rootInstance = createRoot.mock.results[0].value;
  expect(rootInstance.render).toHaveBeenCalled();
  expect(mockReportWebVitals).toHaveBeenCalled();
});

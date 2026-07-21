import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { ChatProvider } from './Context/ChatProvider';
import api from './config/axios';
import App from './App';

jest.mock('react-lottie', () => () => null);

jest.mock('./config/axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
  },
  setAccessToken: jest.fn(),
  getAccessToken: jest.fn(),
  backendurl: 'http://localhost:4500/',
}));

// react-scripts test runs with resetMocks:true, which wipes any implementation
// given to jest.fn() at mock-factory time before every test - so it has to be
// (re)assigned here instead, where it survives the reset for this test run.
beforeEach(() => {
  api.post.mockImplementation(() => Promise.reject(new Error('no session')));
});

test('renders the login screen when there is no active session', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <ChatProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </ChatProvider>
    </MemoryRouter>
  );

  expect(await screen.findByText(/WECHAT/i)).toBeInTheDocument();
});

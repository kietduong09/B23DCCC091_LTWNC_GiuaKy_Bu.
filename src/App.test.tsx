import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { createAppStore } from './app/store';
import { ThemeProvider } from './context/ThemeContext';
import { useFilterStore } from './features/filters/filterStore';

const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true };

// Test tích hợp: render cả ứng dụng với store thật và API giả lập thật (độ trễ 500ms).
function renderApp(initialPath = '/') {
  const store = createAppStore();
  render(
    <Provider store={store}>
      <ThemeProvider>
        <MemoryRouter initialEntries={[initialPath]} future={routerFuture}>
          <App />
        </MemoryRouter>
      </ThemeProvider>
    </Provider>,
  );
  return store;
}

// Lấy khối workshop theo tên để thao tác đúng nút của workshop đó.
function getWorkshopCard(name: string): HTMLElement {
  const heading = screen.getByRole('heading', { name });
  const card = heading.closest('article');
  if (card === null) throw new Error(`Không tìm thấy thẻ workshop: ${name}`);
  return card;
}

beforeEach(() => {
  useFilterStore.getState().resetFilters();
  localStorage.clear();
});

describe('Ứng dụng Mini Workshop', () => {
  it('hiện "Đang tải..." rồi hiện danh sách workshop', async () => {
    renderApp();
    expect(screen.getByText('Đang tải...')).toBeInTheDocument();

    expect(await screen.findByRole('heading', { name: 'React cơ bản cho người mới' })).toBeInTheDocument();
    expect(screen.queryByText('Đang tải...')).not.toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(11);
  });

  it('hiện lỗi khi API thất bại và tải lại được bằng nút "Thử tải lại"', async () => {
    const user = userEvent.setup();
    renderApp('/?simulateError=true');

    expect(await screen.findByRole('alert')).toHaveTextContent('Không thể tải danh sách workshop');

    await user.click(screen.getByRole('button', { name: 'Thử tải lại' }));
    expect(await screen.findByRole('heading', { name: 'React cơ bản cho người mới' })).toBeInTheDocument();
  });

  it('đăng ký, cập nhật số chỗ rồi huỷ đăng ký', async () => {
    const user = userEvent.setup();
    renderApp();
    await screen.findByRole('heading', { name: 'React cơ bản cho người mới' });

    const card = getWorkshopCard('React cơ bản cho người mới');
    expect(within(card).getByText('Còn 20/20 chỗ')).toBeInTheDocument();

    await user.click(within(card).getByRole('button', { name: 'Đăng ký' }));
    expect(within(card).getByText('Còn 19/20 chỗ')).toBeInTheDocument();
    expect(within(card).getByText('Đã đăng ký')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Đăng ký thành công');
    expect(screen.getByText('Đã đăng ký: 1/3')).toBeInTheDocument();

    await user.click(within(card).getByRole('button', { name: 'Huỷ' }));
    expect(within(card).getByText('Còn 20/20 chỗ')).toBeInTheDocument();
    expect(within(card).getByRole('button', { name: 'Đăng ký' })).toBeEnabled();
    expect(screen.getByText('Đã đăng ký: 0/3')).toBeInTheDocument();
  });

  it('chặn đăng ký workshop thứ 4 và hiện thông báo', async () => {
    const user = userEvent.setup();
    const store = renderApp();
    await screen.findByRole('heading', { name: 'React cơ bản cho người mới' });

    const names = ['React cơ bản cho người mới', 'TypeScript trong dự án thực tế', 'Giới thiệu Machine Learning'];
    for (const name of names) {
      await user.click(within(getWorkshopCard(name)).getByRole('button', { name: 'Đăng ký' }));
    }

    const fourth = getWorkshopCard('Kỹ năng thuyết trình hiệu quả');
    await user.click(within(fourth).getByRole('button', { name: 'Đăng ký' }));

    expect(screen.getByRole('alert')).toHaveTextContent('tối đa 3 workshop');
    expect(within(fourth).getByText('Còn 20/35 chỗ')).toBeInTheDocument();
    expect(store.getState().workshops.registeredIds).toEqual([1, 2, 3]);
  });

  it('workshop hết chỗ có nút "Đăng ký" bị vô hiệu hoá', async () => {
    renderApp();
    await screen.findByRole('heading', { name: 'React cơ bản cho người mới' });

    const fullCard = getWorkshopCard('Ứng dụng ChatGPT trong học tập');
    expect(within(fullCard).getByText('Hết chỗ')).toBeInTheDocument();
    expect(within(fullCard).getByRole('button', { name: 'Đăng ký' })).toBeDisabled();
  });

  it('tìm kiếm có debounce và kết hợp với lọc chủ đề', async () => {
    const user = userEvent.setup();
    renderApp();
    await screen.findByRole('heading', { name: 'React cơ bản cho người mới' });

    await user.type(screen.getByLabelText('Tìm kiếm'), 'lê QUANG huy');
    // Vừa gõ xong, chưa đủ 300ms nên danh sách chưa bị lọc.
    expect(screen.getAllByRole('article')).toHaveLength(11);

    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(2));
    expect(screen.getByRole('heading', { name: 'Giới thiệu Machine Learning' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Thị giác máy tính với Python' })).toBeInTheDocument();

    // Kết hợp với chủ đề không khớp -> không còn kết quả.
    await user.click(screen.getByRole('button', { name: 'Lập trình' }));
    expect(screen.getByText('Không tìm thấy workshop phù hợp.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Xoá bộ lọc' }));
    // Từ khóa rỗng cũng đi qua debounce nên danh sách đầy đủ quay lại sau 300ms.
    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(11));
  });

  it('lọc theo chủ đề', async () => {
    const user = userEvent.setup();
    renderApp();
    await screen.findByRole('heading', { name: 'React cơ bản cho người mới' });

    await user.click(screen.getByRole('button', { name: 'Kỹ năng mềm' }));
    expect(screen.getAllByRole('article')).toHaveLength(3);

    await user.click(screen.getByRole('button', { name: 'Tất cả' }));
    expect(screen.getAllByRole('article')).toHaveLength(11);
  });

  it('chuyển theme sáng/tối cho toàn bộ ứng dụng', async () => {
    const user = userEvent.setup();
    renderApp();
    expect(document.documentElement.dataset.theme).toBe('light');

    await user.click(screen.getByRole('button', { name: 'Chế độ tối' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(screen.getByRole('button', { name: 'Chế độ sáng' })).toBeInTheDocument();
  });

  it('trang /stats (lazy load) hiển thị số liệu từ state', async () => {
    const user = userEvent.setup();
    renderApp('/stats');

    expect(await screen.findByRole('heading', { name: 'Thống kê' })).toBeInTheDocument();
    const rowOf = (topic: string) => screen.getByRole('row', { name: new RegExp(topic) });
    expect(rowOf('Lập trình')).toHaveTextContent('4');
    expect(rowOf('AI')).toHaveTextContent('4');
    expect(rowOf('Kỹ năng mềm')).toHaveTextContent('3');
    expect(screen.getByText('0/3')).toBeInTheDocument();

    // Đăng ký một workshop ở trang chủ rồi quay lại thống kê.
    await user.click(screen.getByRole('link', { name: 'Workshop' }));
    await user.click(within(getWorkshopCard('Prompt Engineering cơ bản')).getByRole('button', { name: 'Đăng ký' }));
    await user.click(screen.getByRole('link', { name: 'Thống kê' }));
    expect(await screen.findByText('1/3')).toBeInTheDocument();
  });
});

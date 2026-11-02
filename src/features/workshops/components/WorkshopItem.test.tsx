import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkshopItem from './WorkshopItem';
import type { Workshop } from '../types';

const workshop: Workshop = {
  id: 7,
  name: 'Prompt Engineering cơ bản',
  speaker: 'Hoàng Gia Bảo',
  topic: 'AI',
  date: '2026-11-25',
  totalSeats: 30,
  remainingSeats: 15,
};

describe('WorkshopItem', () => {
  it('hiển thị đúng thông tin workshop', () => {
    render(<WorkshopItem workshop={workshop} isRegistered={false} onRegister={jest.fn()} onCancel={jest.fn()} />);

    expect(screen.getByRole('heading', { name: 'Prompt Engineering cơ bản' })).toBeInTheDocument();
    expect(screen.getByText('Hoàng Gia Bảo')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByText('25/11/2026')).toBeInTheDocument();
    expect(screen.getByText('Còn 15/30 chỗ')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Đăng ký' })).toBeEnabled();
  });

  it('gọi onRegister với đúng ID khi bấm "Đăng ký"', async () => {
    const user = userEvent.setup();
    const onRegister = jest.fn();
    render(<WorkshopItem workshop={workshop} isRegistered={false} onRegister={onRegister} onCancel={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Đăng ký' }));

    expect(onRegister).toHaveBeenCalledTimes(1);
    expect(onRegister).toHaveBeenCalledWith(7);
  });

  it('vô hiệu hoá nút "Đăng ký" và không gọi callback khi workshop hết chỗ', async () => {
    const user = userEvent.setup();
    const onRegister = jest.fn();
    render(
      <WorkshopItem
        workshop={{ ...workshop, remainingSeats: 0 }}
        isRegistered={false}
        onRegister={onRegister}
        onCancel={jest.fn()}
      />,
    );

    const button = screen.getByRole('button', { name: 'Đăng ký' });
    expect(button).toBeDisabled();
    expect(screen.getByText('Hết chỗ')).toBeInTheDocument();

    await user.click(button);
    expect(onRegister).not.toHaveBeenCalled();
  });

  it('khi đã đăng ký thì hiện trạng thái "Đã đăng ký" và nút "Huỷ" gọi onCancel với đúng ID', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    render(<WorkshopItem workshop={workshop} isRegistered onRegister={jest.fn()} onCancel={onCancel} />);

    expect(screen.getByText('Đã đăng ký')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Đăng ký' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Huỷ' }));
    expect(onCancel).toHaveBeenCalledWith(7);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { successResponse, errorResponse } from './response';

const createMockContext = () => {
  return {
    json: vi.fn().mockImplementation((body, status) => ({ body, status })),
  } as any;
};

describe('response helpers', () => {
  it('successResponse should return success payload and status', () => {
    const c = createMockContext();
    const data = { id: 1 };

    const res = successResponse(c, data, 'ok', 201);

    expect(c.json).toHaveBeenCalledWith(
      { success: true, message: 'ok', data },
      201,
    );
    expect(res.body?.success).toBe(true);
    expect(res.status).toBe(201);
  });

  it('errorResponse should return error payload and status', () => {
    const c = createMockContext();

    const res = errorResponse(c, 'bad', 400);

    expect(c.json).toHaveBeenCalledWith(
      { success: false, message: 'bad' },
      400,
    );
    expect(res.body?.success).toBe(false);
    expect(res.status).toBe(400);
  });
});

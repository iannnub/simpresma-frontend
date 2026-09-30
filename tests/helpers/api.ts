import { APIRequestContext } from '@playwright/test';

export async function apiLogin(
  request: APIRequestContext,
  email: string = 'mhs.si@test.com',
  password: string = 'password'
): Promise<string> {
  const response = await request.post('http://localhost:8000/api/auth/login', {
    data: { email, password },
  });

  const body = await response.json();
  return body.data?.token || '';
}

export async function apiCreatePengajuan(
  request: APIRequestContext,
  token: string,
  data: any
): Promise<any> {
  const response = await request.post('http://localhost:8000/api/mahasiswa/pengajuan', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    data,
  });

  return response.json();
}

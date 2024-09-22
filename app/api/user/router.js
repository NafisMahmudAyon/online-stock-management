// app/api/user/route.ts

import { NextResponse } from 'next/server';
import { getUserFromToken } from '@/utils/auth';

export async function GET(request) {
	const token = request.headers.get('Authorization')?.replace('Bearer ', '');

	if (!token) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const user = await getUserFromToken(token);

	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	return NextResponse.json({ user });
}
